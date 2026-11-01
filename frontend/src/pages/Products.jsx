import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext.jsx";
import { useTheme } from "../contexts/themeContext.jsx";
import { getVariantPriceCents } from "../utils/productPricing.js";

const money = (cents, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format((cents || 0) / 100);

export default function Products() {
  const { addToCart } = useCart();
  const { darkMode } = useTheme();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/products?limit=100&isActive=true").then((response) => response.json()),
      fetch("/api/admin/categories").then((response) => response.json()),
    ])
      .then(([productData, categoryData]) => {
        if (productData.error) throw new Error(productData.error);
        setProducts(productData.products || []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      })
      .catch((loadError) => setError(loadError.message || "Unable to load products"))
      .finally(() => setLoading(false));
  }, []);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesSearch = [product.name, product.slug, product.description]
      .some((value) => value?.toLowerCase().includes(query.toLowerCase()));
    return matchesSearch && (!categoryId || product.categoryId === categoryId);
  }), [products, query, categoryId]);

  const addProduct = (product) => {
    const variant = product.variants?.find((item) => item.id === selectedVariants[product.id]) || product.variants?.[0];
    addToCart({
      productId: product.id,
      variantId: variant?.id || null,
      name: product.name,
      variantName: variant?.name || null,
      imageUrl: product.images?.[0]?.url,
      unitPriceCents: getVariantPriceCents(product, variant),
      quantity: 1,
      currency: product.currency,
      slug: product.slug,
    });
  };

  const panel = darkMode ? "bg-slate-950/80 text-white ring-white/10" : "bg-white text-slate-900 ring-slate-200";
  const input = darkMode ? "bg-white/5 text-white ring-white/10 placeholder:text-slate-500" : "bg-slate-50 text-slate-900 ring-slate-200 placeholder:text-slate-400";
  const muted = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-28">
      <header><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">The collection</p><h1 className="mt-2 text-4xl font-bold">Shop products</h1><p className={`mt-2 ${muted}`}>Find your next favorite piece.</p></header>
      <div className="flex flex-wrap gap-3">
        <label className={`flex min-w-64 flex-1 items-center gap-2 rounded-xl px-3 py-2.5 ring-1 ${input}`}><Search size={18} /><input className="w-full bg-transparent outline-none" onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." value={query} /></label>
        <select className={`rounded-xl px-3 py-2.5 ring-1 outline-none ${input}`} onChange={(event) => setCategoryId(event.target.value)} value={categoryId}><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
      </div>
      {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-red-500">{error}</p>}
      {loading ? <p className={muted}>Loading products...</p> : !visibleProducts.length ? <p className={`rounded-2xl p-10 text-center ring-1 ${panel}`}>No products found.</p> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visibleProducts.map((product) => { const selectedVariant = product.variants?.find((variant) => variant.id === selectedVariants[product.id]) || product.variants?.[0]; const available = selectedVariant ? selectedVariant.stock > 0 : product.stock > 0; return <article className={`overflow-hidden rounded-2xl ring-1 ${panel}`} key={product.id}><Link to={`/product/${product.id}`} className="block aspect-[4/3] bg-slate-100">{product.images?.[0]?.url ? <img className="h-full w-full object-cover" src={product.images[0].url} alt={product.name} /> : <div className="grid h-full place-items-center text-slate-400">No image</div>}</Link><div className="space-y-3 p-5"><div><Link to={`/product/${product.id}`} className="font-semibold hover:text-cyan-500">{product.name}</Link><p className={`mt-1 line-clamp-2 text-sm ${muted}`}>{product.description || "No description available."}</p></div>{product.variants?.length > 0 && <select className={`w-full rounded-lg px-2 py-2 text-sm ring-1 ${input}`} onChange={(event) => setSelectedVariants((current) => ({ ...current, [product.id]: event.target.value }))} value={selectedVariant?.id || ""}>{product.variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.name} ({variant.stock} available)</option>)}</select>}<div className="flex items-center justify-between"><span className="font-bold">{money(getVariantPriceCents(product, selectedVariant), product.currency)}</span><button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-600 disabled:opacity-50" disabled={!available} onClick={() => addProduct(product)}><ShoppingCart size={16} /> {available ? "Add to cart" : "Sold out"}</button></div><Link className={`block text-center text-sm font-semibold ${muted} hover:text-cyan-500`} to={`/product/${product.id}`}>View details</Link></div></article>; })}</div>}
    </main>
  );
}
