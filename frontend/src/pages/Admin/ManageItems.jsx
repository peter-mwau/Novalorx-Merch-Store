import { useEffect, useMemo, useState } from "react";
import { Edit3, ImagePlus, Plus, Search, Trash2, X } from "lucide-react";
import { useProducts } from "../../contexts/productsContext.jsx";
import { useTheme } from "../../contexts/themeContext.jsx";

const emptyProduct = {
  name: "",
  slug: "",
  categoryId: "",
  description: "",
  priceCents: 0,
  sku: "",
  stock: 0,
  currency: "USD",
  isActive: true,
  images: [],
};

const generateSku = (name) =>
  name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase()
    .slice(0, 40);

const money = (cents, currency) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
    cents || 0,
  );

function ManageItems() {
  const {
    products,
    categories,
    getAllProducts,
    getCategories,
    createCategory,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const { darkMode } = useTheme();
  const [query, setQuery] = useState("");
  const [formProduct, setFormProduct] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [variantOptions, setVariantOptions] = useState([
    { name: "Color", values: "" },
    { name: "Size", values: "" },
  ]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageColor, setImageColor] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [categoryName, setCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllProducts().catch((loadError) => setError(loadError.message));
    getCategories().catch((loadError) => setError(loadError.message));
  }, [getAllProducts, getCategories]);

  const filteredProducts = useMemo(() => {
    const search = query.toLowerCase();
    return products.filter((product) =>
      [product.name, product.slug, product.sku].some((value) =>
        value?.toLowerCase().includes(search),
      ),
    );
  }, [products, query]);

  const panel = darkMode
    ? "bg-slate-950/80 text-white ring-white/10"
    : "bg-white text-slate-900 ring-slate-200";
  const muted = darkMode ? "text-slate-400" : "text-slate-500";
  const input = darkMode
    ? "bg-white/5 text-white ring-white/10 placeholder:text-slate-500"
    : "bg-slate-50 text-slate-900 ring-slate-200 placeholder:text-slate-400";

  const openProductForm = (product = emptyProduct) => {
    const existingAttributes = product.variants?.reduce((result, variant) => {
      Object.entries(variant.attributes || {}).forEach(([name, value]) => {
        result[name] = [...new Set([...(result[name] || []), value])];
      });
      return result;
    }, {});
    setFormProduct({
      ...product,
      images: product.images?.map((image) => ({ ...image })) || [],
      variants: product.variants?.map((variant) => ({ ...variant })) || [],
    });
    setFormStep(1);
    setVariantOptions(
      Object.keys(existingAttributes).length
        ? Object.entries(existingAttributes).map(([name, values]) => ({
            name,
            values: values.join(", "),
          }))
        : [
            { name: "Color", values: "" },
            { name: "Size", values: "" },
          ],
    );
    setImageUrl("");
    setImageColor("");
    setError("");
    setFieldErrors({});
    setCategoryName("");
  };

  const updateFormProduct = (key, value) => {
    setFormProduct((current) => {
      const next = { ...current, [key]: value };
      if (
        key === "name" &&
        !current.id &&
        (!current.sku || current.sku === generateSku(current.name))
      ) {
        next.sku = generateSku(value);
      }
      return next;
    });
    setFieldErrors((current) => ({ ...current, [key]: "" }));
  };

  const validateDetails = () => {
    const errors = {};
    for (const field of ["name", "slug", "categoryId"]) {
      if (!formProduct[field]?.trim())
        errors[field] = "This field is required.";
    }
    if (
      formProduct.categoryId &&
      !categories.some((category) => category.id === formProduct.categoryId)
    ) {
      errors.categoryId = "Choose a valid category.";
    }
    if (
      !Number.isInteger(Number(formProduct.priceCents)) ||
      Number(formProduct.priceCents) < 0
    ) {
      errors.priceCents = "Enter a non-negative integer.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goToNextStep = () => {
    if (formStep === 1 && !validateDetails()) return;
    setError("");
    setFormStep((step) => Math.min(4, step + 1));
  };

  const updateVariantOption = (index, key, value) => {
    setVariantOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index ? { ...option, [key]: value } : option,
      ),
    );
  };

  const generateVariants = () => {
    const options = variantOptions
      .map((option) => ({
        name: option.name.trim(),
        values: option.values
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      }))
      .filter((option) => option.name && option.values.length);
    if (!options.length) {
      setError(
        "Add at least one option with values, such as Color: Black, White.",
      );
      return;
    }
    const combinations = options.reduce(
      (result, option) =>
        result.flatMap((combination) =>
          option.values.map((value) => ({
            ...combination,
            [option.name]: value,
          })),
        ),
      [{}],
    );
    setFormProduct((current) => ({
      ...current,
      variants: combinations.map((attributes, index) => {
        const existing = current.variants?.find(
          (variant) =>
            JSON.stringify(variant.attributes) === JSON.stringify(attributes),
        );
        return (
          existing || {
            name: Object.values(attributes).join(" / "),
            sku: "",
            priceCents: "",
            stock: 0,
            attributes,
            sortOrder: index,
            isActive: true,
          }
        );
      }),
    }));
    setError("");
  };

  const updateVariant = (index, key, value) => {
    setFormProduct((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, [key]: value } : variant,
      ),
    }));
  };

  const addImage = () => {
    const url = imageUrl.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      setError("Enter a valid image URL.");
      return;
    }
    setFormProduct((current) => ({
      ...current,
      images: [
        ...(current.images || []),
        {
          url,
          color: imageColor.trim() || null,
          sortOrder: current.images?.length || 0,
        },
      ],
    }));
    setImageUrl("");
    setImageColor("");
    setError("");
  };

  const addSelectedImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch("/api/admin/product-images", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "The image could not be uploaded.");
      }
      const uploadedImage = await response.json();
      setFormProduct((current) => ({
        ...current,
        images: [
          ...(current.images || []),
          {
            url: uploadedImage.url,
            alt: uploadedImage.alt,
            color: imageColor.trim() || null,
            sortOrder: current.images?.length || 0,
          },
        ],
      }));
      setImageColor("");
      setError("");
    } catch (uploadError) {
      setError(uploadError.message);
    }
  };

  const removeImage = (index) => {
    setFormProduct((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const updateImage = (index, key, value) => {
    setFormProduct((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index ? { ...image, [key]: value } : image,
      ),
    }));
  };

  const addCategory = async () => {
    const name = categoryName.trim();
    if (!name) return;
    setCreatingCategory(true);
    setError("");
    try {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const category = await createCategory({ name, slug });
      updateFormProduct("categoryId", category.id);
      setCategoryName("");
    } catch (categoryError) {
      setError(categoryError.message);
    } finally {
      setCreatingCategory(false);
    }
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    if (!validateDetails()) {
      setFormStep(1);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        categoryId: formProduct.categoryId.trim(),
        name: formProduct.name.trim(),
        slug: formProduct.slug.trim(),
        description: formProduct.description?.trim() || null,
        currency: (formProduct.currency || "USD").trim().toUpperCase(),
        sku: formProduct.sku?.trim() || null,
        priceCents: Number(formProduct.priceCents),
        stock: formProduct.variants?.length
          ? formProduct.variants.reduce(
              (total, variant) => total + Number(variant.stock || 0),
              0,
            )
          : Number(formProduct.stock),
        images: formProduct.images.filter((image) => image.url),
        variants: formProduct.variants?.map((variant, index) => ({
          ...variant,
          name:
            variant.name || Object.values(variant.attributes || {}).join(" / "),
          priceCents:
            variant.priceCents === "" ? null : Number(variant.priceCents),
          stock: Number(variant.stock || 0),
          sortOrder: index,
        })),
      };
      if (!payload.currency || payload.currency.length !== 3) {
        throw new Error("Currency must be a 3-letter code");
      }
      if (formProduct.id) {
        await updateProduct(formProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      setFormProduct(null);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setSaving(true);
    setError("");
    try {
      await deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">
            Catalog administration
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Manage items
          </h1>
          <p className={`mt-2 ${muted}`}>
            Create, update, publish, and remove products.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ${input}`}
          >
            <Search size={18} className={muted} />
            <input
              className="w-44 bg-transparent text-sm outline-none"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products..."
              value={query}
            />
          </div>
          <button
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600"
            onClick={() => openProductForm()}
            type="button"
          >
            <Plus size={18} /> Add product
          </button>
        </div>
      </header>

      {error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {error}
        </p>
      )}

      <section className={`overflow-hidden rounded-2xl ring-1 ${panel}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className={darkMode ? "bg-white/[0.04]" : "bg-slate-50"}>
              <tr>
                {["Product", "Price", "Stock", "Status", "Actions"].map(
                  (heading) => (
                    <th
                      className={`px-5 py-4 font-semibold ${muted}`}
                      key={heading}
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/10">
              {filteredProducts.map((product) => (
                <tr
                  className="transition hover:bg-cyan-500/[0.04]"
                  key={product.id}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.images?.[0]?.url ? (
                        <img
                          className="h-11 w-11 rounded-lg object-cover"
                          src={product.images[0].url}
                          alt=""
                        />
                      ) : (
                        <div
                          className={`grid h-11 w-11 place-items-center rounded-lg ${darkMode ? "bg-white/5" : "bg-slate-100"}`}
                        >
                          <ImagePlus size={18} className={muted} />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className={`mt-1 text-xs ${muted}`}>
                          {product.sku || product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium">
                    {money(product.priceCents, product.currency)}
                  </td>
                  <td
                    className={`px-5 py-4 ${product.stock === 0 ? "text-red-500" : ""}`}
                  >
                    {product.stock}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-400"}`}
                    >
                      {product.isActive ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        className="rounded-lg p-2 text-cyan-500 hover:bg-cyan-500/10"
                        onClick={() => openProductForm(product)}
                        title="Edit product"
                        type="button"
                      >
                        <Edit3 size={17} />
                      </button>
                      <button
                        className="rounded-lg p-2 text-red-500 hover:bg-red-500/10"
                        onClick={() => setDeletingProduct(product)}
                        title="Delete product"
                        type="button"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filteredProducts.length && (
          <p className={`px-5 py-10 text-center ${muted}`}>
            No products match your search.
          </p>
        )}
      </section>

      {formProduct && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/70 p-4"
          role="dialog"
        >
          <form
            className={`my-8 w-full max-w-2xl space-y-4 rounded-2xl p-6 ring-1 ${panel}`}
            onSubmit={submitProduct}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {formProduct.id ? "Edit product" : "Add product"}
                </h2>
                <p className={`mt-1 text-sm ${muted}`}>Step {formStep} of 4</p>
              </div>
              <button onClick={() => setFormProduct(null)} type="button">
                <X />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["Details", "Images", "Variants", "Review"].map(
                (label, index) => (
                  <div
                    className={`rounded-lg px-2 py-2 text-center text-xs font-semibold ${formStep === index + 1 ? "bg-cyan-500 text-white" : darkMode ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-500"}`}
                    key={label}
                  >
                    {index + 1}. {label}
                  </div>
                ),
              )}
            </div>
            {formStep === 1 && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["name", "Name", "text"],
                    ["slug", "Slug", "text"],
                    ["sku", "SKU", "text"],
                    ["priceCents", "Price (cents)", "number"],
                    ["stock", "Stock", "number"],
                    ["currency", "Currency", "text"],
                  ].map(([key, label, type]) => (
                    <label className="block text-sm font-medium" key={key}>
                      {label}
                      <input
                        aria-invalid={Boolean(fieldErrors[key])}
                        className={`mt-2 w-full rounded-xl px-3 py-2.5 ring-1 outline-none focus:ring-cyan-500 ${fieldErrors[key] ? "ring-red-500" : ""} ${input}`}
                        min={type === "number" ? "0" : undefined}
                        onChange={(event) =>
                          updateFormProduct(key, event.target.value)
                        }
                        type={type}
                        value={formProduct[key] ?? ""}
                      />
                      {fieldErrors[key] && (
                        <span className="mt-1 block text-xs text-red-500">
                          {fieldErrors[key]}
                        </span>
                      )}
                    </label>
                  ))}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Category
                      <select
                        aria-invalid={Boolean(fieldErrors.categoryId)}
                        className={`mt-2 w-full rounded-xl px-3 py-2.5 ring-1 outline-none focus:ring-cyan-500 ${fieldErrors.categoryId ? "ring-red-500" : ""} ${input}`}
                        onChange={(event) =>
                          updateFormProduct("categoryId", event.target.value)
                        }
                        value={formProduct.categoryId}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.categoryId && (
                        <span className="mt-1 block text-xs text-red-500">
                          {fieldErrors.categoryId}
                        </span>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <input
                        className={`min-w-0 flex-1 rounded-lg px-3 py-2 text-sm ring-1 outline-none focus:ring-cyan-500 ${input}`}
                        onChange={(event) =>
                          setCategoryName(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addCategory();
                          }
                        }}
                        placeholder="New category name"
                        value={categoryName}
                      />
                      <button
                        className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-600 disabled:opacity-50"
                        disabled={creatingCategory || !categoryName.trim()}
                        onClick={addCategory}
                        type="button"
                      >
                        {creatingCategory ? "Adding..." : "Add category"}
                      </button>
                    </div>
                  </div>
                </div>
                <label className="block text-sm font-medium">
                  Description
                  <textarea
                    className={`mt-2 min-h-28 w-full rounded-xl px-3 py-2.5 ring-1 outline-none focus:ring-cyan-500 ${input}`}
                    onChange={(event) =>
                      updateFormProduct("description", event.target.value)
                    }
                    value={formProduct.description || ""}
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    checked={formProduct.isActive}
                    onChange={(event) =>
                      updateFormProduct("isActive", event.target.checked)
                    }
                    type="checkbox"
                  />{" "}
                  Active
                </label>
              </div>
            )}
            {formStep === 2 && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <input
                    className={`w-32 rounded-xl px-3 py-2.5 ring-1 outline-none focus:ring-cyan-500 ${input}`}
                    onChange={(event) => setImageColor(event.target.value)}
                    placeholder="Color (e.g. White)"
                    value={imageColor}
                  />
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 font-semibold text-white hover:bg-cyan-600">
                    <ImagePlus size={17} /> Choose file
                    <input
                      accept="image/*"
                      className="sr-only"
                      onChange={addSelectedImage}
                      type="file"
                    />
                  </label>
                  <input
                    className={`min-w-0 flex-1 rounded-xl px-3 py-2.5 ring-1 outline-none focus:ring-cyan-500 ${input}`}
                    onChange={(event) => setImageUrl(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addImage();
                      }
                    }}
                    placeholder="Or paste an image URL"
                    type="url"
                    value={imageUrl}
                  />
                  <button
                    className={`rounded-xl px-4 py-2.5 font-semibold ${darkMode ? "bg-white/10" : "bg-slate-100"}`}
                    onClick={addImage}
                    type="button"
                  >
                    Add URL
                  </button>
                </div>
                {!formProduct.images?.length && (
                  <p
                    className={`rounded-xl border border-dashed p-8 text-center text-sm ${muted}`}
                  >
                    Add one or more image URLs to preview them here.
                  </p>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  {formProduct.images?.map((image, index) => (
                    <div
                      className={`overflow-hidden rounded-xl ring-1 ${darkMode ? "ring-white/10" : "ring-slate-200"}`}
                      key={`${image.url}-${index}`}
                    >
                      <div className="relative aspect-video bg-slate-100">
                        <img
                          className="h-full w-full object-cover"
                          src={image.url}
                          alt={`${formProduct.name || "Product"} preview ${index + 1}`}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                        <button
                          className="absolute right-2 top-2 rounded-full bg-slate-950/70 p-1.5 text-white"
                          onClick={() => removeImage(index)}
                          type="button"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="space-y-2 p-3">
                        <input
                          className={`w-full rounded-lg px-2 py-2 text-sm ring-1 outline-none focus:ring-cyan-500 ${input}`}
                          onChange={(event) =>
                            updateImage(index, "color", event.target.value)
                          }
                          placeholder="Color (e.g. White)"
                          value={image.color || ""}
                        />
                        <p className={`truncate text-xs ${muted}`}>
                          {image.url}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {formStep === 3 && (
              <div className="space-y-4">
                <p className={`text-sm ${muted}`}>
                  Define options and values. For example, Color: Black, White
                  and Size: S, M, L creates six variants.
                </p>
                {variantOptions.map((option, index) => (
                  <div className="flex gap-2" key={`${option.name}-${index}`}>
                    <input
                      className={`w-32 rounded-xl px-3 py-2.5 ring-1 outline-none focus:ring-cyan-500 ${input}`}
                      onChange={(event) =>
                        updateVariantOption(index, "name", event.target.value)
                      }
                      placeholder="Option name"
                      value={option.name}
                    />
                    <input
                      className={`min-w-0 flex-1 rounded-xl px-3 py-2.5 ring-1 outline-none focus:ring-cyan-500 ${input}`}
                      onChange={(event) =>
                        updateVariantOption(index, "values", event.target.value)
                      }
                      placeholder="Values separated by commas"
                      value={option.values}
                    />
                    <button
                      className={`rounded-xl px-3 ${darkMode ? "bg-white/10" : "bg-slate-100"}`}
                      onClick={() =>
                        setVariantOptions((current) =>
                          current.filter(
                            (_, optionIndex) => optionIndex !== index,
                          ),
                        )
                      }
                      type="button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    className={`rounded-xl px-3 py-2 text-sm font-semibold ${darkMode ? "bg-white/10" : "bg-slate-100"}`}
                    onClick={() =>
                      setVariantOptions((current) => [
                        ...current,
                        { name: "", values: "" },
                      ])
                    }
                    type="button"
                  >
                    Add option
                  </button>
                  <button
                    className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white"
                    onClick={generateVariants}
                    type="button"
                  >
                    Generate combinations
                  </button>
                </div>
                {formProduct.variants?.map((variant, index) => (
                  <div
                    className={`grid gap-2 rounded-xl p-3 ring-1 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] ${darkMode ? "bg-white/5 ring-white/10" : "bg-slate-50 ring-slate-200"}`}
                    key={`${variant.name}-${index}`}
                  >
                    <div className="text-sm font-medium">{variant.name}</div>
                    <input
                      className={`rounded-lg px-2 py-2 text-sm ring-1 ${input}`}
                      onChange={(event) =>
                        updateVariant(index, "sku", event.target.value)
                      }
                      placeholder="SKU"
                      value={variant.sku || ""}
                    />
                    <input
                      className={`rounded-lg px-2 py-2 text-sm ring-1 ${input}`}
                      min="0"
                      onChange={(event) =>
                        updateVariant(index, "priceCents", event.target.value)
                      }
                      placeholder="Price override"
                      type="number"
                      value={variant.priceCents ?? ""}
                    />
                    <input
                      className={`rounded-lg px-2 py-2 text-sm ring-1 ${input}`}
                      min="0"
                      onChange={(event) =>
                        updateVariant(index, "stock", event.target.value)
                      }
                      placeholder="Stock"
                      type="number"
                      value={variant.stock ?? 0}
                    />
                  </div>
                ))}
              </div>
            )}
            {formStep === 4 && (
              <div className="space-y-4">
                <div
                  className={`rounded-xl p-4 ${darkMode ? "bg-white/5" : "bg-slate-50"}`}
                >
                  <h3 className="font-semibold">
                    {formProduct.name || "Untitled product"}
                  </h3>
                  <p className={`mt-1 text-sm ${muted}`}>
                    {formProduct.description || "No description"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    <span>
                      {money(
                        Number(formProduct.priceCents),
                        formProduct.currency || "USD",
                      )}
                    </span>
                    <span>{formProduct.stock} in stock</span>
                    <span>{formProduct.isActive ? "Active" : "Draft"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {formProduct.images?.map((image, index) => (
                    <img
                      className="aspect-square w-full rounded-lg object-cover"
                      key={`${image.url}-review-${index}`}
                      src={image.url}
                      alt=""
                    />
                  ))}
                </div>
                {formProduct.variants?.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Variants</h3>
                    {formProduct.variants.map((variant) => (
                      <div
                        className={`flex justify-between rounded-lg px-3 py-2 text-sm ${darkMode ? "bg-white/5" : "bg-slate-50"}`}
                        key={variant.name}
                      >
                        <span>{variant.name}</span>
                        <span>{variant.stock} in stock</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-between gap-3 pt-2">
              <button
                className={`rounded-xl px-4 py-2.5 ring-1 ${input}`}
                disabled={saving || formStep === 1}
                onClick={() => setFormStep((step) => step - 1)}
                type="button"
              >
                Back
              </button>
              {formStep < 4 ? (
                <button
                  className="rounded-xl bg-cyan-500 px-5 py-2.5 font-semibold text-white hover:bg-cyan-600"
                  onClick={goToNextStep}
                  type="button"
                >
                  Next
                </button>
              ) : (
                <button
                  className="rounded-xl bg-cyan-500 px-5 py-2.5 font-semibold text-white hover:bg-cyan-600 disabled:opacity-50"
                  disabled={saving}
                  type="submit"
                >
                  {saving
                    ? "Saving..."
                    : formProduct.id
                      ? "Save changes"
                      : "Create product"}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {deletingProduct && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4"
          role="dialog"
        >
          <div
            className={`w-full max-w-md space-y-5 rounded-2xl p-6 ring-1 ${panel}`}
          >
            <h2 className="text-xl font-bold">Delete product?</h2>
            <p className={muted}>
              This permanently removes{" "}
              <strong className="text-current">{deletingProduct.name}</strong>.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className={`rounded-xl px-4 py-2.5 ring-1 ${input}`}
                onClick={() => setDeletingProduct(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-red-500 px-4 py-2.5 font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                disabled={saving}
                onClick={confirmDelete}
                type="button"
              >
                {saving ? "Deleting..." : "Delete product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageItems;
