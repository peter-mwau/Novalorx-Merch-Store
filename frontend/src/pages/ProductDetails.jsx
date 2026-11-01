import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext.jsx";
import { useTheme } from "../contexts/themeContext.jsx";
import { getVariantPriceCents } from "../utils/productPricing.js";

const money = (cents, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format((cents || 0) / 100);

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { darkMode } = useTheme();
  const [product, setProduct] = useState(null);
  const [variantId, setVariantId] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load product");
        setProduct(data);
        setVariantId(data.variants?.[0]?.id || "");
      })
      .catch((loadError) => setError(loadError.message));
  }, [id]);

  const variant = useMemo(
    () => product?.variants?.find((item) => item.id === variantId),
    [product, variantId],
  );
  const muted = darkMode ? "text-slate-400" : "text-slate-500";
  const panel = darkMode ? "bg-slate-950/80 text-white ring-white/10" : "bg-white text-slate-900 ring-slate-200";
  const image = product?.images?.[imageIndex]?.url;

  if (error) return <main className="mx-auto max-w-6xl px-4 pb-16 pt-28"><p className="text-red-500">{error}</p></main>;
  if (!product) return <main className="mx-auto max-w-6xl px-4 pb-16 pt-28"><p className={muted}>Loading product...</p></main>;

  const available = variant ? variant.stock > 0 : product.stock > 0;
  const addProduct = () => addToCart({
    productId: product.id,
    variantId: variant?.id || null,
    name: product.name,
    variantName: variant?.name || null,
    imageUrl: image || product.images?.[0]?.url,
    unitPriceCents: getVariantPriceCents(product, variant),
    quantity: 1,
    currency: product.currency,
    slug: product.slug,
  });

  return <main className="mx-auto max-w-6xl space-y-6 px-4 pb-16 pt-28">
    <Link to="/shop" className={`inline-flex items-center gap-2 text-sm ${muted} hover:text-cyan-500`}><ArrowLeft size={16} /> Back to shop</Link>
    <div className="grid gap-8 lg:grid-cols-2">
      <section><div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">{image ? <img className="h-full w-full object-cover" src={image} alt={product.name} /> : <div className="grid h-full place-items-center text-slate-400">No image</div>}</div><div className="mt-3 flex gap-2 overflow-x-auto">{product.images?.map((item, index) => <button className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg ring-2 ${index === imageIndex ? "ring-cyan-500" : "ring-transparent"}`} key={item.id || item.url} onClick={() => setImageIndex(index)} type="button"><img className="h-full w-full object-cover" src={item.url} alt="" /></button>)}</div></section>
      <section className={`space-y-5 rounded-2xl p-6 ring-1 ${panel}`}><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">{product.category?.name || "Product"}</p><h1 className="mt-2 text-3xl font-bold">{product.name}</h1><p className={`mt-3 whitespace-pre-wrap ${muted}`}>{product.description || "No description available."}</p></div><p className="text-2xl font-bold">{money(getVariantPriceCents(product, variant), product.currency)}</p>{product.variants?.length > 0 && <label className="block text-sm font-medium">Choose variant<select className="mt-2 w-full rounded-xl px-3 py-3 text-sm text-slate-900" onChange={(event) => setVariantId(event.target.value)} value={variantId}>{product.variants.map((item) => <option key={item.id} value={item.id}>{item.name} ({item.stock} available)</option>)}</select></label>}<p className={`text-sm ${muted}`}>{available ? `${variant?.stock ?? product.stock} available` : "Sold out"}</p><button className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white hover:bg-cyan-600 disabled:opacity-50" disabled={!available} onClick={addProduct}><ShoppingCart size={18} /> {available ? "Add to cart" : "Sold out"}</button></section>
    </div>
  </main>;
}
