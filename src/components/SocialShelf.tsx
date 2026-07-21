import Image from "next/image";
import { Facebook, Instagram } from "@/components/icons";

const socialLinks = [
  {
    href: "https://www.instagram.com/net._.ly?igsh=cXN5MW1randmbnY5&utm_source=qr",
    image: "/social-netly.jpg",
    icon: Instagram,
    color: "#E1306C",
    label: "Instagram @net._.ly",
  },
  {
    href: "https://www.instagram.com/yuklstore?igsh=MTN6ZzV1cjNsNmlqNA%3D%3D&utm_source=qr",
    image: "/social-yuklstore.jpg",
    icon: Instagram,
    color: "#E1306C",
    label: "Instagram @yuklstore",
  },
  {
    href: "https://www.facebook.com/share/1LA4YwfK43/?mibextid=wwXIfr",
    image: null,
    icon: Facebook,
    color: "#1877F2",
    label: "Facebook",
  },
] as const;

export function SocialShelf() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h2 className="font-display text-2xl tracking-[0.08em] text-off-white">
        SÍGUENOS
      </h2>
      <div className="mt-6 flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {socialLinks.map((s) => (
          <a
            key={s.href}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="product-frame group relative aspect-square w-32 shrink-0 overflow-hidden bg-panel sm:w-40"
          >
            {s.image ? (
              <Image
                src={s.image}
                alt={s.label}
                fill
                sizes="160px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <s.icon size={40} className="text-off-white" />
              </div>
            )}
            <span
              className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: s.color }}
            >
              <s.icon size={16} strokeWidth={2} />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
