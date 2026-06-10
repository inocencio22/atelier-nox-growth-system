import clsx from "clsx";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={clsx("grid place-items-center border-2 border-ink bg-white", compact ? "h-12 w-12" : "h-20 w-20")}>
      <div className={clsx("grid grid-cols-4 grid-rows-4 gap-1", compact ? "h-7 w-7" : "h-12 w-12")}>
        <span className="col-span-2 row-span-1 bg-blue" />
        <span className="col-start-3 row-start-1 bg-acid" />
        <span className="col-start-1 row-start-2 bg-ink" />
        <span className="col-span-2 col-start-2 row-start-2 bg-yellow" />
        <span className="col-start-4 row-start-2 bg-blue" />
        <span className="col-span-2 col-start-1 row-start-3 bg-coral" />
        <span className="col-start-3 row-start-3 bg-acid" />
        <span className="col-start-4 row-start-3 bg-ink" />
        <span className="col-start-2 row-start-4 bg-violet" />
        <span className="col-span-2 col-start-3 row-start-4 bg-green" />
      </div>
    </div>
  );
}
