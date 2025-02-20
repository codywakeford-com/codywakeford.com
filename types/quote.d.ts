export {};

declare global {
  interface Quote {
    id: string;
    items: QuoteItem[];
    timestamp: number;
    projectId: string;
    currency: "gbp" | "usd" | "eur";
    taxRate?: number; // %
    status: "draft" | "sent" | "accepted" | "rejected";
    totalAmount: number;
    discount: number; // %
  }

  interface QuoteItem {
    name: string;
    paymentType: "single" | "weekly" | "biweekly" | "monthly";
    description?: string;
    quantity: number;
    unitPrice: number; // in pence
    subtotal: number;
  }
}
