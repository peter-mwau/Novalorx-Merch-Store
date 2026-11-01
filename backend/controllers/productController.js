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
  "description",
  "priceCents",
  "currency",
  "sku",
  "stock",
  "isActive",
];

const integerFields = new Set([
  "priceCents",
  "stock",
]);

const booleanFields = new Set(["isActive"]);

const getProductData = (body, { partial = false } = {}) => {
  const data = {};

  for (const field of productFields) {
    if (body[field] === undefined && partial) continue;
    if (body[field] === undefined) continue;

    if (integerFields.has(field)) {
      const value = Number(body[field]);
      if (!Number.isInteger(value) || value < 0) {
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
    } else if (body[field] !== null && typeof body[field] !== "string") {
      const error = new Error(`${field} must be a string`);
      error.statusCode = 400;
      throw error;
    } else {
      data[field] = typeof body[field] === "string" ? body[field].trim() : body[field];
    }
  }

  if (!partial) {
    for (const field of ["categoryId", "name", "slug", "priceCents"]) {
      if (data[field] === undefined || data[field] === null || data[field] === "") {
        const error = new Error(`${field} is required`);
        error.statusCode = 400;
        throw error;
      }
    }
  }

  if (data.currency !== undefined && (data.currency === null || data.currency.length !== 3)) {
    const error = new Error("currency must be a 3-letter code");
    error.statusCode = 400;
    throw error;
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
    ? body.variants.map((variant, index) => {
        const priceCents = variant.priceCents === null || variant.priceCents === "" || variant.priceCents === undefined
          ? null
          : Number(variant.priceCents);
        const stock = Number(variant.stock ?? 0);
        const weightGrams = variant.weightGrams === null || variant.weightGrams === "" || variant.weightGrams === undefined
          ? null
          : Number(variant.weightGrams);
        if (!variant.name || !Number.isInteger(stock) || stock < 0 ||
          (priceCents !== null && (!Number.isInteger(priceCents) || priceCents < 0)) ||
          (weightGrams !== null && (!Number.isInteger(weightGrams) || weightGrams < 0))) {
          const error = new Error("Each variant must have a name and valid non-negative numeric values");
          error.statusCode = 400;
          throw error;
        }
        return {
        name: typeof variant.name === "string" ? variant.name.trim() : "",
        sku: variant.sku || null,
        barcode: variant.barcode || null,
        priceCents,
        stock,
        weightGrams,
        attributes: variant.attributes || {},
        imageUrl: variant.imageUrl || null,
        sortOrder: variant.sortOrder ?? index,
        isActive: variant.isActive ?? true,
        };
      })
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

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
    return res.json(categories);
  } catch (error) {
    return sendError(res, error, "Error fetching categories:");
  }
};

export const createCategory = async (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const slug = typeof req.body.slug === "string" ? req.body.slug.trim().toLowerCase() : "";
  if (!name || !slug) {
    return res.status(400).json({ error: "Category name and slug are required" });
  }
  try {
    const category = await prisma.category.create({
      data: { name, slug },
      select: { id: true, name: true, slug: true },
    });
    return res.status(201).json(category);
  } catch (error) {
    return sendError(res, error, "Error creating category:");
  }
};

const validateCategory = async (categoryId) => {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    const error = new Error("Selected category does not exist");
    error.statusCode = 400;
    throw error;
  }
};

export const getAllProducts = async (req, res) => {
  const { page = 1, limit = 20, categoryId, isActive, search } = req.query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (!Number.isInteger(pageNumber) || pageNumber < 1 || !Number.isInteger(limitNumber) || limitNumber < 1) {
    return res.status(400).json({ error: "page and limit must be positive integers" });
  }

  const where = {
    ...(categoryId ? { categoryId } : {}),
    ...(isActive !== undefined ? { isActive: isActive === "true" } : {}),
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
    await validateCategory(data.categoryId);
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
    if (data.categoryId) await validateCategory(data.categoryId);
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
