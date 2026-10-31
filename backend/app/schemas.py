from datetime import date, datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, Field

# User Schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    role: Literal["ADMIN", "SALES_REP", "CUSTOMER"] = "CUSTOMER"
    company_name: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: str
    created_at: datetime
    class Config:
        from_attributes = True

# Product Variant Schemas
class ProductVariantBase(BaseModel):
    attribute_name: str
    attribute_value: str
    price_modifier: float = 0.0

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariantResponse(ProductVariantBase):
    id: str
    product_id: str
    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    base_price: float
    is_active: bool = True

class ProductCreate(ProductBase):
    variants: Optional[List[ProductVariantCreate]] = []

class ProductResponse(ProductBase):
    id: str
    variants: List[ProductVariantResponse] = []
    class Config:
        from_attributes = True

# Plan Schemas
class PlanBase(BaseModel):
    name: str
    billing_interval: Literal["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]
    interval_count: int = 1
    auto_close: bool = False
    grace_period_days: int = 7

class PlanCreate(PlanBase):
    pass

class PlanResponse(PlanBase):
    id: str
    class Config:
        from_attributes = True

# Discount Schemas
class DiscountBase(BaseModel):
    code: str
    discount_type: Literal["PERCENTAGE", "FIXED"]
    value: float
    min_order_amount: float = 0.0
    valid_until: Optional[date] = None
    max_uses: Optional[int] = None

class DiscountCreate(DiscountBase):
    pass

class DiscountResponse(DiscountBase):
    id: str
    times_used: int
    class Config:
        from_attributes = True

# Subscription Line Schemas
class SubscriptionLineCreate(BaseModel):
    product_id: str
    variant_id: Optional[str] = None
    quantity: int = 1

class SubscriptionLineResponse(BaseModel):
    id: str
    product_id: str
    variant_id: Optional[str]
    quantity: int
    unit_price_frozen: float
    line_total: float
    class Config:
        from_attributes = True

# Subscription Schemas
class SubscriptionCreate(BaseModel):
    customer_id: str
    plan_id: str
    discount_code: Optional[str] = None
    lines: List[SubscriptionLineCreate]
    start_date: Optional[date] = None

class SubscriptionTransitionRequest(BaseModel):
    action: Literal["QUOTE", "CONFIRM", "CLOSE", "CANCEL"]

class SubscriptionResponse(BaseModel):
    id: str
    subscription_number: str
    customer_id: str
    plan_id: str
    discount_id: Optional[str]
    status: Literal["DRAFT", "QUOTATION", "ACTIVE", "CLOSED", "CANCELLED"]
    start_date: date
    next_billing_date: date
    expiration_date: Optional[date]
    total_recurring_amount: float
    lines: List[SubscriptionLineResponse] = []
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# Invoice Line & Payment Schemas
class InvoiceLineResponse(BaseModel):
    id: str
    description: str
    quantity: int
    unit_price: float
    amount: float
    class Config:
        from_attributes = True

class PaymentCreate(BaseModel):
    amount: float
    payment_method: Literal["CARD", "UPI", "ACH", "BANK_TRANSFER"]
    transaction_ref: Optional[str] = None

class PaymentResponse(BaseModel):
    id: str
    invoice_id: str
    amount: float
    payment_method: str
    transaction_ref: str
    payment_timestamp: datetime
    class Config:
        from_attributes = True

class InvoiceResponse(BaseModel):
    id: str
    invoice_number: str
    subscription_id: str
    customer_id: str
    idempotency_key: str
    status: Literal["DRAFT", "POSTED", "PAID", "OVERDUE", "CANCELLED"]
    issue_date: date
    due_date: date
    subtotal: float
    tax_amount: float
    total_amount: float
    amount_paid: float
    balance_due: float
    lines: List[InvoiceLineResponse] = []
    payments: List[PaymentResponse] = []
    class Config:
        from_attributes = True

# Billing Day Batch Run Request/Response
class BillingDayBatchRequest(BaseModel):
    target_date: Optional[date] = None

class BillingDayBatchResponse(BaseModel):
    target_date: date
    subscriptions_evaluated: int
    invoices_generated: int
    duplicates_skipped: int
    total_billed_amount: float
    execution_time_ms: float

# Analytics & Dashboard KPIs
class ARAgingBucketResponse(BaseModel):
    bucket: str
    count: int
    total_amount: float

class DashboardKPIResponse(BaseModel):
    mrr: float
    arr: float
    active_subscribers_count: int
    total_outstanding_ar: float
    aging_buckets: List[ARAgingBucketResponse]
    sla_query_latency_ms: float
