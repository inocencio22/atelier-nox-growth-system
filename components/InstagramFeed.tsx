import Image from "next/image";
import { Instagram } from "lucide-react";

// Feed ID do JSON feed no Behold (não o widget feed)
const BEHOLD_JSON_FEED_ID = "bI01mGWErpeLPo7LiMUt";

type BeholdPost = {
  id: string;
  permalink: string;
  sizes: {
    medium: { mediaUrl: string; width: number; height: number };
  };
  altText?: string;
  caption?: string;
};

type BeholdFeed = {
  username: string;
  profilePictureUrl: string;
  followersCount: number;
  posts: BeholdPost[];
};

async function getFeed(): Promise<BeholdFeed | null> {
  try {
    const res = await fetch(`https://feeds.behold.so/${BEHOLD_JSON_FEED_ID}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "K";
  return n.toString();
}

export async function InstagramFeed() {
  const feed = await getFeed();
  if (!feed) return null;

  const posts = feed.posts.slice(0, 4);

  return (
    <section className="border-t border-[#12382F] pt-8">
      {/* Cabeçalho de perfil — estilo ZIP.ch */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-6 border border-[#12382F]/10 bg-[#F5F1E8] px-6 py-5">
        {/* Avatar */}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[#12382F]">
          <Image
            src={feed.profilePictureUrl}
            alt="Atelier Nox"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Nome + username */}
        <div className="text-center sm:text-left">
          <p className="text-base font-black uppercase tracking-[0.12em] text-[#101820]">Atelier Nox</p>
          <p className="text-sm font-semibold text-[#12382F]/60">@atelier.nox.ch</p>
        </div>

        {/* Stats */}
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-xl font-black text-[#101820]">{posts.length}+</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#12382F]/60">Publications</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-[#101820]">{formatCount(feed.followersCount)}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#12382F]/60">Abonnés</p>
          </div>
        </div>

        {/* Bouton S'abonner */}
        <a
          href="https://www.instagram.com/atelier.nox.ch/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[#E85D2A] bg-[#E85D2A] px-4 py-2 text-sm font-black uppercase text-white shadow-[3px_3px_0_#12382F] transition hover:-translate-y-0.5"
        >
          <Instagram className="h-4 w-4" />
          S&apos;abonner
        </a>
      </div>

      {/* Grid de posts — 4 colunas desktop */}
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden bg-[#F5F1E8]"
          >
            <Image
              src={post.sizes.medium.mediaUrl}
              alt={post.altText ?? post.caption?.slice(0, 60) ?? "Post Instagram"}
              fill
              className="object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-90"
              unoptimized
            />
          </a>
        ))}
      </div>
    </section>
  );
}
