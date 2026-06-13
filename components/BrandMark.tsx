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
      <div className={clsx("inline-flex items-center gap-4", className)} aria-label="Atelier Nox Growth System">
        {symbol}
        <div className="leading-none">
          <p className="text-lg font-black uppercase tracking-[0.2em] text-[#123047] sm:text-xl">Atelier Nox</p>
          <p className="mt-1.5 text-[10px] font-black uppercase tracking-[0.48em] text-[#123047]/70">Growth System</p>
        </div>
      </div>
    );
  }

  return <div className={className}>{symbol}</div>;
}

function BrandSymbol({ compact }: { compact: boolean }) {
  const sizeClass = compact ? "h-9 w-9" : "h-12 w-12";

  return (
    <div className={clsx("grid place-items-center text-[#123047]", sizeClass)} aria-label="Atelier Nox">
      <svg viewBox="0 0 96 72" role="img" aria-label="Atelier Nox">
        <path d="M7 61 47 9l42 52H73L47 29 22 61H7Z" fill="currentColor" />
        <path d="M31 44 43 34l8 8 11-12 16 19-12-5-12 6-10-7-12 8-10-3 9-4Z" fill="#F5FAFD" />
        <path d="M17 61h32L33 40 17 61Z" fill="currentColor" />
        <path d="M55 61h34L72 40 55 61Z" fill="currentColor" />
        <path d="M18 66c9-4 17 3 26 0s17 3 26 0" fill="none" stroke="#1FA2A1" strokeLinecap="round" strokeWidth="4" />
      </svg>
    </div>
  );
}
