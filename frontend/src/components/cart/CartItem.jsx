import { memo } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useTheme } from "../../contexts/themeContext.jsx";

function formatMoney(cents, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format((cents || 0) / 100);
}

/**
 * CartItem
 *
 * Props:
 *  - item: {
 *      id, productId, variantId,
 *      name, variantName, imageUrl,
 *      unitPriceCents, quantity, currency,
 *      slug (optional, for product link)
 *    }
 *  - variant: "compact" (sidebar) | "default" (full cart page)
 *  - onIncrement, onDecrement, onRemove  →  (item) => void
 *  - disabled: boolean (optional)
 */
function CartItem({
  item,
  variant = "compact",
  onIncrement,
  onDecrement,
  onRemove,
  disabled = false,
}) {
  const { darkMode } = useTheme();
  const isDark = darkMode;

  const unitPrice =
    item.unitPriceCents ?? item.priceCents ?? item.product?.priceCents ?? 0;
  const lineTotal = unitPrice * item.quantity;
  const currency = item.currency || "USD";

  const image =
    item.imageUrl || item.product?.images?.[0]?.url || item.product?.imageUrl;

  const name = item.name || item.product?.name || "Item";
  const variantName = item.variantName || item.variant?.name || null;
  const slug = item.slug || item.product?.slug;

  const isCompact = variant === "compact";

  /* ─── Style tokens ─── */
  const card = `relative group flex gap-3 rounded-2xl ring-1 transition ${
    isCompact ? "p-3" : "p-4"
  } ${
    isDark
      ? "bg-white/[0.03] ring-white/5 hover:bg-white/[0.05]"
      : "bg-slate-50 ring-slate-100 hover:bg-slate-100/70"
  }`;

  const thumbSize = isCompact ? "h-16 w-16" : "h-20 w-20 sm:h-24 sm:w-24";

  const thumbWrap = `relative shrink-0 overflow-hidden rounded-xl ring-1 ${thumbSize} ${
    isDark ? "ring-white/10" : "ring-slate-200"
  }`;

  const qtyBtn = `grid place-items-center rounded-lg ring-1 transition ${
    isCompact ? "h-7 w-7" : "h-8 w-8"
  } ${
    isDark
      ? "text-slate-300 ring-white/10 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent"
      : "text-slate-600 ring-slate-200 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
  }`;

  const titleCls = `truncate tracking-tight ${
    isCompact ? "text-sm font-semibold" : "text-base font-semibold"
  } ${isDark ? "text-white" : "text-slate-900"}`;

  const mutedCls = isDark ? "text-slate-400" : "text-slate-500";

  const removeBtn = `shrink-0 rounded-md p-1 transition ${
    isDark
      ? "text-slate-500 hover:bg-red-500/10 hover:text-red-400"
      : "text-slate-400 hover:bg-red-500/10 hover:text-red-500"
  }`;

  const stepperWrap = `flex items-center rounded-lg ring-1 ${
    isCompact ? "gap-1 p-0.5" : "gap-1.5 p-1"
  } ${isDark ? "bg-white/[0.03] ring-white/10" : "bg-white ring-slate-200"}`;

  const stepperNumW = isCompact ? "w-6" : "w-8";
  const stepperNumSize = isCompact ? "text-xs" : "text-sm";

  const Icon = isCompact ? 12 : 14;

  return (
    <li className={card}>
      {/* Thumb */}
      <div className={thumbWrap}>
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 text-cyan-500">
            <ShoppingBag size={isCompact ? 18 : 22} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top row: title + remove */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {slug ? (
              <Link
                to={`/product/${slug}`}
                className={`${titleCls} block hover:text-cyan-500 transition-colors`}
              >
                {name}
              </Link>
            ) : (
              <p className={titleCls}>{name}</p>
            )}

            {variantName && (
              <p className={`mt-0.5 truncate text-[11px] ${mutedCls}`}>
                {variantName}
              </p>
            )}

            {!isCompact && (
              <p className={`mt-1 text-xs ${mutedCls}`}>
                {formatMoney(unitPrice, currency)} each
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onRemove?.(item)}
            disabled={disabled}
            aria-label={`Remove ${name} from cart`}
            className={removeBtn}
          >
            <Trash2 size={isCompact ? 14 : 15} />
          </button>
        </div>

        {/* Bottom row: qty + line total */}
        <div
          className={`mt-auto flex items-end justify-between gap-2 ${
            isCompact ? "pt-2" : "pt-3"
          }`}
        >
          <div className={stepperWrap}>
            <button
              type="button"
              onClick={() => onDecrement?.(item)}
              disabled={disabled || item.quantity <= 1}
              aria-label="Decrease quantity"
              className={qtyBtn}
            >
              <Minus size={Icon} />
            </button>
            <span
              className={`${stepperNumW} ${stepperNumSize} text-center font-semibold ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onIncrement?.(item)}
              disabled={disabled}
              aria-label="Increase quantity"
              className={qtyBtn}
            >
              <Plus size={Icon} />
            </button>
          </div>

          <div className="text-right">
            {!isCompact && item.quantity > 1 && (
              <p className={`text-[11px] ${mutedCls}`}>
                {item.quantity} × {formatMoney(unitPrice, currency)}
              </p>
            )}
            <p
              className={`font-semibold tracking-tight ${
                isCompact ? "text-sm" : "text-base"
              } ${isDark ? "text-white" : "text-slate-900"}`}
            >
              {formatMoney(lineTotal, currency)}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

export default memo(CartItem);
