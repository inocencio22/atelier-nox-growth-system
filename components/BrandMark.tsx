import clsx from "clsx";

type BrandMarkVariant = "symbol" | "horizontal";

export function BrandMark({
  compact = false,
  variant = "symbol",
  className
}: {
  compact?: boolean;
  variant?: BrandMarkVariant;
  className?: string;
}) {
  const symbol = <BrandSymbol compact={compact} />;

  if (variant === "horizontal") {
    return (
      <div className={clsx("flex items-center gap-4", className)}>
        {symbol}
        <div className="leading-none">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#E85D2A]">Atelier Nox</p>
          <p className="mt-2 text-2xl font-black uppercase tracking-normal text-[#101820]">Croissance locale</p>
          <p className="mt-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#12382F]">gérée</p>
        </div>
      </div>
    );
  }

  return <div className={className}>{symbol}</div>;
}

function BrandSymbol({ compact }: { compact: boolean }) {
  const sizeClass = compact ? "h-12 w-12" : "h-20 w-20";
  const strokeWidth = compact ? 7 : 5;

  return (
    <div
      className={clsx(
        "grid place-items-center border border-[#12382F] bg-[#F5F1E8] shadow-[3px_3px_0_rgba(18,56,47,0.12)]",
        sizeClass
      )}
      aria-label="Atelier Nox"
    >
      <svg
        className={clsx(compact ? "h-8 w-8" : "h-14 w-14")}
        viewBox="0 0 100 100"
        role="img"
        aria-label="Atelier Nox - Lausanne, lac Léman et croissance locale"
      >
        <rect x="8" y="8" width="84" height="84" fill="#F5F1E8" />
        <path d="M14 58 L30 39 L43 55 L56 27 L72 53 L86 37" fill="none" stroke="#12382F" strokeWidth={strokeWidth} />
        <path d="M14 66 H32 V58 H42 V66 H53 V54 H64 V66 H86" fill="none" stroke="#101820" strokeWidth={strokeWidth} />
        <path d="M14 78 C26 72 38 84 50 78 C62 72 74 84 86 78" fill="none" stroke="#E85D2A" strokeWidth={strokeWidth} />
        <path d="M24 24 H43" stroke="#E85D2A" strokeWidth={strokeWidth} />
        <path d="M57 24 H76" stroke="#12382F" strokeWidth={strokeWidth} />
      </svg>
    </div>
  );
}
