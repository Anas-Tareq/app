from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import hashlib

from ..models import (
    Admin, AdminLogin, AdminCreate, AdminStats,
    Product, ProductCreate, Order, OrderUpdate,
    User, Coupon, CouponCreate, BlogPost, BlogPostCreate,
    StaticPage, StaticPageCreate
)

router = APIRouter(prefix="/admin", tags=["admin"])

# Helper functions
def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash"""
    return hashlib.sha256(password.encode()).hexdigest() == password_hash

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
            if isinstance(value, str) and key in ['created_at', 'updated_at', 'valid_from', 'valid_until', 'expiry_date', 'manufacturing_date']:
                try:
                    item[key] = datetime.fromisoformat(value)
                except:
                    pass
    return item

# Authentication Routes
@router.post("/login")
async def admin_login(login_data: AdminLogin, db):
    """Enhanced admin login with permission checking"""
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
            "full_name": admin["full_name"],
            "permissions": admin.get("permissions", [])
        }
    }

@router.post("/create")
async def create_admin(admin_data: AdminCreate, db):
    """Create new admin user with role-based permissions"""
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

@router.post("/init-default-admin")
async def init_default_admin(db):
    """Initialize default admin user"""
    # Check if any admin exists
    existing_admin = await db.admins.find_one({})
    if existing_admin:
        return {"message": "Admin already exists", "existing": True}
    
    # Create default admin with full permissions
    default_admin = Admin(
        username="admin",
        email="admin@elyvra.com",
        password_hash=hash_password("elyvra123"),
        full_name="Elyvra Administrator",
        permissions=["all"]  # Full access
    )
    
    prepared_data = prepare_for_mongo(default_admin.dict())
    await db.admins.insert_one(prepared_data)
    
    return {
        "message": "Default admin created successfully",
        "username": "admin",
        "password": "elyvra123",
        "note": "Please change the default password after first login"
    }

# Enhanced Dashboard Statistics
@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(db):
    """Get comprehensive admin dashboard statistics"""
    # Get total products
    total_products = await db.products.count_documents({})
    
    # Get total carts
    total_carts = await db.carts.count_documents({})
    
    # Get active carts (with items)
    active_carts = await db.carts.count_documents({"items": {"$ne": []}})
    
    # Get abandoned carts (carts with items but no recent activity)
    seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
    abandoned_carts = await db.carts.count_documents({
        "items": {"$ne": []},
        "updated_at": {"$lt": seven_days_ago.isoformat()}
    })
    
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
    
    # Get low stock alerts
    low_stock_products = await db.products.find({"stock_quantity": {"$lt": 10}}).to_list(length=None)
    low_stock_alerts = [
        {
            "product_id": product["id"],
            "name": product.get("translations", {}).get("en", {}).get("name", "Unknown"),
            "current_stock": product.get("stock_quantity", 0),
            "sku": product.get("sku", "")
        } for product in low_stock_products
    ]
    
    # Get sales chart data (last 30 days)
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
        top_selling_products=top_selling_products,
        low_stock_alerts=low_stock_alerts,
        abandoned_carts=abandoned_carts
    )

# Enhanced Product Management
@router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_update: ProductCreate, db):
    """Update existing product with enhanced fields"""
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

@router.delete("/products/{product_id}")
async def delete_product(product_id: str, db):
    """Delete product"""
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}

# Blog/Content Management System
@router.post("/blog", response_model=BlogPost)
async def create_blog_post(post: BlogPostCreate, db):
    """Create new blog post"""
    post_obj = BlogPost(**post.dict())
    prepared_data = prepare_for_mongo(post_obj.dict())
    await db.blog_posts.insert_one(prepared_data)
    return post_obj

@router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts(
    published: Optional[bool] = None,
    limit: int = Query(default=20, le=100),
    skip: int = Query(default=0, ge=0),
    db = None
):
    """Get blog posts with filtering"""
    filter_dict = {}
    if published is not None:
        filter_dict["published"] = published
    
    posts = await db.blog_posts.find(filter_dict).sort("created_at", -1).skip(skip).limit(limit).to_list(length=None)
    return [BlogPost(**parse_from_mongo(post)) for post in posts]

@router.put("/blog/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, post_update: BlogPostCreate, db):
    """Update blog post"""
    existing_post = await db.blog_posts.find_one({"id": post_id})
    if not existing_post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    update_dict = post_update.dict()
    update_dict["updated_at"] = datetime.now(timezone.utc)
    prepared_data = prepare_for_mongo(update_dict)
    
    await db.blog_posts.update_one(
        {"id": post_id},
        {"$set": prepared_data}
    )
    
    updated_post = await db.blog_posts.find_one({"id": post_id})
    return BlogPost(**parse_from_mongo(updated_post))

@router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str, db):
    """Delete blog post"""
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    return {"message": "Blog post deleted successfully"}

# Static Pages Management
@router.post("/pages", response_model=StaticPage)
async def create_static_page(page: StaticPageCreate, db):
    """Create static page"""
    # Check if slug already exists
    existing = await db.static_pages.find_one({"slug": page.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Page with this slug already exists")
    
    page_obj = StaticPage(**page.dict())
    prepared_data = prepare_for_mongo(page_obj.dict())
    await db.static_pages.insert_one(prepared_data)
    return page_obj

@router.get("/pages", response_model=List[StaticPage])
async def get_static_pages(db):
    """Get all static pages"""
    pages = await db.static_pages.find().sort("created_at", -1).to_list(length=None)
    return [StaticPage(**parse_from_mongo(page)) for page in pages]

@router.put("/pages/{page_id}", response_model=StaticPage)
async def update_static_page(page_id: str, page_update: StaticPageCreate, db):
    """Update static page"""
    existing_page = await db.static_pages.find_one({"id": page_id})
    if not existing_page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    update_dict = page_update.dict()
    update_dict["updated_at"] = datetime.now(timezone.utc)
    prepared_data = prepare_for_mongo(update_dict)
    
    await db.static_pages.update_one(
        {"id": page_id},
        {"$set": prepared_data}
    )
    
    updated_page = await db.static_pages.find_one({"id": page_id})
    return StaticPage(**parse_from_mongo(updated_page))

# Enhanced Cart Management
@router.get("/carts", response_model=List[Cart])
async def get_all_carts(
    abandoned_only: Optional[bool] = False,
    db = None
):
    """Get all carts with option to filter abandoned carts"""
    filter_dict = {"items": {"$ne": []}}  # Only carts with items
    
    if abandoned_only:
        seven_days_ago = datetime.now(timezone.utc) - timedelta(days=7)
        filter_dict["updated_at"] = {"$lt": seven_days_ago.isoformat()}
    
    carts = await db.carts.find(filter_dict).sort("updated_at", -1).to_list(length=None)
    return [Cart(**parse_from_mongo(cart)) for cart in carts]

@router.delete("/carts/{cart_id}")
async def delete_cart(cart_id: str, db):
    """Delete cart"""
    result = await db.carts.delete_one({"id": cart_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    return {"message": "Cart deleted successfully"}

