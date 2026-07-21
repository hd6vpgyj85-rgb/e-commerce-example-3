import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "@/components/icons";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="neon-glow-line mt-20 bg-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-xl tracking-[0.2em] text-neon">
            {siteConfig.name}
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            {siteConfig.description}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-display text-xs tracking-[0.15em] text-muted">
            CONTACTO
          </p>
          <a
            href={`tel:${siteConfig.contact.whatsappNumber}`}
            className="flex items-center gap-2 text-sm text-off-white transition-colors hover:text-neon"
          >
            <Phone size={16} strokeWidth={1.5} />
            {siteConfig.contact.phoneDisplay}
          </a>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="flex items-center gap-2 text-sm text-off-white transition-colors hover:text-neon"
          >
            <Mail size={16} strokeWidth={1.5} />
            {siteConfig.contact.email}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-display text-xs tracking-[0.15em] text-muted">
            SÍGUENOS
          </p>
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.contact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-off-white transition-colors hover:text-neon"
            >
              <Facebook size={20} strokeWidth={1.5} />
            </a>
            <a
              href={siteConfig.contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-off-white transition-colors hover:text-neon"
            >
              <Instagram size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
          reservados.
        </p>
        <Link
          href="/admin"
          className="mt-2 inline-block text-xs text-muted/60 transition-colors hover:text-neon"
        >
          Acceso administrador
        </Link>
      </div>
    </footer>
  );
}
