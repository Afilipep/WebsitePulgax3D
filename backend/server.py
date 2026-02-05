from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import jwt
import bcrypt
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'pulgax-3d-store-secret-key-2024')
JWT_ALGORITHM = "HS256"

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer()

# ============== MODELS ==============

class AdminCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminResponse

class CategoryCreate(BaseModel):
    name_pt: str
    name_en: str
    description_pt: Optional[str] = ""
    description_en: Optional[str] = ""
    image_url: Optional[str] = ""

class CategoryResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name_pt: str
    name_en: str
    description_pt: str
    description_en: str
    image_url: str
    created_at: str

class ProductColor(BaseModel):
    name_pt: str
    name_en: str
    hex_code: str
    image_url: str

class ProductSize(BaseModel):
    name: str
    price_adjustment: float = 0.0

class CustomizationOption(BaseModel):
    name_pt: str
    name_en: str
    type: str  # "text", "number"
    required: bool = False
    max_length: Optional[int] = None

class ProductCreate(BaseModel):
    name_pt: str
    name_en: str
    description_pt: str
    description_en: str
    base_price: float
    category_id: str
    colors: List[ProductColor] = []
    sizes: List[ProductSize] = []
    customization_options: List[CustomizationOption] = []
    images: List[str] = []
    featured: bool = False
    active: bool = True

class ProductResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name_pt: str
    name_en: str
    description_pt: str
    description_en: str
    base_price: float
    category_id: str
    colors: List[Dict[str, Any]]
    sizes: List[Dict[str, Any]]
    customization_options: List[Dict[str, Any]]
    images: List[str]
    featured: bool
    active: bool
    created_at: str

class CartItem(BaseModel):
    product_id: str
    quantity: int
    selected_color: Optional[str] = None
    selected_size: Optional[str] = None
    customizations: Optional[Dict[str, str]] = {}

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: Optional[str] = ""
    customer_id: Optional[str] = None
    shipping_address: str
    payment_method: str
    payment_details: Optional[Dict[str, Any]] = {}
    shipping_method: Optional[str] = None
    shipping_cost: Optional[float] = 0.0
    notes: Optional[str] = ""
    items: List[CartItem]
    total_amount: float

class OrderResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_id: Optional[str] = None
    shipping_address: str
    payment_method: str
    payment_details: Optional[Dict[str, Any]] = {}
    shipping_method: Optional[str] = None
    shipping_cost: Optional[float] = 0.0
    items: List[Dict[str, Any]]
    notes: str
    total_amount: float
    calculated_total: Optional[float] = None
    status: str
    created_at: str

# Customer models
class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = ""

class CustomerLogin(BaseModel):
    email: EmailStr
    password: str

class CustomerResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    phone: str
    created_at: str

class CustomerTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    customer: CustomerResponse

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: str
    message: str

class ContactResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    phone: str
    subject: str
    message: str
    read: bool
    created_at: str

# ============== HELPER FUNCTIONS ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(admin_id: str) -> str:
    payload = {
        "sub": admin_id,
        "exp": datetime.now(timezone.utc).timestamp() + 86400 * 7  # 7 days
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        admin_id = payload.get("sub")
        admin = await db.admins.find_one({"id": admin_id}, {"_id": 0, "password": 0})
        if not admin:
            raise HTTPException(status_code=401, detail="Admin not found")
        return admin
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_customer(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        customer_id = payload.get("sub")
        customer = await db.customers.find_one({"id": customer_id}, {"_id": 0, "password": 0})
        if not customer:
            raise HTTPException(status_code=401, detail="Customer not found")
        return customer
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_optional_customer(credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))):
    if not credentials:
        return None
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        customer_id = payload.get("sub")
        customer = await db.customers.find_one({"id": customer_id}, {"_id": 0, "password": 0})
        return customer
    except:
        return None

def generate_order_number() -> str:
    return f"PX-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"

async def validate_and_calculate_order(items: List[CartItem]) -> tuple[List[Dict[str, Any]], float]:
    """Validate products and calculate total"""
    validated_items = []
    total = 0.0
    
    for item in items:
        # Get product from database
        product = await db.products.find_one({"id": item.product_id, "active": True}, {"_id": 0})
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} not found or inactive")
        
        # Calculate item price
        item_price = product["base_price"]
        
        # Add size price adjustment if applicable
        if item.selected_size and product.get("sizes"):
            size_info = next((s for s in product["sizes"] if s["name"] == item.selected_size), None)
            if size_info:
                item_price += size_info.get("price_adjustment", 0.0)
        
        # Validate color if selected
        if item.selected_color and product.get("colors"):
            color_exists = any(c["name_pt"] == item.selected_color or c["name_en"] == item.selected_color 
                             for c in product["colors"])
            if not color_exists:
                raise HTTPException(status_code=400, detail=f"Invalid color for product {item.product_id}")
        
        # Create validated item
        validated_item = {
            "product_id": item.product_id,
            "product_name_pt": product["name_pt"],
            "product_name_en": product["name_en"],
            "quantity": item.quantity,
            "unit_price": item_price,
            "total_price": item_price * item.quantity,
            "selected_color": item.selected_color,
            "selected_size": item.selected_size,
            "customizations": item.customizations or {}
        }
        
        validated_items.append(validated_item)
        total += validated_item["total_price"]
    
    return validated_items, total

# ============== CUSTOMER AUTH ROUTES ==============

@api_router.post("/customer/register", response_model=CustomerTokenResponse)
async def register_customer(customer: CustomerCreate):
    # Check if email already exists
    if await db.customers.find_one({"email": customer.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    customer_id = str(uuid.uuid4())
    customer_doc = {
        "id": customer_id,
        "email": customer.email,
        "password": hash_password(customer.password),
        "name": customer.name,
        "phone": customer.phone,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.customers.insert_one(customer_doc)
    
    token = create_token(customer_id)
    customer_response = CustomerResponse(
        id=customer_id,
        email=customer.email,
        name=customer.name,
        phone=customer.phone,
        created_at=customer_doc["created_at"]
    )
    return CustomerTokenResponse(access_token=token, customer=customer_response)

@api_router.post("/customer/login", response_model=CustomerTokenResponse)
async def login_customer(credentials: CustomerLogin):
    customer = await db.customers.find_one({"email": credentials.email})
    if not customer or not verify_password(credentials.password, customer["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(customer["id"])
    customer_response = CustomerResponse(
        id=customer["id"],
        email=customer["email"],
        name=customer["name"],
        phone=customer.get("phone", ""),
        created_at=customer["created_at"]
    )
    return CustomerTokenResponse(access_token=token, customer=customer_response)

@api_router.get("/customer/profile", response_model=CustomerResponse)
async def get_customer_profile(customer = Depends(get_current_customer)):
    return CustomerResponse(**customer)

@api_router.get("/customer/orders", response_model=List[OrderResponse])
async def get_customer_orders(customer = Depends(get_current_customer)):
    orders = await db.orders.find({"customer_id": customer["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return [OrderResponse(**order) for order in orders]

# ============== ADMIN AUTH ROUTES ==============

@api_router.post("/admin/register", response_model=TokenResponse)
async def register_admin(admin: AdminCreate):
    # Check if any admin exists (only allow first admin registration)
    existing_admin = await db.admins.find_one({})
    if existing_admin:
        raise HTTPException(status_code=400, detail="Admin already exists. Contact existing admin.")
    
    # Check if email already exists
    if await db.admins.find_one({"email": admin.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    admin_id = str(uuid.uuid4())
    admin_doc = {
        "id": admin_id,
        "email": admin.email,
        "password": hash_password(admin.password),
        "name": admin.name,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.admins.insert_one(admin_doc)
    
    token = create_token(admin_id)
    admin_response = AdminResponse(
        id=admin_id,
        email=admin.email,
        name=admin.name,
        created_at=admin_doc["created_at"]
    )
    return TokenResponse(access_token=token, admin=admin_response)

@api_router.post("/admin/login", response_model=TokenResponse)
async def login_admin(credentials: AdminLogin):
    admin = await db.admins.find_one({"email": credentials.email})
    if not admin or not verify_password(credentials.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(admin["id"])
    admin_response = AdminResponse(
        id=admin["id"],
        email=admin["email"],
        name=admin["name"],
        created_at=admin["created_at"]
    )
    return TokenResponse(access_token=token, admin=admin_response)

@api_router.get("/admin/me", response_model=AdminResponse)
async def get_current_admin_info(admin = Depends(get_current_admin)):
    return AdminResponse(**admin)

# ============== CATEGORY ROUTES ==============

@api_router.post("/categories", response_model=CategoryResponse)
async def create_category(category: CategoryCreate, admin = Depends(get_current_admin)):
    category_id = str(uuid.uuid4())
    category_doc = {
        "id": category_id,
        **category.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.categories.insert_one(category_doc)
    return CategoryResponse(**category_doc)

@api_router.get("/categories", response_model=List[CategoryResponse])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(100)
    return [CategoryResponse(**cat) for cat in categories]

@api_router.get("/categories/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: str):
    category = await db.categories.find_one({"id": category_id}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return CategoryResponse(**category)

@api_router.put("/categories/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: str, category: CategoryCreate, admin = Depends(get_current_admin)):
    result = await db.categories.update_one(
        {"id": category_id},
        {"$set": category.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    updated = await db.categories.find_one({"id": category_id}, {"_id": 0})
    return CategoryResponse(**updated)

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str, admin = Depends(get_current_admin)):
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted"}

# ============== PRODUCT ROUTES ==============

@api_router.post("/products", response_model=ProductResponse)
async def create_product(product: ProductCreate, admin = Depends(get_current_admin)):
    product_id = str(uuid.uuid4())
    product_doc = {
        "id": product_id,
        **product.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.products.insert_one(product_doc)
    return ProductResponse(**product_doc)

@api_router.get("/products", response_model=List[ProductResponse])
async def get_products(category_id: Optional[str] = None, featured: Optional[bool] = None):
    query = {"active": True}
    if category_id:
        query["category_id"] = category_id
    if featured is not None:
        query["featured"] = featured
    products = await db.products.find(query, {"_id": 0}).to_list(500)
    return [ProductResponse(**prod) for prod in products]

@api_router.get("/products/all", response_model=List[ProductResponse])
async def get_all_products(admin = Depends(get_current_admin)):
    products = await db.products.find({}, {"_id": 0}).to_list(500)
    return [ProductResponse(**prod) for prod in products]

@api_router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductResponse(**product)

@api_router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, product: ProductCreate, admin = Depends(get_current_admin)):
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": product.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return ProductResponse(**updated)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, admin = Depends(get_current_admin)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

# ============== ORDER ROUTES ==============

@api_router.post("/orders", response_model=OrderResponse)
async def create_order(order: OrderCreate, customer = Depends(get_optional_customer)):
    try:
        # Validate products and calculate totals
        validated_items, calculated_total = await validate_and_calculate_order(order.items)
        
        # Add shipping cost to calculated total
        total_with_shipping = calculated_total + (order.shipping_cost or 0.0)
        
        # Validate total amount (allow small rounding differences)
        if abs(total_with_shipping - order.total_amount) > 0.01:
            raise HTTPException(
                status_code=400, 
                detail=f"Total amount mismatch. Expected: €{total_with_shipping:.2f}, Received: €{order.total_amount:.2f}"
            )
        
        order_id = str(uuid.uuid4())
        order_doc = {
            "id": order_id,
            "order_number": generate_order_number(),
            "customer_name": order.customer_name,
            "customer_email": order.customer_email,
            "customer_phone": order.customer_phone or "",
            "customer_id": customer["id"] if customer else None,
            "shipping_address": order.shipping_address,
            "payment_method": order.payment_method,
            "payment_details": order.payment_details or {},
            "shipping_method": order.shipping_method,
            "shipping_cost": order.shipping_cost or 0.0,
            "items": validated_items,
            "notes": order.notes or "",
            "total_amount": order.total_amount,
            "calculated_total": total_with_shipping,
            "status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.orders.insert_one(order_doc)
        return OrderResponse(**order_doc)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing order")

@api_router.get("/orders", response_model=List[OrderResponse])
async def get_orders(admin = Depends(get_current_admin)):
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [OrderResponse(**order) for order in orders]

@api_router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str, admin = Depends(get_current_admin)):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return OrderResponse(**order)

@api_router.put("/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str, admin = Depends(get_current_admin)):
    valid_statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Status updated", "status": status}

# ============== CONTACT ROUTES ==============

@api_router.post("/contact", response_model=ContactResponse)
async def create_contact_message(message: ContactMessage):
    message_id = str(uuid.uuid4())
    message_doc = {
        "id": message_id,
        **message.model_dump(),
        "read": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.contact_messages.insert_one(message_doc)
    return ContactResponse(**message_doc)

@api_router.get("/contact", response_model=List[ContactResponse])
async def get_contact_messages(admin = Depends(get_current_admin)):
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [ContactResponse(**msg) for msg in messages]

@api_router.put("/contact/{message_id}/read")
async def mark_message_read(message_id: str, admin = Depends(get_current_admin)):
    result = await db.contact_messages.update_one(
        {"id": message_id},
        {"$set": {"read": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Marked as read"}

@api_router.delete("/contact/{message_id}")
async def delete_contact_message(message_id: str, admin = Depends(get_current_admin)):
    result = await db.contact_messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message deleted"}

# ============== IMAGE UPLOAD ==============

@api_router.post("/upload")
async def upload_image(file: UploadFile = File(...), admin = Depends(get_current_admin)):
    contents = await file.read()
    encoded = base64.b64encode(contents).decode('utf-8')
    content_type = file.content_type or "image/jpeg"
    data_url = f"data:{content_type};base64,{encoded}"
    return {"url": data_url}

# ============== STATS ==============

@api_router.get("/stats")
async def get_stats(admin = Depends(get_current_admin)):
    total_products = await db.products.count_documents({})
    total_categories = await db.categories.count_documents({})
    total_orders = await db.orders.count_documents({})
    pending_orders = await db.orders.count_documents({"status": "pending"})
    unread_messages = await db.contact_messages.count_documents({"read": False})
    
    return {
        "total_products": total_products,
        "total_categories": total_categories,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "unread_messages": unread_messages
    }

# ============== ROOT ==============

@api_router.get("/")
async def root():
    return {"message": "Pulgax 3D Store API", "status": "running"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
