from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from enum import Enum

# Enums
class ProductCategory(str, Enum):
    PERFORMANCE = "performance"
    VITALITY = "vitality"
    BEAUTY = "beauty"

class Language(str, Enum):
    AR = "ar"
    EN = "en"
    FR = "fr"

class OrderStatus(str, Enum):
    PENDING_PAYMENT = "pending_payment"
    PROCESSING = "processing"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class PaymentMethod(str, Enum):
    CREDIT_CARD = "credit_card"
    PAYPAL = "paypal"
    CASH_ON_DELIVERY = "cash_on_delivery"
    BANK_TRANSFER = "bank_transfer"

class CustomerSegment(str, Enum):
    NEW = "new"
    REGULAR = "regular"
    VIP = "vip"

class DiscountType(str, Enum):
    PERCENTAGE = "percentage"
    FIXED_AMOUNT = "fixed_amount"
    FREE_SHIPPING = "free_shipping"

# Enhanced Product Models with Supplement-specific fields
class ProductTranslation(BaseModel):
    name: str
    description: str
    short_description: str
    benefits: List[str]
    ingredients: List[str]
    usage_instructions: str
    # New fields for supplements
    active_ingredients: Optional[str] = None  # المكونات النشطة
    recommended_dosage: Optional[str] = None  # الجرعة الموصى بها
    usage_warnings: Optional[str] = None  # تحذيرات الاستخدام

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sku: str
    category: ProductCategory
    price: float
    discounted_price: Optional[float] = None
    image_url: str
    gallery_images: List[str] = []
    in_stock: bool = True
    stock_quantity: int = 0
    translations: Dict[str, ProductTranslation]
    tags: List[str] = []
    featured: bool = False
    # New supplement-specific fields
    certifications: List[str] = []  # شهادات الجودة (URLs to certificate files/images)
    expiry_date: Optional[datetime] = None  # تاريخ انتهاء الصلاحية
    manufacturing_date: Optional[datetime] = None  # تاريخ الإنتاج
    batch_number: Optional[str] = None  # رقم الدفعة
    storage_conditions: Optional[str] = None  # ظروف التخزين
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    sku: str
    category: ProductCategory
    price: float
    discounted_price: Optional[float] = None
    image_url: str
    gallery_images: List[str] = []
    in_stock: bool = True
    stock_quantity: int = 0
    translations: Dict[str, ProductTranslation]
    tags: List[str] = []
    featured: bool = False
    # Supplement-specific fields
    certifications: List[str] = []
    expiry_date: Optional[datetime] = None
    manufacturing_date: Optional[datetime] = None
    batch_number: Optional[str] = None
    storage_conditions: Optional[str] = None

# Address Model
class Address(BaseModel):
    street: str
    city: str
    state: str
    country: str
    postal_code: str

# Enhanced User Model
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    preferred_language: Language = Language.EN
    billing_address: Optional[Address] = None
    shipping_address: Optional[Address] = None
    segment: CustomerSegment = CustomerSegment.NEW
    total_orders: int = 0
    total_spent: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Cart Models
class CartItem(BaseModel):
    product_id: str
    quantity: int = 1

class Cart(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    items: List[CartItem] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Order Models
class OrderItem(BaseModel):
    product_id: str
    product_name: str
    price: float
    quantity: int
    total: float

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_id: str
    items: List[OrderItem]
    subtotal: float
    tax_amount: float = 0.0
    shipping_cost: float = 0.0
    discount_amount: float = 0.0
    total_amount: float
    status: OrderStatus = OrderStatus.PENDING_PAYMENT
    payment_method: Optional[PaymentMethod] = None
    shipping_address: Address
    billing_address: Address
    notes: Optional[str] = None
    tracking_number: Optional[str] = None
    coupon_code: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    customer_id: str
    items: List[OrderItem]
    shipping_address: Address
    billing_address: Address
    payment_method: PaymentMethod
    notes: Optional[str] = None
    coupon_code: Optional[str] = None

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    tracking_number: Optional[str] = None
    notes: Optional[str] = None

# Admin Models
class Admin(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    password_hash: str
    full_name: str
    is_active: bool = True
    permissions: List[str] = []  # New field for role-based permissions
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: str
    permissions: List[str] = []

# Marketing & Promotion Models
class Coupon(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    description: str
    discount_type: DiscountType
    discount_value: float
    minimum_order_amount: Optional[float] = None
    max_usage_count: Optional[int] = None
    current_usage_count: int = 0
    valid_from: datetime
    valid_until: datetime
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CouponCreate(BaseModel):
    code: str
    description: str
    discount_type: DiscountType
    discount_value: float
    minimum_order_amount: Optional[float] = None
    max_usage_count: Optional[int] = None
    valid_from: datetime
    valid_until: datetime
    is_active: bool = True

# Blog & Content Models
class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: Dict[str, str]  # Multi-language titles
    content: Dict[str, str]  # Multi-language content
    excerpt: Dict[str, str]  # Multi-language excerpts
    featured_image: Optional[str] = None
    author: str
    published: bool = False
    featured: bool = False
    tags: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlogPostCreate(BaseModel):
    title: Dict[str, str]
    content: Dict[str, str]
    excerpt: Dict[str, str]
    featured_image: Optional[str] = None
    author: str
    published: bool = False
    featured: bool = False
    tags: List[str] = []

# Enhanced Admin Stats
class AdminStats(BaseModel):
    total_products: int
    total_carts: int
    active_carts: int
    total_orders: int
    total_customers: int
    total_revenue: float
    products_by_category: Dict[str, int]
    orders_by_status: Dict[str, int]
    recent_activity: List[Dict[str, Any]]
    sales_chart_data: List[Dict[str, Any]]
    top_selling_products: List[Dict[str, Any]]
    low_stock_alerts: List[Dict[str, Any]]  # New field for inventory alerts
    abandoned_carts: int  # New field for abandoned cart tracking

# Static Page Models (for CMS functionality)
class StaticPage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str  # URL slug (e.g., "about-us", "privacy-policy")
    title: Dict[str, str]  # Multi-language titles
    content: Dict[str, str]  # Multi-language content
    meta_description: Dict[str, str] = {}  # SEO meta descriptions
    published: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StaticPageCreate(BaseModel):
    slug: str
    title: Dict[str, str]
    content: Dict[str, str]
    meta_description: Dict[str, str] = {}
    published: bool = True

