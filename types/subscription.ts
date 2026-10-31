// Shared Data Contract for Brightloop Subscription Management System

export type SubscriptionStatus = 'DRAFT' | 'QUOTATION' | 'ACTIVE' | 'CLOSED' | 'CANCELLED';
export type InvoiceStatus = 'DRAFT' | 'POSTED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type BillingInterval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type DiscountType = 'PERCENTAGE' | 'FIXED';
export type UserRole = 'ADMIN' | 'SALES_REP' | 'CUSTOMER';
export type PaymentMethod = 'CARD' | 'UPI' | 'ACH' | 'BANK_TRANSFER';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  companyName?: string;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  attributeName: string; // e.g. "Brand", "Cloud Tier", "Seats"
  attributeValue: string; // e.g. "Odoo", "High-Availability", "10-Pack"
  priceModifier: number; // e.g. +560.00
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  variants: ProductVariant[];
}

export interface Plan {
  id: string;
  name: string;
  billingInterval: BillingInterval;
  intervalCount: number;
  autoClose: boolean;
  gracePeriodDays: number;
}

export interface Discount {
  id: string;
  code: string;
  discountType: DiscountType;
  value: number; // 15 for 15% or 200 for $200
  minOrderAmount: number;
  validUntil: string;
  maxUses?: number;
  timesUsed: number;
}

export interface SubscriptionLine {
  id: string;
  subscriptionId: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPriceFrozen: number;
  lineTotal: number;
}

export interface Subscription {
  id: string;
  subscriptionNumber: string; // e.g. "SUB-2026-00104"
  customerId: string;
  customerName: string;
  planId: string;
  planName: string;
  discountId?: string;
  status: SubscriptionStatus;
  startDate: string;
  nextBillingDate: string;
  expirationDate?: string;
  totalRecurringAmount: number;
  lines: SubscriptionLine[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceLine {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-00451"
  subscriptionId: string;
  customerId: string;
  customerName: string;
  idempotencyKey: string; // hash(sub_id + billing_date)
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  lines: InvoiceLine[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionRef: string;
  paymentTimestamp: string;
}

export interface ARAgingBucket {
  bucket: 'Current (0-30d)' | '31-60d Overdue' | '61-90d Overdue' | '90d+ Delinquent';
  count: number;
  totalAmount: number;
}

export interface DashboardMetrics {
  mrr: number; // Monthly Recurring Revenue normalized
  arr: number; // Annual Recurring Revenue (mrr * 12)
  activeSubscribersCount: number;
  totalOutstandingAR: number;
  agingBuckets: ARAgingBucket[];
  recentInvoicesCount: number;
  slaQueryLatencyMs: number;
}
