"use client";

import { useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";

type MessageTemplateProps = {
  template: {
    title: string;
    channel: string;
    body: string;
  };
};

export function MessageTemplate({ template }: MessageTemplateProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(template.body);
    } catch {
      const el = document.createElement("textarea");
      el.value = template.body;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isWhatsApp = template.channel === "WhatsApp";
  const waLink = isWhatsApp
    ? `https://wa.me/41792844918?text=${encodeURIComponent(template.body)}`
    : null;

  return (
    <article className="border border-[#dedad2] bg-white p-4 shadow-sm flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-ink">{template.title}</h3>
          <p className="mt-1 text-xs font-black uppercase tracking-[0.1em] text-stone-400">{template.channel}</p>
        </div>
        <span
          className={`inline-block px-2 py-1 text-[9px] font-black uppercase tracking-[0.1em] ${
            template.channel === "WhatsApp"
              ? "bg-[#12382F] text-white"
              : template.channel === "Email"
                ? "bg-[#12382F] text-white"
                : "bg-[#f0faf5] text-[#0d1a14]"
          }`}
        >
          {template.channel}
        </span>
      </div>

      <p className="mt-4 flex-1 text-sm leading-6 text-stone-600 whitespace-pre-line">{template.body}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 border border-[#dedad2] bg-[#f0faf5] px-3 py-2 text-xs font-black uppercase text-ink transition hover:bg-[#fffbeb]"
          type="button"
        >
          {copied ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copié !" : "Copier"}
        </button>

        {waLink ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border-2 border-[#12382F] bg-[#12382F] px-3 py-2 text-xs font-black uppercase text-white transition hover:bg-[#0d1a14]"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        ) : null}
      </div>
    </article>
  );
}
