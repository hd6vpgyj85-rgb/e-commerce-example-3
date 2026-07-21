import { Facebook, Instagram } from "@/components/icons";

const socialLinks = [
  {
    href: "https://www.instagram.com/net._.ly?igsh=cXN5MW1randmbnY5&utm_source=qr",
    icon: Instagram,
    color: "#E1306C",
    label: "Instagram @net._.ly",
  },
  {
    href: "https://www.instagram.com/yuklstore?igsh=MTN6ZzV1cjNsNmlqNA%3D%3D&utm_source=qr",
    icon: Instagram,
    color: "#E1306C",
    label: "Instagram @yuklstore",
  },
  {
    href: "https://www.facebook.com/share/1LA4YwfK43/?mibextid=wwXIfr",
    icon: Facebook,
    color: "#1877F2",
    label: "Facebook",
  },
] as const;

const items = [...socialLinks, ...socialLinks];

export function SocialShelf() {
  return (
    <section className="w-full py-10">
      <h2 className="mx-auto max-w-6xl px-4 font-display text-2xl tracking-[0.08em] text-off-white sm:px-6">
        SÍGUENOS
      </h2>
      <div className="group mt-6 overflow-hidden">
        <div className="flex w-max animate-social-scroll gap-4 px-4 group-hover:[animation-play-state:paused] sm:px-6">
          {items.map((s, i) => (
            <a
              key={`${s.href}-${i}`}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="product-frame relative aspect-[856/1482] w-40 shrink-0 overflow-hidden bg-panel sm:w-48"
            >
              <div className="flex h-full items-center justify-center">
                <s.icon size={40} className="text-off-white" />
              </div>
              <span
                className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: s.color }}
              >
                <s.icon size={16} strokeWidth={2} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
