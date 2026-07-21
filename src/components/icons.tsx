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
