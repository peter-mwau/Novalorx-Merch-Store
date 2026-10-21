import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useTheme } from "../../contexts/themeContext.jsx";
import { useCart } from "../../contexts/CartContext.jsx";

function formatMoney(cents, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format((cents || 0) / 100);
}

export default function CartSidebar({ open, onClose }) {
  const { darkMode } = useTheme();
  const isDark = darkMode;

  const {
    items = [],
    updateQty,
    removeItem,
    subtotalCents = 0,
    count = items.reduce((n, i) => n + i.quantity, 0),
    clear,
  } = useCart() || {};

  /* Lock scroll + Esc to close */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const surface = isDark
    ? "bg-slate-950/85 ring-white/10 text-white"
    : "bg-white/90 ring-slate-200 text-slate-900";

  const muted = isDark ? "text-slate-400" : "text-slate-500";
  const divider = isDark ? "bg-white/10" : "bg-slate-200";

  const itemCard = `relative flex gap-3 rounded-2xl p-3 ring-1 transition ${
    isDark
      ? "bg-white/[0.03] ring-white/5 hover:bg-white/[0.05]"
      : "bg-slate-50 ring-slate-100 hover:bg-slate-100/70"
  }`;

  const qtyBtn = `grid h-7 w-7 place-items-center rounded-lg ring-1 transition ${
    isDark
      ? "text-slate-300 ring-white/10 hover:bg-white/10 hover:text-white disabled:opacity-40"
      : "text-slate-600 ring-slate-200 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40"
  }`;

  const isOpen = open;

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className={`fixed inset-0 z-[90] backdrop-blur-sm ${
              isDark ? "bg-black/70" : "bg-slate-900/40"
            }`}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className={`fixed right-0 top-0 z-[100] flex h-screen w-full max-w-[92vw] flex-col overflow-hidden ring-1 backdrop-blur-xl sm:w-[360px] lg:w-[20vw] lg:min-w-[320px] lg:max-w-[420px] ${surface}`}
          >
            {/* Signature glow blobs */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />

            {/* Grid texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                color: isDark ? "#67e8f9" : "#0891b2",
              }}
            />

            {/* Header */}
            <div className="relative flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/30">
                  <ShoppingBag size={16} />
                </span>
                <div>
                  <h2 className="text-base font-semibold tracking-tight">
                    Your cart
                  </h2>
                  <p className={`text-[11px] ${muted}`}>
                    {count} {count === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className={`grid h-9 w-9 place-items-center rounded-full transition ${
                  isDark
                    ? "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                <X size={16} />
              </button>
            </div>

            <div className={`relative mx-5 h-px ${divider}`} />

            {/* Body */}
            <div className="relative flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <EmptyState isDark={isDark} onClose={onClose} />
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const unitPrice =
                        item.unitPriceCents ??
                        item.priceCents ??
                        item.product?.priceCents ??
                        0;
                      const lineTotal = unitPrice * item.quantity;
                      const image =
                        item.imageUrl ||
                        item.product?.images?.[0]?.url ||
                        item.product?.imageUrl;
                      const name = item.name || item.product?.name || "Item";
                      const variantName =
                        item.variantName || item.variant?.name || null;
                      const key =
                        item.id || `${item.productId}-${item.variantId}`;

                      return (
                        <motion.li
                          key={key}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.18 }}
                          className={itemCard}
                        >
                          {/* Thumb */}
                          <div
                            className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-1 ${
                              isDark ? "ring-white/10" : "ring-slate-200"
                            }`}
                          >
                            {image ? (
                              <img
                                src={image}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 text-cyan-500">
                                <ShoppingBag size={18} />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold tracking-tight">
                                  {name}
                                </p>
                                {variantName && (
                                  <p
                                    className={`truncate text-[11px] ${muted}`}
                                  >
                                    {variantName}
                                  </p>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeItem?.(item.productId, item.variantId)
                                }
                                aria-label="Remove item"
                                className={`shrink-0 rounded-md p-1 transition ${
                                  isDark
                                    ? "text-slate-500 hover:bg-red-500/10 hover:text-red-400"
                                    : "text-slate-400 hover:bg-red-500/10 hover:text-red-500"
                                }`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              {/* Qty stepper */}
                              <div
                                className={`flex items-center gap-1 rounded-lg p-0.5 ring-1 ${
                                  isDark
                                    ? "bg-white/[0.03] ring-white/10"
                                    : "bg-white ring-slate-200"
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQty?.(
                                      item.productId,
                                      item.variantId,
                                      Math.max(1, item.quantity - 1),
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                  className={qtyBtn}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-6 text-center text-xs font-semibold">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQty?.(
                                      item.productId,
                                      item.variantId,
                                      item.quantity + 1,
                                    )
                                  }
                                  className={qtyBtn}
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              <span className="text-sm font-semibold tracking-tight">
                                {formatMoney(lineTotal, item.currency || "USD")}
                              </span>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer / checkout */}
            <div
              className={`relative border-t px-5 py-4 ${
                isDark ? "border-white/10" : "border-slate-200"
              }`}
            >
              {items.length > 0 && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className={muted}>Subtotal</span>
                    <span className="font-semibold tracking-tight">
                      {formatMoney(subtotalCents)}
                    </span>
                  </div>
                  <p className={`mt-1 text-[11px] ${muted}`}>
                    Taxes and shipping calculated at checkout.
                  </p>

                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400"
                  >
                    Checkout
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </Link>

                  <div className="mt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={onClose}
                      className={`text-xs font-medium transition ${
                        isDark
                          ? "text-slate-400 hover:text-white"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Continue shopping
                    </button>
                    {clear && (
                      <button
                        type="button"
                        onClick={clear}
                        className={`text-xs font-medium transition ${
                          isDark
                            ? "text-slate-500 hover:text-red-400"
                            : "text-slate-400 hover:text-red-500"
                        }`}
                      >
                        Clear cart
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* ─── Empty state ─── */
function EmptyState({ isDark, onClose }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-10 text-center">
      <div className="relative">
        <div className="absolute -inset-6 rounded-full bg-cyan-500/20 blur-2xl" />
        <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-lg shadow-cyan-500/30">
          <ShoppingBag size={22} />
        </div>
      </div>
      <p
        className={`mt-5 text-sm font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
      >
        Your cart is empty
      </p>
      <p
        className={`mt-1 max-w-[220px] text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
      >
        Looks like you haven't added any Novalorx gear yet.
      </p>
      <Link
        to="/shop"
        onClick={onClose}
        className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-400"
      >
        Browse shop
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
