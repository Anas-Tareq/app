from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from enum import Enum
import hashlib


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Elyvra E-commerce API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Enums
class ProductCategory(str, Enum):
    PERFORMANCE = "performance"
    VITALITY = "vitality"
    BEAUTY = "beauty"

class Language(str, Enum):
    AR = "ar"
    EN = "en"
    FR = "fr"


# Product Models
class ProductTranslation(BaseModel):
    name: str
    description: str
    short_description: str
    benefits: List[str]
    ingredients: List[str]
    usage_instructions: str

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

class ProductFilter(BaseModel):
    category: Optional[ProductCategory] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    in_stock: Optional[bool] = None
    featured: Optional[bool] = None
    tags: Optional[List[str]] = None

# Cart Models
class CartItem(BaseModel):
    product_id: str
    quantity: int = 1

class Cart(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    items: List[CartItem] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Order Status Enum
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

# Enhanced User Models
class Address(BaseModel):
    street: str
    city: str
    state: str
    country: str
    postal_code: str

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
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: str

# Marketing & Promotion Models
class DiscountType(str, Enum):
    PERCENTAGE = "percentage"
    FIXED_AMOUNT = "fixed_amount"
    FREE_SHIPPING = "free_shipping"

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


# Helper functions
def prepare_for_mongo(data):
    """Convert Python objects to MongoDB-compatible format"""
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
            elif isinstance(value, dict):
                data[key] = prepare_for_mongo(value)
            elif isinstance(value, list):
                data[key] = [prepare_for_mongo(item) if isinstance(item, dict) else item for item in value]
    return data

def parse_from_mongo(item):
    """Convert MongoDB objects to Python objects"""
    if isinstance(item, dict):
        for key, value in item.items():
            if isinstance(value, str) and key in ['created_at', 'updated_at']:
                try:
                    item[key] = datetime.fromisoformat(value)
                except:
                    pass
    return item

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash"""
    return hashlib.sha256(password.encode()).hexdigest() == password_hash


# Routes
@api_router.get("/")
async def root():
    return {"message": "Welcome to Elyvra API"}

# Product Routes
@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    product_dict = product.dict()
    product_obj = Product(**product_dict)
    prepared_data = prepare_for_mongo(product_obj.dict())
    result = await db.products.insert_one(prepared_data)
    return product_obj

@api_router.get("/products", response_model=List[Product])
async def get_products(
    category: Optional[ProductCategory] = None,
    featured: Optional[bool] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    limit: int = Query(default=20, le=100),
    skip: int = Query(default=0, ge=0)
):
    """Get products with optional filtering"""
    filter_dict = {}
    
    if category:
        filter_dict["category"] = category
    if featured is not None:
        filter_dict["featured"] = featured
    if min_price is not None or max_price is not None:
        price_filter = {}
        if min_price is not None:
            price_filter["$gte"] = min_price
        if max_price is not None:
            price_filter["$lte"] = max_price
        filter_dict["price"] = price_filter
    
    products = await db.products.find(filter_dict).skip(skip).limit(limit).to_list(length=None)
    return [Product(**parse_from_mongo(product)) for product in products]

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**parse_from_mongo(product))

@api_router.get("/products/category/{category}", response_model=List[Product])
async def get_products_by_category(category: ProductCategory):
    products = await db.products.find({"category": category}).to_list(length=None)
    return [Product(**parse_from_mongo(product)) for product in products]

# Cart Routes
@api_router.post("/cart", response_model=Cart)
async def create_cart():
    cart = Cart()
    prepared_data = prepare_for_mongo(cart.dict())
    await db.carts.insert_one(prepared_data)
    return cart

@api_router.get("/cart/{cart_id}", response_model=Cart)
async def get_cart(cart_id: str):
    cart = await db.carts.find_one({"id": cart_id})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    return Cart(**parse_from_mongo(cart))

@api_router.post("/cart/{cart_id}/items")
async def add_to_cart(cart_id: str, item: CartItem):
    cart = await db.carts.find_one({"id": cart_id})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Check if product exists
    product = await db.products.find_one({"id": item.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update cart
    cart_obj = Cart(**parse_from_mongo(cart))
    
    # Check if item already exists in cart
    existing_item = None
    for existing in cart_obj.items:
        if existing.product_id == item.product_id:
            existing_item = existing
            break
    
    if existing_item:
        existing_item.quantity += item.quantity
    else:
        cart_obj.items.append(item)
    
    cart_obj.updated_at = datetime.now(timezone.utc)
    prepared_data = prepare_for_mongo(cart_obj.dict())
    
    await db.carts.update_one(
        {"id": cart_id},
        {"$set": prepared_data}
    )
    
    return {"message": "Item added to cart", "cart": cart_obj}


# Initialize some sample products
@api_router.post("/init-products")
async def init_sample_products():
    """Initialize sample products for demonstration"""
    
    sample_products = [
        {
            "sku": "ELYVRA-PERF-001",
            "category": "performance",
            "price": 89.99,
            "discounted_price": 79.99,
            "image_url": "https://images.unsplash.com/photo-1679932543458-8fe0da87f087",
            "gallery_images": [
                "https://images.unsplash.com/photo-1679932543458-8fe0da87f087",
                "https://images.unsplash.com/photo-1729701792989-f517b77e7f49"
            ],
            "in_stock": True,
            "stock_quantity": 50,
            "featured": True,
            "tags": ["pre-workout", "energy", "performance"],
            "translations": {
                "en": {
                    "name": "Performance Elite Pre-Workout",
                    "description": "Advanced pre-workout formula designed to maximize your training potential with scientifically-backed ingredients.",
                    "short_description": "Premium pre-workout for elite performance",
                    "benefits": ["Increased Energy", "Enhanced Focus", "Better Endurance", "Faster Recovery"],
                    "ingredients": ["Creatine Monohydrate", "Beta-Alanine", "Citrulline Malate", "Caffeine Anhydrous"],
                    "usage_instructions": "Mix 1 scoop with 8-10 oz of water 15-30 minutes before workout."
                },
                "ar": {
                    "name": "بريميوم أداء ما قبل التمرين إيليت",
                    "description": "تركيبة متقدمة لما قبل التمرين مصممة لزيادة إمكاناتك التدريبية مع مكونات مدعومة علمياً.",
                    "short_description": "مكمل ما قبل التمرين الفاخر للأداء المتميز",
                    "benefits": ["زيادة الطاقة", "تحسين التركيز", "تحمل أفضل", "استشفاء أسرع"],
                    "ingredients": ["كرياتين مونوهيدرات", "بيتا ألانين", "سيترولين مالات", "كافيين لامائي"],
                    "usage_instructions": "امزج مغرفة واحدة مع 8-10 أونصة من الماء قبل 15-30 دقيقة من التمرين."
                },
                "fr": {
                    "name": "Pré-Entraînement Élite Performance",
                    "description": "Formule avancée de pré-entraînement conçue pour maximiser votre potentiel d'entraînement avec des ingrédients scientifiquement prouvés.",
                    "short_description": "Pré-entraînement premium pour performance d'élite",
                    "benefits": ["Énergie Accrue", "Concentration Améliorée", "Meilleure Endurance", "Récupération Plus Rapide"],
                    "ingredients": ["Créatine Monohydrate", "Bêta-Alanine", "Citrulline Malate", "Caféine Anhydre"],
                    "usage_instructions": "Mélanger 1 mesure avec 8-10 oz d'eau 15-30 minutes avant l'entraînement."
                }
            }
        },
        {
            "sku": "ELYVRA-VIT-001",
            "category": "vitality",
            "price": 129.99,
            "image_url": "https://images.unsplash.com/photo-1729701792974-2a7341116fb0",
            "gallery_images": [
                "https://images.unsplash.com/photo-1729701792974-2a7341116fb0",
                "https://images.unsplash.com/photo-1729708273852-b63222c8b35d"
            ],
            "in_stock": True,
            "stock_quantity": 30,
            "featured": True,
            "tags": ["vitality", "natural", "wellness"],
            "translations": {
                "en": {
                    "name": "Vitality Boost Natural Complex",
                    "description": "Natural supplement blend designed to support energy, vitality, and overall wellness for both men and women.",
                    "short_description": "Natural vitality and wellness support",
                    "benefits": ["Natural Energy Support", "Enhanced Vitality", "Hormonal Balance", "Overall Wellness"],
                    "ingredients": ["Ashwagandha Extract", "Maca Root", "Ginseng", "Rhodiola Rosea"],
                    "usage_instructions": "Take 2 capsules daily with meals or as directed by healthcare professional."
                },
                "ar": {
                    "name": "مجمع الحيوية الطبيعي المعزز",
                    "description": "مزيج مكملات طبيعية مصمم لدعم الطاقة والحيوية والصحة العامة للرجال والنساء.",
                    "short_description": "دعم الحيوية والصحة الطبيعي",
                    "benefits": ["دعم الطاقة الطبيعية", "تعزيز الحيوية", "توازن هرموني", "الصحة العامة"],
                    "ingredients": ["مستخلص الأشواجاندا", "جذر الماكا", "الجينسنغ", "الروديولا الوردية"],
                    "usage_instructions": "تناول كبسولتين يومياً مع الوجبات أو حسب توجيهات أخصائي الرعاية الصحية."
                },
                "fr": {
                    "name": "Complexe Naturel Boost Vitalité",
                    "description": "Mélange de suppléments naturels conçu pour soutenir l'énergie, la vitalité et le bien-être général pour hommes et femmes.",
                    "short_description": "Support naturel de vitalité et bien-être",
                    "benefits": ["Support Énergétique Naturel", "Vitalité Renforcée", "Équilibre Hormonal", "Bien-être Général"],
                    "ingredients": ["Extrait d'Ashwagandha", "Racine de Maca", "Ginseng", "Rhodiola Rosea"],
                    "usage_instructions": "Prendre 2 gélules par jour avec les repas ou selon les directives d'un professionnel de la santé."
                }
            }
        },
        {
            "sku": "ELYVRA-BEAUTY-001",
            "category": "beauty",
            "price": 159.99,
            "discounted_price": 139.99,
            "image_url": "https://images.unsplash.com/photo-1729701792989-f517b77e7f49",
            "gallery_images": [
                "https://images.unsplash.com/photo-1729701792989-f517b77e7f49",
                "https://images.unsplash.com/photo-1579476549678-f31de2ea0699"
            ],
            "in_stock": True,
            "stock_quantity": 25,
            "featured": True,
            "tags": ["collagen", "beauty", "anti-aging"],
            "translations": {
                "en": {
                    "name": "Premium Collagen Beauty Complex",
                    "description": "Advanced collagen formula with biotin and hyaluronic acid for radiant skin, strong hair, and healthy nails.",
                    "short_description": "Premium collagen for beauty from within",
                    "benefits": ["Radiant Skin", "Stronger Hair", "Healthy Nails", "Anti-aging Support"],
                    "ingredients": ["Marine Collagen Peptides", "Biotin", "Hyaluronic Acid", "Vitamin C"],
                    "usage_instructions": "Mix 1 scoop with water or your favorite beverage daily, preferably on empty stomach."
                },
                "ar": {
                    "name": "مجمع الكولاجين الفاخر للجمال",
                    "description": "تركيبة كولاجين متقدمة مع البيوتين وحمض الهيالورونيك لبشرة مشرقة وشعر قوي وأظافر صحية.",
                    "short_description": "كولاجين فاخر للجمال من الداخل",
                    "benefits": ["بشرة مشرقة", "شعر أقوى", "أظافر صحية", "دعم مكافحة الشيخوخة"],
                    "ingredients": ["ببتيدات الكولاجين البحري", "البيوتين", "حمض الهيالورونيك", "فيتامين سي"],
                    "usage_instructions": "امزج مغرفة واحدة مع الماء أو مشروبك المفضل يومياً، ويفضل على معدة فارغة."
                },
                "fr": {
                    "name": "Complexe Beauté Collagène Premium",
                    "description": "Formule de collagène avancée avec biotine et acide hyaluronique pour une peau radieuse, des cheveux forts et des ongles sains.",
                    "short_description": "Collagène premium pour la beauté de l'intérieur",
                    "benefits": ["Peau Radieuse", "Cheveux Plus Forts", "Ongles Sains", "Support Anti-âge"],
                    "ingredients": ["Peptides de Collagène Marin", "Biotine", "Acide Hyaluronique", "Vitamine C"],
                    "usage_instructions": "Mélanger 1 mesure avec de l'eau ou votre boisson préférée quotidiennement, de préférence à jeun."
                }
            }
        }
    ]
    
    # Clear existing products
    await db.products.delete_many({})
    
    # Insert sample products
    for product_data in sample_products:
        product_obj = Product(**product_data)
        prepared_data = prepare_for_mongo(product_obj.dict())
        await db.products.insert_one(prepared_data)
    
    return {"message": f"Initialized {len(sample_products)} sample products"}


# Admin Routes
@api_router.post("/admin/login")
async def admin_login(login_data: AdminLogin):
    """Login admin user"""
    admin = await db.admins.find_one({"username": login_data.username})
    if not admin or not verify_password(login_data.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not admin.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account is deactivated")
    
    return {
        "message": "Login successful",
        "admin": {
            "id": admin["id"],
            "username": admin["username"],
            "email": admin["email"],
            "full_name": admin["full_name"]
        }
    }

@api_router.post("/admin/create")
async def create_admin(admin_data: AdminCreate):
    """Create new admin user"""
    # Check if admin already exists
    existing = await db.admins.find_one({"username": admin_data.username})
    if existing:
        raise HTTPException(status_code=400, detail="Admin username already exists")
    
    existing_email = await db.admins.find_one({"email": admin_data.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Create admin
    admin_dict = admin_data.dict()
    admin_dict["password_hash"] = hash_password(admin_dict.pop("password"))
    admin_obj = Admin(**admin_dict)
    prepared_data = prepare_for_mongo(admin_obj.dict())
    
    await db.admins.insert_one(prepared_data)
    
    return {"message": "Admin created successfully", "admin_id": admin_obj.id}

@api_router.get("/admin/stats", response_model=AdminStats)
async def get_admin_stats():
    """Get enhanced admin dashboard statistics"""
    # Get total products
    total_products = await db.products.count_documents({})
    
    # Get total carts
    total_carts = await db.carts.count_documents({})
    
    # Get active carts (with items)
    active_carts = await db.carts.count_documents({"items": {"$ne": []}})
    
    # Get total orders and customers
    total_orders = await db.orders.count_documents({})
    total_customers = await db.users.count_documents({})
    
    # Calculate total revenue
    revenue_pipeline = [
        {"$group": {"_id": None, "total": {"$sum": "$total_amount"}}}
    ]
    revenue_result = await db.orders.aggregate(revenue_pipeline).to_list(length=None)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0.0
    
    # Get products by category
    category_pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}}
    ]
    category_results = await db.products.aggregate(category_pipeline).to_list(length=None)
    products_by_category = {item["_id"]: item["count"] for item in category_results}
    
    # Get orders by status
    status_pipeline = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    status_results = await db.orders.aggregate(status_pipeline).to_list(length=None)
    orders_by_status = {item["_id"]: item["count"] for item in status_results}
    
    # Get sales chart data (last 30 days)
    from datetime import timedelta
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    
    sales_pipeline = [
        {"$match": {"created_at": {"$gte": thirty_days_ago.isoformat()}}},
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": {"$dateFromString": {"dateString": "$created_at"}}}},
            "sales": {"$sum": "$total_amount"},
            "orders": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    sales_data = await db.orders.aggregate(sales_pipeline).to_list(length=None)
    sales_chart_data = [{"date": item["_id"], "sales": item["sales"], "orders": item["orders"]} for item in sales_data]
    
    # Get top selling products
    top_products_pipeline = [
        {"$unwind": "$items"},
        {"$group": {
            "_id": "$items.product_id",
            "product_name": {"$first": "$items.product_name"},
            "total_quantity": {"$sum": "$items.quantity"},
            "total_revenue": {"$sum": "$items.total"}
        }},
        {"$sort": {"total_quantity": -1}},
        {"$limit": 5}
    ]
    top_products_data = await db.orders.aggregate(top_products_pipeline).to_list(length=None)
    top_selling_products = [
        {
            "product_id": item["_id"],
            "name": item["product_name"],
            "quantity_sold": item["total_quantity"],
            "revenue": item["total_revenue"]
        } for item in top_products_data
    ]
    
    # Get recent activity
    recent_orders = await db.orders.find().sort("created_at", -1).limit(5).to_list(length=None)
    recent_products = await db.products.find().sort("created_at", -1).limit(3).to_list(length=None)
    
    recent_activity = []
    for order in recent_orders:
        recent_activity.append({
            "type": "order_created",
            "message": f"New order #{order.get('id', 'Unknown')[:8]} - ${order.get('total_amount', 0):.2f}",
            "timestamp": order.get("created_at"),
            "id": order.get("id")
        })
    
    for product in recent_products:
        recent_activity.append({
            "type": "product_created",
            "message": f"Product '{product.get('translations', {}).get('en', {}).get('name', 'Unknown')}' created",
            "timestamp": product.get("created_at"),
            "id": product.get("id")
        })
    
    # Sort by timestamp
    recent_activity.sort(key=lambda x: x.get("timestamp") or datetime.min, reverse=True)
    recent_activity = recent_activity[:10]
    
    return AdminStats(
        total_products=total_products,
        total_carts=total_carts,
        active_carts=active_carts,
        total_orders=total_orders,
        total_customers=total_customers,
        total_revenue=total_revenue,
        products_by_category=products_by_category,
        orders_by_status=orders_by_status,
        recent_activity=recent_activity,
        sales_chart_data=sales_chart_data,
        top_selling_products=top_selling_products
    )

@api_router.put("/admin/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_update: ProductCreate):
    """Update existing product"""
    existing_product = await db.products.find_one({"id": product_id})
    if not existing_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update product
    update_dict = product_update.dict()
    update_dict["updated_at"] = datetime.now(timezone.utc)
    prepared_data = prepare_for_mongo(update_dict)
    
    await db.products.update_one(
        {"id": product_id},
        {"$set": prepared_data}
    )
    
    # Return updated product
    updated_product = await db.products.find_one({"id": product_id})
    return Product(**parse_from_mongo(updated_product))

@api_router.delete("/admin/products/{product_id}")
async def delete_product(product_id: str):
    """Delete product"""
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}

@api_router.get("/admin/carts", response_model=List[Cart])
async def get_all_carts():
    """Get all carts for admin"""
    carts = await db.carts.find().to_list(length=None)
    return [Cart(**parse_from_mongo(cart)) for cart in carts]

@api_router.delete("/admin/carts/{cart_id}")
async def delete_cart(cart_id: str):
    """Delete cart"""
    result = await db.carts.delete_one({"id": cart_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    return {"message": "Cart deleted successfully"}

# Order Routes
@api_router.post("/orders", response_model=Order)
async def create_order(order: OrderCreate):
    """Create a new order"""
    # Calculate totals
    subtotal = sum(item.total for item in order.items)
    tax_amount = subtotal * 0.1  # 10% tax
    shipping_cost = 10.0 if subtotal < 100 else 0.0  # Free shipping over $100
    
    # Apply coupon if provided
    discount_amount = 0.0
    if order.coupon_code:
        coupon = await db.coupons.find_one({"code": order.coupon_code, "is_active": True})
        if coupon and coupon.get("valid_until") and datetime.fromisoformat(coupon["valid_until"]) > datetime.now(timezone.utc):
            if coupon["discount_type"] == "percentage":
                discount_amount = subtotal * (coupon["discount_value"] / 100)
            elif coupon["discount_type"] == "fixed_amount":
                discount_amount = coupon["discount_value"]
            elif coupon["discount_type"] == "free_shipping":
                shipping_cost = 0.0
    
    total_amount = subtotal + tax_amount + shipping_cost - discount_amount
    
    order_dict = order.dict()
    order_dict.update({
        "subtotal": subtotal,
        "tax_amount": tax_amount,
        "shipping_cost": shipping_cost,
        "discount_amount": discount_amount,
        "total_amount": total_amount
    })
    
    order_obj = Order(**order_dict)
    prepared_data = prepare_for_mongo(order_obj.dict())
    await db.orders.insert_one(prepared_data)
    
    # Update customer stats
    await db.users.update_one(
        {"id": order.customer_id},
        {
            "$inc": {"total_orders": 1, "total_spent": total_amount},
            "$set": {"updated_at": datetime.now(timezone.utc).isoformat()}
        }
    )
    
    return order_obj

@api_router.get("/orders", response_model=List[Order])
async def get_orders(
    status: Optional[OrderStatus] = None,
    customer_id: Optional[str] = None,
    limit: int = Query(default=20, le=100),
    skip: int = Query(default=0, ge=0)
):
    """Get orders with optional filtering"""
    filter_dict = {}
    
    if status:
        filter_dict["status"] = status
    if customer_id:
        filter_dict["customer_id"] = customer_id
    
    orders = await db.orders.find(filter_dict).sort("created_at", -1).skip(skip).limit(limit).to_list(length=None)
    return [Order(**parse_from_mongo(order)) for order in orders]

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    """Get single order by ID"""
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return Order(**parse_from_mongo(order))

@api_router.put("/orders/{order_id}", response_model=Order)
async def update_order(order_id: str, order_update: OrderUpdate):
    """Update order status and details"""
    existing_order = await db.orders.find_one({"id": order_id})
    if not existing_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    update_dict = order_update.dict(exclude_unset=True)
    update_dict["updated_at"] = datetime.now(timezone.utc)
    prepared_data = prepare_for_mongo(update_dict)
    
    await db.orders.update_one(
        {"id": order_id},
        {"$set": prepared_data}
    )
    
    updated_order = await db.orders.find_one({"id": order_id})
    return Order(**parse_from_mongo(updated_order))

# Customer Routes
@api_router.get("/customers", response_model=List[User])
async def get_customers(
    segment: Optional[CustomerSegment] = None,
    limit: int = Query(default=20, le=100),
    skip: int = Query(default=0, ge=0)
):
    """Get customers with optional filtering"""
    filter_dict = {}
    if segment:
        filter_dict["segment"] = segment
    
    customers = await db.users.find(filter_dict).sort("created_at", -1).skip(skip).limit(limit).to_list(length=None)
    return [User(**parse_from_mongo(customer)) for customer in customers]

@api_router.get("/customers/{customer_id}", response_model=User)
async def get_customer(customer_id: str):
    """Get single customer by ID"""
    customer = await db.users.find_one({"id": customer_id})
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return User(**parse_from_mongo(customer))

# Coupon Routes
@api_router.post("/coupons", response_model=Coupon)
async def create_coupon(coupon: CouponCreate):
    """Create a new coupon"""
    # Check if coupon code already exists
    existing = await db.coupons.find_one({"code": coupon.code})
    if existing:
        raise HTTPException(status_code=400, detail="Coupon code already exists")
    
    coupon_obj = Coupon(**coupon.dict())
    prepared_data = prepare_for_mongo(coupon_obj.dict())
    await db.coupons.insert_one(prepared_data)
    return coupon_obj

@api_router.get("/coupons", response_model=List[Coupon])
async def get_coupons(
    is_active: Optional[bool] = None,
    limit: int = Query(default=20, le=100),
    skip: int = Query(default=0, ge=0)
):
    """Get coupons with optional filtering"""
    filter_dict = {}
    if is_active is not None:
        filter_dict["is_active"] = is_active
    
    coupons = await db.coupons.find(filter_dict).sort("created_at", -1).skip(skip).limit(limit).to_list(length=None)
    return [Coupon(**parse_from_mongo(coupon)) for coupon in coupons]

# Blog Routes
@api_router.post("/blog", response_model=BlogPost)
async def create_blog_post(post: BlogPostCreate):
    """Create a new blog post"""
    post_obj = BlogPost(**post.dict())
    prepared_data = prepare_for_mongo(post_obj.dict())
    await db.blog_posts.insert_one(prepared_data)
    return post_obj

@api_router.get("/blog", response_model=List[BlogPost])  
async def get_blog_posts(
    published: Optional[bool] = None,
    featured: Optional[bool] = None,
    limit: int = Query(default=20, le=100),
    skip: int = Query(default=0, ge=0)
):
    """Get blog posts with optional filtering"""
    filter_dict = {}
    if published is not None:
        filter_dict["published"] = published
    if featured is not None:
        filter_dict["featured"] = featured
    
    posts = await db.blog_posts.find(filter_dict).sort("created_at", -1).skip(skip).limit(limit).to_list(length=None)
    return [BlogPost(**parse_from_mongo(post)) for post in posts]

@api_router.post("/admin/init-default-admin")
async def init_default_admin():
    """Initialize default admin user"""
    # Check if any admin exists
    existing_admin = await db.admins.find_one({})
    if existing_admin:
        return {"message": "Admin already exists", "existing": True}
    
    # Create default admin
    default_admin = Admin(
        username="admin",
        email="admin@elyvra.com",
        password_hash=hash_password("elyvra123"),
        full_name="Elyvra Administrator"
    )
    
    prepared_data = prepare_for_mongo(default_admin.dict())
    await db.admins.insert_one(prepared_data)
    
    return {
        "message": "Default admin created successfully",
        "username": "admin",
        "password": "elyvra123",
        "note": "Please change the default password after first login"
    }


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()