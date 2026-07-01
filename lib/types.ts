export type ProductCategory =
  | "Bridal Lehengas"
  | "Heritage Sarees"
  | "Dress Materials"
  | "Designer Kurtas"
  | "Chaniya Choli"
  | "Punjabi Suits"
  | "Bridal Blouses"
  | "Mens Ethnic Wear";

export type ProductStatus = "draft" | "published" | "archived";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  image: string;
  gallery: string[];
  badge?: string;
  story: string;
  description: string;
  fabric: string;
  craft: string[];
  colors: string[];
  sizes: string[];
  inventory: number;
  dispatch: string;
  customizable: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  status?: ProductStatus;
  seoTitle?: string;
  seoDescription?: string;
  care?: string;
  createdAt?: number;
  updatedAt?: number;
};

export const productCategories: ProductCategory[] = [
  "Bridal Lehengas",
  "Heritage Sarees",
  "Dress Materials",
  "Designer Kurtas",
  "Chaniya Choli",
  "Punjabi Suits",
  "Bridal Blouses",
  "Mens Ethnic Wear",
];

export type OrderStatus =
  | "new"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus = "created" | "pending" | "paid" | "failed" | "refunded";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
};

export type OrderCustomer = {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
};

export type OrderTimelineEntry = {
  status: OrderStatus | "payment_created" | "payment_failed" | "payment_paid" | "refunded";
  at: number;
  note?: string;
};

export type Order = {
  id: string;
  customer: OrderCustomer;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  razorpay?: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
  };
  trackingNumber?: string;
  courier?: string;
  timeline: OrderTimelineEntry[];
  uid?: string;
  agreedToTermsAt: number;
  createdAt: number;
  updatedAt: number;
};

export type Customer = {
  id: string;
  uid?: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  address?: string;
  orderIds: string[];
  orderCount: number;
  lifetimeValue: number;
  lastOrderAt: number;
  createdAt: number;
  updatedAt: number;
};

export type OtpPurpose = "email";

export type OtpRecord = {
  codeHash: string;
  expiresAt: number;
  attempts: number;
  verifiedAt?: number;
};

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/** Fixed locale + timezone so server-rendered and client-hydrated output always match —
 * `toLocaleDateString()` depends on the runtime's locale/timezone, which can differ
 * between the Node SSR process and the browser and causes hydration mismatches. */
export function formatAdminDate(value: number) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(value);
}
