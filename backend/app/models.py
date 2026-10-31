import uuid
from datetime import datetime, date
from sqlalchemy import (
    Column, String, Float, Integer, Boolean, Date, DateTime, ForeignKey, Text, Index, UniqueConstraint
)
from sqlalchemy.orm import relationship
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False, default="")
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="CUSTOMER") # ADMIN, STAFF, CUSTOMER
    company_name = Column(String(255), nullable=True)
    reset_token = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    subscriptions = relationship("Subscription", back_populates="customer")
    invoices = relationship("Invoice", back_populates="customer")

class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, index=True)
    type = Column(String(50), nullable=False, default="Service") # Service, Storable, Consumable
    description = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    base_price = Column(Float, nullable=False, default=0.0) # Sales Price
    cost_price = Column(Float, nullable=False, default=0.0)
    is_active = Column(Boolean, default=True)

    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")

    @property
    def sales_price(self) -> float:
        return self.base_price

    @sales_price.setter
    def sales_price(self, val: float):
        self.base_price = val

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    attribute_name = Column(String(100), nullable=False) # e.g. "Brand Integration", "Cloud Tier"
    attribute_value = Column(String(100), nullable=False) # e.g. "Odoo", "High-Availability"
    price_modifier = Column(Float, nullable=False, default=0.0) # e.g. +560.00

    product = relationship("Product", back_populates="variants")

    __table_args__ = (
        Index("idx_variant_product", "product_id", "attribute_name"),
    )

class Plan(Base):
    __tablename__ = "plans"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    billing_interval = Column(String(50), nullable=False) # DAILY, WEEKLY, MONTHLY, YEARLY
    interval_count = Column(Integer, nullable=False, default=1)
    min_quantity = Column(Integer, default=1)
    auto_close = Column(Boolean, default=False)
    grace_period_days = Column(Integer, default=7)
    valid_from = Column(Date, nullable=True)
    valid_until = Column(Date, nullable=True)

    subscriptions = relationship("Subscription", back_populates="plan")

class QuotationTemplate(Base):
    __tablename__ = "quotation_templates"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    plan_id = Column(String(36), ForeignKey("plans.id"), nullable=False)
    validity_days = Column(Integer, nullable=False, default=30)
    created_at = Column(DateTime, default=datetime.utcnow)

    plan = relationship("Plan")
    lines = relationship("QuotationTemplateLine", back_populates="template", cascade="all, delete-orphan")

class QuotationTemplateLine(Base):
    __tablename__ = "quotation_template_lines"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    template_id = Column(String(36), ForeignKey("quotation_templates.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    variant_id = Column(String(36), ForeignKey("product_variants.id"), nullable=True)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Float, nullable=False, default=0.0)

    template = relationship("QuotationTemplate", back_populates="lines")
    product = relationship("Product")
    variant = relationship("ProductVariant")

class Discount(Base):
    __tablename__ = "discounts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    code = Column(String(50), unique=True, nullable=False, index=True)
    discount_type = Column(String(50), nullable=False) # PERCENTAGE, FIXED
    value = Column(Float, nullable=False) # 15 for 15% or 200 for $200
    min_order_amount = Column(Float, default=0.0)
    min_quantity = Column(Integer, default=1)
    valid_from = Column(Date, nullable=True)
    valid_until = Column(Date, nullable=True)
    max_uses = Column(Integer, nullable=True)
    used_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    subscription_number = Column(String(50), unique=True, nullable=False, index=True)
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    plan_id = Column(String(36), ForeignKey("plans.id"), nullable=False)
    discount_id = Column(String(36), ForeignKey("discounts.id"), nullable=True)
    status = Column(String(50), nullable=False, default="DRAFT", index=True) # DRAFT, QUOTATION, ACTIVE, CLOSED, CANCELLED
    start_date = Column(Date, nullable=False, default=date.today)
    next_billing_date = Column(Date, nullable=False, index=True)
    last_invoice_date = Column(Date, nullable=True, index=True)
    expiration_date = Column(Date, nullable=True)
    total_recurring_amount = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customer = relationship("User", back_populates="subscriptions")
    plan = relationship("Plan", back_populates="subscriptions")
    discount = relationship("Discount")
    lines = relationship("SubscriptionLine", back_populates="subscription", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="subscription")

    __table_args__ = (
        Index("idx_subs_billing_lookup", "status", "next_billing_date"),
    )

class SubscriptionLine(Base):
    __tablename__ = "subscription_lines"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    subscription_id = Column(String(36), ForeignKey("subscriptions.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    variant_id = Column(String(36), ForeignKey("product_variants.id"), nullable=True)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price_frozen = Column(Float, nullable=False)
    line_total = Column(Float, nullable=False)

    subscription = relationship("Subscription", back_populates="lines")
    product = relationship("Product")
    variant = relationship("ProductVariant")

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    invoice_number = Column(String(50), unique=True, nullable=False, index=True)
    subscription_id = Column(String(36), ForeignKey("subscriptions.id"), nullable=False, index=True)
    customer_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    idempotency_key = Column(String(64), unique=True, nullable=False, index=True) # SHA256(sub_id + billing_date)
    status = Column(String(50), nullable=False, default="DRAFT", index=True) # DRAFT, POSTED, PARTIALLY_PAID, PAID, OVERDUE, CANCELLED
    issue_date = Column(Date, nullable=False, default=date.today)
    due_date = Column(Date, nullable=False, index=True)
    subtotal = Column(Float, nullable=False, default=0.0)
    tax_amount = Column(Float, nullable=False, default=0.0)
    total_amount = Column(Float, nullable=False, default=0.0)
    amount_paid = Column(Float, nullable=False, default=0.0)
    amount_residual = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    subscription = relationship("Subscription", back_populates="invoices")
    customer = relationship("User", back_populates="invoices")
    lines = relationship("InvoiceLine", back_populates="invoice", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="invoice", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_inv_aging_lookup", "status", "due_date"),
    )

class InvoiceLine(Base):
    __tablename__ = "invoice_lines"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    invoice_id = Column(String(36), ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False)
    description = Column(String(255), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Float, nullable=False)
    amount = Column(Float, nullable=False)

    invoice = relationship("Invoice", back_populates="lines")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    invoice_id = Column(String(36), ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), nullable=False) # Cash, Bank, Stripe, UPI
    transaction_ref = Column(String(100), unique=True, nullable=False)
    notes = Column(Text, nullable=True)
    payment_date = Column(Date, default=date.today)
    payment_timestamp = Column(DateTime, default=datetime.utcnow)

    invoice = relationship("Invoice", back_populates="payments")
