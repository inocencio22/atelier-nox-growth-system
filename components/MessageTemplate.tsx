import { Copy, Mail } from "lucide-react";

type MessageTemplateProps = {
  template: {
    title: string;
    channel: string;
    body: string;
  };
};

export function MessageTemplate({ template }: MessageTemplateProps) {
  return (
    <article className="border-2 border-ink bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-ink">{template.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
            <Mail className="h-4 w-4" aria-hidden="true" />
            {template.channel}
          </p>
        </div>
        <button
          className="grid h-9 w-9 place-items-center border-2 border-ink bg-acid text-ink transition hover:bg-yellow"
          type="button"
          title="Copier le modèle"
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-4 text-sm leading-6 text-stone-600">{template.body}</p>
    </article>
  );
}
