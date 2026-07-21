export {
  ChevronDown,
  ShoppingBag,
  Menu,
  X,
  Minus,
  Plus,
  Trash2,
  Phone,
  Mail,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";

import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function baseProps({ size = 24, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: rest.strokeWidth ?? 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
}

export function Facebook(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M15 4h-2a4 4 0 0 0-4 4v3H7v4h2v6h4v-6h2.5l.5-4h-3V8a1 1 0 0 1 1-1h2z" />
    </svg>
  );
}

export function Instagram(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsApp(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.2A8.5 8.5 0 1 0 12 3.5z" />
      <path d="M8.7 9.6c.2-.5.4-.9.7-.9h.6c.2 0 .4.1.5.4.2.5.6 1.5.7 1.7.1.2.1.4 0 .6l-.4.6c-.1.2-.2.3 0 .6.3.5 1 1.3 1.8 1.8.3.2.4.1.6-.1l.5-.6c.1-.2.3-.2.5-.1l1.5.7c.2.1.3.2.3.5 0 .5-.6 1.2-1 1.4-.5.2-1.1.3-2.4-.2-1.9-.7-3.4-2.3-4.2-3.4-.5-.6-.8-1.3-.9-1.9-.1-.5 0-.9.2-1.1z" />
    </svg>
  );
}
