import clsx from "clsx";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={clsx(
        "grid place-items-center border border-[#12382F] bg-[#F5F1E8]",
        compact ? "h-12 w-12" : "h-20 w-20"
      )}
    >
      <div className={clsx("grid grid-cols-5 grid-rows-5 gap-1", compact ? "h-7 w-7" : "h-12 w-12")}>
        <span className="col-span-2 row-start-1 bg-[#12382F]" />
        <span className="col-start-4 row-start-1 bg-[#E85D2A]" />
        <span className="col-span-2 col-start-2 row-start-2 bg-[#D9D3C7]" />
        <span className="col-start-5 row-span-2 row-start-2 bg-[#12382F]" />
        <span className="col-start-1 row-start-3 bg-[#E85D2A]" />
        <span className="col-span-2 col-start-3 row-start-3 bg-[#E85D2A]" />
        <span className="col-start-2 row-start-4 bg-[#12382F]" />
        <span className="col-span-2 col-start-4 row-start-4 bg-[#D9D3C7]" />
        <span className="col-span-3 col-start-1 row-start-5 bg-[#12382F]" />
        <span className="col-start-5 row-start-5 bg-[#E85D2A]" />
      </div>
    </div>
  );
}
