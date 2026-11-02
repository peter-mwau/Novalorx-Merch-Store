import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  Moon,
  Package,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useCart } from "../contexts/CartContext.jsx";
import { useProducts } from "../contexts/productsContext.jsx";
import { useTheme } from "../contexts/themeContext.jsx";
export default function Products() {
  const { addToCart } = useCart();
  const { getPriceDetails, getVariantImage } = useProducts();
  const { darkMode, toggleTheme } = useTheme();
  const isDark = darkMode;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(null); // productId being added

  useEffect(() => {
    Promise.all([
      fetch("/api/products?limit=100&isActive=true").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ])
      .then(([productData, categoryData]) => {
        if (productData.error) throw new Error(productData.error);
        setProducts(productData.products || []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
      })
      .catch((e) => setError(e.message || "Unable to load products"))
      .finally(() => setLoading(false));
  }, []);

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const q = query.toLowerCase();
        const matchesSearch = [
          product.name,
          product.slug,
          product.description,
        ].some((v) => v?.toLowerCase().includes(q));
        return (
          matchesSearch && (!categoryId || product.categoryId === categoryId)
        );
      }),
    [products, query, categoryId],
  );

  const addProduct = async (product) => {
    const variant =
      product.variants?.find((v) => v.id === selectedVariants[product.id]) ||
      product.variants?.[0];
    setAdding(product.id);
    try {
      await addToCart({
        productId: product.id,
        variantId: variant?.id || null,
        name: product.name,
        variantName: variant?.name || null,
        imageUrl: getVariantImage(product, variant),
        unitPriceCents: getPriceDetails(product, variant).usd,
        quantity: 1,
        currency: product.currency,
        slug: product.slug,
      });
    } finally {
      // small delay so the spinner is visible
      setTimeout(() => setAdding(null), 350);
    }
  };

  /* ─── Style tokens (match the rest of the app) ─── */
  const muted = isDark ? "text-slate-400" : "text-slate-500";

  const panel = `relative overflow-hidden rounded-3xl ring-1 backdrop-blur-xl ${
    isDark
      ? "bg-slate-950/70 ring-white/10 text-white"
      : "bg-white/80 ring-slate-200 text-slate-900"
  } shadow-lg ${isDark ? "shadow-black/30" : "shadow-slate-900/5"}`;

  const inputBase = `w-full rounded-xl px-3.5 py-2.5 text-sm outline-none ring-1 transition ${
    isDark
      ? "bg-white/5 text-white ring-white/10 placeholder:text-slate-500 focus:ring-cyan-400/70"
      : "bg-slate-50 text-slate-900 ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-cyan-500"
  }`;

  const iconBtn = `grid h-10 w-10 place-items-center rounded-xl ring-1 transition ${
    isDark
      ? "bg-white/[0.04] text-slate-300 ring-white/10 hover:bg-white/10 hover:text-white"
      : "bg-slate-50 text-slate-500 ring-slate-200 hover:bg-slate-100 hover:text-slate-900"
  }`;

  return (
    <main className="relative min-h-[calc(100vh-5rem)] px-4 pb-16 pt-28">
      {/* Signature glow blobs */}
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-56 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl space-y-8">
        {/* ── Header ── */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
              The collection
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Shop products
            </h1>
            <p className={`mt-2 text-sm ${muted}`}>
              Find your next favorite piece from the lab.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className={iconBtn}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </header>

        {/* ── Controls ── */}
        <div className="flex flex-wrap items-center gap-3">
          <label
            className={`relative flex min-w-64 flex-1 items-center gap-2 rounded-xl ring-1 transition ${
              isDark
                ? "bg-white/5 ring-white/10 focus-within:ring-cyan-400/70"
                : "bg-slate-50 ring-slate-200 focus-within:bg-white focus-within:ring-cyan-500"
            }`}
          >
            <Search
              size={16}
              className={`ml-3.5 shrink-0 ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            />
            <input
              className={`w-full bg-transparent py-2.5 pr-9 text-sm outline-none ${
                isDark
                  ? "text-white placeholder:text-slate-500"
                  : "text-slate-900 placeholder:text-slate-400"
              }`}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              value={query}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 transition ${
                  isDark
                    ? "text-slate-500 hover:bg-white/10 hover:text-white"
                    : "text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <X size={14} />
              </button>
            )}
          </label>

          <div className="relative">
            <SlidersHorizontal
              size={15}
              className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            />
            <select
              className={`${inputBase} appearance-none pl-9 pr-9`}
              onChange={(e) => setCategoryId(e.target.value)}
              value={categoryId}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500 ring-1 ring-red-500/20">
            {error}
          </div>
        )}

        {/* ── States ── */}
        {loading ? (
          <LoadingState isDark={isDark} />
        ) : !visibleProducts.length ? (
          <EmptyState isDark={isDark} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => {
              const selectedVariant =
                product.variants?.find(
                  (v) => v.id === selectedVariants[product.id],
                ) || product.variants?.[0];
              const available = selectedVariant
                ? selectedVariant.stock > 0
                : product.stock > 0;

              return (
                <article
                  key={product.id}
                  className={`${panel} group flex flex-col transition hover:-translate-y-0.5 hover:shadow-xl ${
                    isDark
                      ? "hover:shadow-black/40"
                      : "hover:shadow-slate-900/10"
                  }`}
                >
                  {/* Grid texture */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                      color: isDark ? "#67e8f9" : "#0891b2",
                    }}
                  />

                  {/* Media */}
                  <Link
                    to={`/product/${product.id}`}
                    className="relative block aspect-[4/3] overflow-hidden"
                  >
                    {product.images?.[0]?.url ? (
                      <img
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={product.images[0].url}
                        alt={product.name}
                      />
                    ) : (
                      <div
                        className={`grid h-full w-full place-items-center ${
                          isDark
                            ? "bg-white/[0.03] text-slate-600"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        <Package size={32} />
                      </div>
                    )}

                    {/* Availability badge */}
                    <span
                      className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ring-1 backdrop-blur-md ${
                        available
                          ? "bg-emerald-500/15 text-emerald-500 ring-emerald-500/30"
                          : "bg-red-500/15 text-red-500 ring-red-500/30"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          available ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      {available ? "In stock" : "Sold out"}
                    </span>
                  </Link>

                  {/* Body */}
                  <div className="relative flex flex-1 flex-col space-y-3 p-5">
                    <div className="min-w-0">
                      <Link
                        to={`/product/${product.id}`}
                        className="block truncate text-base font-semibold tracking-tight transition hover:text-cyan-500"
                      >
                        {product.name}
                      </Link>
                      <p
                        className={`mt-1 line-clamp-2 text-sm leading-relaxed ${muted}`}
                      >
                        {product.description || "No description available."}
                      </p>
                    </div>

                    {product.variants?.length > 0 && (
                      <select
                        className={`${inputBase} text-xs`}
                        onChange={(e) =>
                          setSelectedVariants((c) => ({
                            ...c,
                            [product.id]: e.target.value,
                          }))
                        }
                        value={selectedVariant?.id || ""}
                      >
                        {product.variants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.stock} available)
                          </option>
                        ))}
                      </select>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                      <div className="min-w-0">
                        <p
                          className={`text-[10px] font-medium uppercase tracking-wider ${muted}`}
                        >
                          Price
                        </p>
                        <p className="truncate text-lg font-semibold tracking-tight">
                          {getPriceDetails(product, selectedVariant).usdLabel}
                        </p>
                        <p className={`text-sm font-normal ${muted}`}>
                          {getPriceDetails(product, selectedVariant).kshLabel}
                        </p>
                      </div>

                      <button
                        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-cyan-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                        disabled={!available || adding === product.id}
                        onClick={() => addProduct(product)}
                      >
                        {adding === product.id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <ShoppingCart size={15} />
                        )}
                        {available ? "Add" : "Sold out"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

/* ─── Loading skeleton ─── */
function LoadingState({ isDark }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`overflow-hidden rounded-3xl ring-1 ${
            isDark
              ? "bg-slate-950/50 ring-white/5"
              : "bg-white/60 ring-slate-200"
          }`}
        >
          <div
            className={`aspect-[4/3] animate-pulse ${
              isDark ? "bg-white/[0.03]" : "bg-slate-100"
            }`}
          />
          <div className="space-y-3 p-5">
            <div
              className={`h-4 w-2/3 animate-pulse rounded ${
                isDark ? "bg-white/[0.05]" : "bg-slate-100"
              }`}
            />
            <div
              className={`h-3 w-full animate-pulse rounded ${
                isDark ? "bg-white/[0.04]" : "bg-slate-100"
              }`}
            />
            <div
              className={`h-3 w-4/5 animate-pulse rounded ${
                isDark ? "bg-white/[0.04]" : "bg-slate-100"
              }`}
            />
            <div className="flex items-center justify-between pt-2">
              <div
                className={`h-6 w-16 animate-pulse rounded ${
                  isDark ? "bg-white/[0.05]" : "bg-slate-100"
                }`}
              />
              <div
                className={`h-9 w-20 animate-pulse rounded-xl ${
                  isDark ? "bg-white/[0.05]" : "bg-slate-100"
                }`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Empty state ─── */
function EmptyState({ isDark }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-12 text-center ring-1 ${
        isDark
          ? "bg-slate-950/70 ring-white/10 text-white"
          : "bg-white/80 ring-slate-200 text-slate-900"
      }`}
    >
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/30">
        <Sparkles size={22} />
      </div>
      <h3 className="relative mt-5 text-lg font-semibold tracking-tight">
        No products found
      </h3>
      <p
        className={`relative mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
      >
        Try a different search or category.
      </p>
    </div>
  );
}
