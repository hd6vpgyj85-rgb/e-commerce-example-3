import { Facebook, Instagram, Mail, WhatsApp } from "@/components/icons";
import { siteConfig } from "@/lib/site-config";

const socialLinks = [
  {
    href: siteConfig.contact.instagramUrl,
    icon: Instagram,
    color: "#E1306C",
    label: "Instagram",
  },
  {
    href: siteConfig.contact.facebookUrl,
    icon: Facebook,
    color: "#1877F2",
    label: "Facebook",
  },
  {
    href: `https://wa.me/${siteConfig.contact.whatsappNumber}`,
    icon: WhatsApp,
    color: "#25D366",
    label: "WhatsApp",
  },
  {
    href: `mailto:${siteConfig.contact.email}`,
    icon: Mail,
    color: "#EA4335",
    label: "Correo",
  },
] as const;

// Repeated enough times that the row is always wider than any screen, so the
// seamless loop (translateX 0 -> -25%, one quarter = one full set) never
// exposes empty space at the edge on wide viewports.
const items = [...socialLinks, ...socialLinks, ...socialLinks, ...socialLinks];

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
              key={`${s.label}-${i}`}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="product-frame relative aspect-[856/1482] w-40 shrink-0 overflow-hidden bg-panel sm:w-24"
            >
              <div className="flex h-full items-center justify-center">
                <s.icon size={56} className="text-off-white" />
              </div>
              <span
                className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: s.color }}
              >
                <s.icon size={20} strokeWidth={2} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
