type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-6 border-t-4 border-ink pt-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue">{eyebrow}</p>
      <h1 className="mt-2 max-w-4xl text-4xl font-black uppercase leading-[0.95] text-ink sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-base font-semibold leading-6 text-stone-600">{description}</p>
    </header>
  );
}
