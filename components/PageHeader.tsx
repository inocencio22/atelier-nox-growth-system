type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="mb-8 border-l-4 border-[#E85D2A] pl-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#E85D2A]">{eyebrow}</p>
      <h1 className="mt-2 max-w-4xl text-3xl font-black uppercase leading-[1.05] text-[#0d1a14] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-stone-500">{description}</p>
    </header>
  );
}
