import { prisma } from "../lib/prisma.ts";

const productInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" } },
  variants: { orderBy: { sortOrder: "asc" } },
  tags: { include: { tag: true } },
};

const productFields = [
  "categoryId",
  "name",
  "slug",
  "shortDescription",
  "description",
  "priceCents",
  "compareAtCents",
  "costCents",
  "currency",
  "sku",
  "barcode",
  "stock",
  "weightGrams",
  "hasVariants",
  "requiresShipping",
  "taxClass",
  "metaTitle",
  "metaDescription",
  "isActive",
  "isFeatured",
  "publishedAt",
];

const integerFields = new Set([
  "priceCents",
  "compareAtCents",
  "costCents",
  "stock",
  "weightGrams",
]);

const booleanFields = new Set([
  "hasVariants",
  "requiresShipping",
  "isActive",
  "isFeatured",
]);

const getProductData = (body, { partial = false } = {}) => {
  const data = {};

  for (const field of productFields) {
    if (body[field] === undefined && partial) continue;
    if (body[field] === undefined) continue;

    if (integerFields.has(field)) {
      const value = Number(body[field]);
      if (!Number.isInteger(value)) {
        const error = new Error(`${field} must be an integer`);
        error.statusCode = 400;
        throw error;
      }
      data[field] = value;
    } else if (booleanFields.has(field)) {
      if (typeof body[field] !== "boolean") {
        const error = new Error(`${field} must be a boolean`);
        error.statusCode = 400;
        throw error;
      }
      data[field] = body[field];
    } else if (field === "publishedAt") {
      if (body[field] === null || body[field] === "") {
        data[field] = null;
      } else {
        const date = new Date(body[field]);
        if (Number.isNaN(date.getTime())) {
          const error = new Error("publishedAt must be a valid date");
          error.statusCode = 400;
          throw error;
        }
        data[field] = date;
      }
    } else {
      data[field] = body[field];
    }
  }

  if (!partial) {
    for (const field of ["categoryId", "name", "slug", "priceCents"]) {
      if (data[field] === undefined || data[field] === "") {
        const error = new Error(`${field} is required`);
        error.statusCode = 400;
        throw error;
      }
    }
  }

  return data;
};

const getNestedData = (body) => {
  const images = Array.isArray(body.images)
    ? body.images.map((image, index) => ({
        url: image.url,
        alt: image.alt || null,
        sortOrder: image.sortOrder ?? index,
      }))
    : undefined;
  const variants = Array.isArray(body.variants)
    ? body.variants.map((variant, index) => ({
        name: variant.name,
        sku: variant.sku || null,
        barcode: variant.barcode || null,
        priceCents: variant.priceCents ?? null,
        stock: variant.stock ?? 0,
        weightGrams: variant.weightGrams ?? null,
        attributes: variant.attributes || {},
        imageUrl: variant.imageUrl || null,
        sortOrder: variant.sortOrder ?? index,
        isActive: variant.isActive ?? true,
      }))
    : undefined;

  return { images, variants };
};

const sendError = (res, error, message) => {
  console.error(message, error);
  if (error.statusCode) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  if (error.code === "P2002") {
    return res.status(409).json({ error: "A product with this unique value already exists" });
  }
  if (error.code === "P2025") {
    return res.status(404).json({ error: "Product or related record not found" });
  }
  if (error.code === "P2003") {
    return res.status(409).json({ error: "Product cannot be removed because it is in use" });
  }
  return res.status(500).json({ error: "Internal server error" });
};

export const getAllProducts = async (req, res) => {
  const { page = 1, limit = 20, categoryId, isActive, isFeatured, search } = req.query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (!Number.isInteger(pageNumber) || pageNumber < 1 || !Number.isInteger(limitNumber) || limitNumber < 1) {
    return res.status(400).json({ error: "page and limit must be positive integers" });
  }

  const where = {
    ...(categoryId ? { categoryId } : {}),
    ...(isActive !== undefined ? { isActive: isActive === "true" } : {}),
    ...(isFeatured !== undefined ? { isFeatured: isFeatured === "true" } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { slug: { contains: search } },
            { sku: { contains: search } },
          ],
        }
      : {}),
  };

  try {
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: { createdAt: "desc" },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      }),
      prisma.product.count({ where }),
    ]);

    return res.json({
      products,
      total,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    return sendError(res, error, "Error fetching products:");
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: productInclude,
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json(product);
  } catch (error) {
    return sendError(res, error, "Error fetching product:");
  }
};

export const createProduct = async (req, res) => {
  try {
    const data = getProductData(req.body);
    const { images, variants } = getNestedData(req.body);
    const product = await prisma.product.create({
      data: {
        ...data,
        ...(images ? { images: { create: images } } : {}),
        ...(variants ? { variants: { create: variants } } : {}),
      },
      include: productInclude,
    });
    return res.status(201).json(product);
  } catch (error) {
    return sendError(res, error, "Error creating product:");
  }
};

export const updateProduct = async (req, res) => {
  try {
    const data = getProductData(req.body, { partial: true });
    const { images, variants } = getNestedData(req.body);
    const nestedOperations = {};

    if (images) {
      nestedOperations.images = {
        deleteMany: {},
        create: images,
      };
    }
    if (variants) {
      nestedOperations.variants = {
        deleteMany: {},
        create: variants,
      };
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { ...data, ...nestedOperations },
      include: productInclude,
    });
    return res.json(product);
  } catch (error) {
    return sendError(res, error, "Error updating product:");
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return sendError(res, error, "Error deleting product:");
  }
};
