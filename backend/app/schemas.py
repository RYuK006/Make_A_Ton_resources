from datetime import date, datetime
from typing import List, Optional, Literal
from pydantic import BaseModel, Field

# User & Auth Schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    role: Literal["ADMIN", "STAFF", "CUSTOMER"] = "CUSTOMER"
    company_name: Optional[str] = None

class UserRegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    company_name: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: str
    password: str

class StaffCreateRequest(BaseModel):
    email: str
    password: str
    full_name: str
    company_name: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: str

class ForgotPasswordResponse(BaseModel):
    message: str
    reset_token: str
    reset_url: str

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class UserLoginResponse(BaseModel):
    token: str
    user: UserResponse

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
    calculated_price: Optional[float] = None
    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    name: str
    type: str = "Service"
    description: Optional[str] = None
    notes: Optional[str] = None
    base_price: float = 0.0
    sales_price: Optional[float] = None
    cost_price: float = 0.0
    is_active: bool = True

class ProductCreate(BaseModel):
    name: str
    type: Optional[str] = "Service"
    description: Optional[str] = None
    notes: Optional[str] = None
    sales_price: Optional[float] = None
    base_price: Optional[float] = None
    cost_price: float = 0.0
    is_active: bool = True
    variants: Optional[List[ProductVariantCreate]] = []

class ProductResponse(ProductBase):
    id: str
    sales_price: float = 0.0
    variants: List[ProductVariantResponse] = []
    class Config:
        from_attributes = True

# Plan Schemas
class PlanBase(BaseModel):
    name: str
    billing_interval: Literal["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]
    interval_count: int = 1
    min_quantity: int = 1
    auto_close: bool = False
    grace_period_days: int = 7
    valid_from: Optional[date] = None
    valid_until: Optional[date] = None

class PlanCreate(PlanBase):
    pass

class PlanResponse(PlanBase):
    id: str
    class Config:
        from_attributes = True

# Quotation Template Schemas
class QuotationTemplateLineCreate(BaseModel):
    product_id: str
    variant_id: Optional[str] = None
    quantity: int = 1
    unit_price: float

class QuotationTemplateLineResponse(BaseModel):
    id: str
    template_id: str
    product_id: str
    variant_id: Optional[str] = None
    quantity: int
    unit_price: float
    class Config:
        from_attributes = True

class QuotationTemplateCreate(BaseModel):
    name: str
    plan_id: str
    validity_days: int = 30
    lines: List[QuotationTemplateLineCreate] = []

class QuotationTemplateResponse(BaseModel):
    id: str
    name: str
    plan_id: str
    validity_days: int
    created_at: datetime
    lines: List[QuotationTemplateLineResponse] = []
    class Config:
        from_attributes = True

class SubscriptionFromTemplateRequest(BaseModel):
    customer_id: str
    discount_code: Optional[str] = None

# Discount Schemas
class DiscountBase(BaseModel):
    code: str
    discount_type: Literal["PERCENTAGE", "FIXED"]
    value: float
    min_order_amount: float = 0.0
    min_quantity: int = 1
    valid_from: Optional[date] = None
    valid_until: Optional[date] = None
    max_uses: Optional[int] = None
    is_active: bool = True

class DiscountCreate(DiscountBase):
    pass

class DiscountResponse(DiscountBase):
    id: str
    used_count: int
    class Config:
        from_attributes = True

class DiscountValidateRequest(BaseModel):
    code: str
    subtotal: float
    total_qty: int = 1
    target_date: Optional[date] = None

class DiscountValidateResponse(BaseModel):
    is_valid: bool
    code: str
    discount_type: str
    value: float
    discount_amount: float
    final_amount: float
    message: str

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
    action: Literal["QUOTE", "CONFIRM", "ACTIVATE", "CLOSE", "CANCEL"]

class SubscriptionResponse(BaseModel):
    id: str
    subscription_number: str
    customer_id: str
    plan_id: str
    discount_id: Optional[str]
    status: Literal["DRAFT", "QUOTATION", "CONFIRMED", "ACTIVE", "CLOSED", "CANCELLED"]
    start_date: date
    next_billing_date: date
    last_invoice_date: Optional[date] = None
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
    payment_method: str = "Cash" # Cash, Bank, Stripe, UPI
    transaction_ref: Optional[str] = None
    notes: Optional[str] = None
    payment_date: Optional[date] = None

class PaymentResponse(BaseModel):
    id: str
    invoice_id: str
    amount: float
    payment_method: str
    transaction_ref: str
    notes: Optional[str] = None
    payment_date: Optional[date] = None
    payment_timestamp: datetime
    class Config:
        from_attributes = True

class InvoiceResponse(BaseModel):
    id: str
    invoice_number: str
    subscription_id: str
    customer_id: str
    idempotency_key: str
    status: Literal["DRAFT", "POSTED", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"]
    issue_date: date
    due_date: date
    subtotal: float
    tax_amount: float
    total_amount: float
    amount_paid: float
    amount_residual: float
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
