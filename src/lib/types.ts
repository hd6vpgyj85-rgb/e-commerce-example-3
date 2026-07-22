export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  images: string[];
  collectionIds: string[];
  variants: ProductVariant[];
  visible: boolean;
  createdAt?: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  order: number;
  visible: boolean;
  createdAt?: number;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  unitPrice: number;
  variant: Record<string, string>;
  qty: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  variant: Record<string, string>;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export type OrderStatus = "pendiente" | "contactado" | "completado";

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  contactMessage: string;
  createdAt?: number;
}
