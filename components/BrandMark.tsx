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
      <div className={clsx("inline-flex items-center", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo local: direct rendering is more reliable than image optimization. */}
        <img
          src="/brand/atelier-nox-logo-horizontal-light.svg"
          alt="Atelier Nox - Croissance locale gérée"
          className="h-16 w-auto sm:h-20"
        />
      </div>
    );
  }

  return <div className={className}>{symbol}</div>;
}

function BrandSymbol({ compact }: { compact: boolean }) {
  const sizeClass = compact ? "h-12 w-12" : "h-20 w-20";

  return (
    <div
      className={clsx(
        "grid place-items-center overflow-hidden border border-[#12382F] bg-[#F5F1E8] shadow-[3px_3px_0_rgba(18,56,47,0.12)]",
        sizeClass
      )}
      aria-label="Atelier Nox"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG symbol local: direct rendering keeps favicon-style details crisp. */}
      <img
        src="/brand/atelier-nox-symbol-light.svg"
        alt=""
        aria-hidden="true"
        className={clsx(compact ? "h-12 w-12" : "h-20 w-20")}
      />
    </div>
  );
}
