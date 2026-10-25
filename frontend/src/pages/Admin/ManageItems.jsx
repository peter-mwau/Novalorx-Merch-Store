import { useEffect, useMemo, useState } from "react";
import { Edit3, ImagePlus, Plus, Search, Trash2, X } from "lucide-react";
import { useProducts } from "../../contexts/productsContext.jsx";
import { useTheme } from "../../contexts/themeContext.jsx";

const emptyProduct = {
  name: "",
  slug: "",
  categoryId: "",
  shortDescription: "",
  description: "",
  priceCents: 0,
  compareAtCents: "",
  sku: "",
  stock: 0,
  currency: "USD",
  isActive: true,
  isFeatured: false,
  hasVariants: false,
  requiresShipping: true,
  images: [],
};

const money = (cents, currency) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
    (cents || 0) / 100,
  );

function ManageItems() {
  const {
    products,
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const { darkMode } = useTheme();
  const [query, setQuery] = useState("");
  const [formProduct, setFormProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllProducts().catch((loadError) => setError(loadError.message));
  }, [getAllProducts]);

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

  const submitProduct = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...formProduct,
        priceCents: Number(formProduct.priceCents),
        compareAtCents: formProduct.compareAtCents
          ? Number(formProduct.compareAtCents)
          : null,
        stock: Number(formProduct.stock),
        images: formProduct.images.filter((image) => image.url),
      };
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
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Manage items</h1>
          <p className={`mt-2 ${muted}`}>Create, update, publish, and remove products.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ${input}`}>
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
            onClick={() => setFormProduct({ ...emptyProduct })}
            type="button"
          >
            <Plus size={18} /> Add product
          </button>
        </div>
      </header>

      {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>}

      <section className={`overflow-hidden rounded-2xl ring-1 ${panel}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className={darkMode ? "bg-white/[0.04]" : "bg-slate-50"}>
              <tr>
                {["Product", "Price", "Stock", "Status", "Actions"].map((heading) => (
                  <th className={`px-5 py-4 font-semibold ${muted}`} key={heading}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/10">
              {filteredProducts.map((product) => (
                <tr className="transition hover:bg-cyan-500/[0.04]" key={product.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.images?.[0]?.url ? (
                        <img className="h-11 w-11 rounded-lg object-cover" src={product.images[0].url} alt="" />
                      ) : (
                        <div className={`grid h-11 w-11 place-items-center rounded-lg ${darkMode ? "bg-white/5" : "bg-slate-100"}`}><ImagePlus size={18} className={muted} /></div>
                      )}
                      <div><p className="font-semibold">{product.name}</p><p className={`mt-1 text-xs ${muted}`}>{product.sku || product.slug}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium">{money(product.priceCents, product.currency)}</td>
                  <td className={`px-5 py-4 ${product.stock === 0 ? "text-red-500" : ""}`}>{product.stock}</td>
                  <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-400"}`}>{product.isActive ? "Active" : "Draft"}</span></td>
                  <td className="px-5 py-4"><div className="flex gap-2"><button className="rounded-lg p-2 text-cyan-500 hover:bg-cyan-500/10" onClick={() => setFormProduct({ ...product })} title="Edit product" type="button"><Edit3 size={17} /></button><button className="rounded-lg p-2 text-red-500 hover:bg-red-500/10" onClick={() => setDeletingProduct(product)} title="Delete product" type="button"><Trash2 size={17} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filteredProducts.length && <p className={`px-5 py-10 text-center ${muted}`}>No products match your search.</p>}
      </section>

      {formProduct && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/70 p-4" role="dialog">
          <form className={`my-8 w-full max-w-2xl space-y-4 rounded-2xl p-6 ring-1 ${panel}`} onSubmit={submitProduct}>
            <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">{formProduct.id ? "Edit product" : "Add product"}</h2><p className={`mt-1 text-sm ${muted}`}>Prices are entered in cents.</p></div><button onClick={() => setFormProduct(null)} type="button"><X /></button></div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["name", "Name", "text"],
                ["slug", "Slug", "text"],
                ["categoryId", "Category ID", "text"],
                ["sku", "SKU", "text"],
                ["priceCents", "Price (cents)", "number"],
                ["compareAtCents", "Compare at (cents)", "number"],
                ["stock", "Stock", "number"],
              ].map(([key, label, type]) => (
                <label className="block text-sm font-medium" key={key}>{label}<input className={`mt-2 w-full rounded-xl px-3 py-2.5 ring-1 outline-none focus:ring-cyan-500 ${input}`} min={type === "number" ? "0" : undefined} onChange={(event) => setFormProduct({ ...formProduct, [key]: event.target.value })} required={["name", "slug", "categoryId", "priceCents"].includes(key)} type={type} value={formProduct[key] ?? ""} /></label>
              ))}
            </div>
            <label className="block text-sm font-medium">Short description<textarea className={`mt-2 min-h-20 w-full rounded-xl px-3 py-2.5 ring-1 outline-none focus:ring-cyan-500 ${input}`} onChange={(event) => setFormProduct({ ...formProduct, shortDescription: event.target.value })} value={formProduct.shortDescription || ""} /></label>
            <label className="block text-sm font-medium">Description<textarea className={`mt-2 min-h-28 w-full rounded-xl px-3 py-2.5 ring-1 outline-none focus:ring-cyan-500 ${input}`} onChange={(event) => setFormProduct({ ...formProduct, description: event.target.value })} value={formProduct.description || ""} /></label>
            <label className="block text-sm font-medium">Image URL<input className={`mt-2 w-full rounded-xl px-3 py-2.5 ring-1 outline-none focus:ring-cyan-500 ${input}`} onChange={(event) => setFormProduct({ ...formProduct, images: [{ url: event.target.value }] })} placeholder="https://..." type="url" value={formProduct.images?.[0]?.url || ""} /></label>
            <div className="flex flex-wrap gap-5 text-sm"><label className="flex items-center gap-2"><input checked={formProduct.isActive} onChange={(event) => setFormProduct({ ...formProduct, isActive: event.target.checked })} type="checkbox" /> Active</label><label className="flex items-center gap-2"><input checked={formProduct.isFeatured} onChange={(event) => setFormProduct({ ...formProduct, isFeatured: event.target.checked })} type="checkbox" /> Featured</label><label className="flex items-center gap-2"><input checked={formProduct.hasVariants} onChange={(event) => setFormProduct({ ...formProduct, hasVariants: event.target.checked })} type="checkbox" /> Has variants</label></div>
            <button className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white hover:bg-cyan-600 disabled:opacity-50" disabled={saving} type="submit">{saving ? "Saving..." : formProduct.id ? "Save changes" : "Create product"}</button>
          </form>
        </div>
      )}

      {deletingProduct && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4" role="dialog">
          <div className={`w-full max-w-md space-y-5 rounded-2xl p-6 ring-1 ${panel}`}><h2 className="text-xl font-bold">Delete product?</h2><p className={muted}>This permanently removes <strong className="text-current">{deletingProduct.name}</strong>.</p><div className="flex justify-end gap-3"><button className={`rounded-xl px-4 py-2.5 ring-1 ${input}`} onClick={() => setDeletingProduct(null)} type="button">Cancel</button><button className="rounded-xl bg-red-500 px-4 py-2.5 font-semibold text-white hover:bg-red-600 disabled:opacity-50" disabled={saving} onClick={confirmDelete} type="button">{saving ? "Deleting..." : "Delete product"}</button></div></div>
        </div>
      )}
    </div>
  );
}

export default ManageItems;
