import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShoppingCart, ZoomIn, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { useProducts } from "../contexts/productsContext.jsx";
import { useTheme } from "../contexts/themeContext.jsx";

function getVariantAttributes(variant) {
  return Object.entries(variant.attributes || {});
}

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { getPriceDetails, getVariantImage } = useProducts();
  const { darkMode } = useTheme();
  const [product, setProduct] = useState(null);
  const [variantId, setVariantId] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
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
  const panel = darkMode
    ? "bg-slate-950/80 text-white ring-white/10"
    : "bg-white text-slate-900 ring-slate-200";
  const variantImage = getVariantImage(product, variant);
  const image = product?.images?.[imageIndex]?.url;
  const price = getPriceDetails(product, variant);

  const handleZoom = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setZoom({
      active: true,
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  };

  const selectVariant = (nextVariant) => {
    setVariantId(nextVariant.id);
    const matchingImageIndex = product.images?.findIndex(
      (item) => item.url === getVariantImage(product, nextVariant),
    );
    if (matchingImageIndex >= 0) setImageIndex(matchingImageIndex);
  };

  if (error) {
    return <main className="mx-auto max-w-6xl px-4 pb-16 pt-28"><p className="text-red-500">{error}</p></main>;
  }
  if (!product) {
    return <main className="mx-auto max-w-6xl px-4 pb-16 pt-28"><p className={muted}>Loading product...</p></main>;
  }

  const available = variant ? variant.stock > 0 : product.stock > 0;
  const addProduct = () => addToCart({
    productId: product.id,
    variantId: variant?.id || null,
    name: product.name,
    variantName: variant?.name || null,
    imageUrl: variantImage || image,
    unitPriceCents: price.usd,
    quantity: 1,
    currency: product.currency,
    slug: product.slug,
  });

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 pb-16 pt-28">
      <Link to="/shop" className={`inline-flex items-center gap-2 text-sm ${muted} hover:text-cyan-500`}>
        <ArrowLeft size={16} /> Back to shop
      </Link>
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <div
            className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl bg-slate-100"
            onClick={() => image && setLightboxOpen(true)}
            onMouseEnter={() => setZoom((current) => ({ ...current, active: true }))}
            onMouseLeave={() => setZoom((current) => ({ ...current, active: false }))}
            onMouseMove={handleZoom}
          >
            {image ? (
              <>
                <img
                  className="h-full w-full object-cover transition-transform duration-150"
                  src={image}
                  alt={product.name}
                  style={zoom.active ? {
                    transform: "scale(2)",
                    transformOrigin: `${zoom.x}% ${zoom.y}%`,
                  } : undefined}
                />
                <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs text-white opacity-0 transition group-hover:opacity-100">
                  <ZoomIn size={14} /> Hover to zoom
                </span>
              </>
            ) : (
              <div className="grid h-full place-items-center text-slate-400">No image</div>
            )}
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {product.images?.map((item, index) => (
              <button
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg ring-2 ${index === imageIndex ? "ring-cyan-500" : "ring-transparent"}`}
                key={item.id || item.url}
                onClick={() => setImageIndex(index)}
                type="button"
              >
                <img className="h-full w-full object-cover" src={item.url} alt="" />
              </button>
            ))}
          </div>
        </section>

        <section className={`space-y-5 rounded-2xl p-6 ring-1 ${panel}`}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-500">{product.category?.name || "Product"}</p>
            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
            <p className={`mt-3 whitespace-pre-wrap ${muted}`}>{product.description || "No description available."}</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{price.usdLabel}</p>
            <p className={`text-sm font-normal ${muted}`}>{price.kshLabel}</p>
          </div>
          {product.variants?.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-semibold">Choose an option</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {product.variants.map((item) => {
                  const selected = item.id === variantId;
                  const attributes = getVariantAttributes(item);
                  return (
                    <button
                      className={`rounded-xl p-3 text-left ring-1 transition ${selected ? "bg-cyan-500/10 ring-cyan-500" : darkMode ? "bg-white/5 ring-white/10 hover:ring-white/30" : "bg-slate-50 ring-slate-200 hover:ring-slate-400"} ${item.stock === 0 ? "opacity-50" : ""}`}
                      key={item.id}
                      onClick={() => selectVariant(item)}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{item.name}</span>
                        {selected && <span className="text-xs font-semibold text-cyan-500">Selected</span>}
                      </div>
                      {attributes.length > 0 && (
                        <div className={`mt-2 space-y-1 text-xs ${muted}`}>
                          {attributes.map(([name, value]) => <p key={name}><span className="capitalize">{name}:</span> {value}</p>)}
                        </div>
                      )}
                      <p className={`mt-2 text-xs ${item.stock > 0 ? muted : "text-red-500"}`}>
                        {item.stock > 0 ? `${item.stock} available` : "Out of stock"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <p className={`text-sm ${muted}`}>{available ? `${variant?.stock ?? product.stock} available` : "Sold out"}</p>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white hover:bg-cyan-600 disabled:opacity-50" disabled={!available} onClick={addProduct}>
            <ShoppingCart size={18} /> {available ? "Add to cart" : "Sold out"}
          </button>
        </section>
      </div>

      {lightboxOpen && image && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/90 p-4" onClick={() => setLightboxOpen(false)}>
          <button className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white" onClick={() => setLightboxOpen(false)} type="button">
            <X size={22} />
          </button>
          <img className="max-h-[90vh] max-w-[90vw] object-contain" src={image} alt={product.name} />
        </div>
      )}
    </main>
  );
}
