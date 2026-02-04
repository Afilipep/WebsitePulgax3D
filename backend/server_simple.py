"""
Simple FastAPI server with JSON file storage (for testing without MongoDB)
This is a simplified version that stores data in JSON files instead of MongoDB.
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
import json
import os
import uuid
from datetime import datetime, timezone
import jwt
import bcrypt
from pathlib import Path

# Configuration
JWT_SECRET = "pulgax-3d-store-secret-key-2024"
JWT_ALGORITHM = "HS256"
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

# Data files
ADMINS_FILE = DATA_DIR / "admins.json"
CATEGORIES_FILE = DATA_DIR / "categories.json"
PRODUCTS_FILE = DATA_DIR / "products.json"
ORDERS_FILE = DATA_DIR / "orders.json"
MESSAGES_FILE = DATA_DIR / "messages.json"

app = FastAPI(title="Pulgax 3D Store API", version="1.0.0")
security = HTTPBearer()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============== MODELS ==============

class AdminCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
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
    id: str
    name_pt: str
    name_en: str
    description_pt: str
    description_en: str
    image_url: str
    created_at: str

class ProductCreate(BaseModel):
    name_pt: str
    name_en: str
    description_pt: str
    description_en: str
    base_price: float
    category_id: str
    colors: List[Dict[str, Any]] = []
    sizes: List[Dict[str, Any]] = []
    customization_options: List[Dict[str, Any]] = []
    images: List[str] = []
    featured: bool = False
    active: bool = True

class ProductResponse(BaseModel):
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

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    subject: str
    message: str

class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    subject: str
    message: str
    read: bool
    created_at: str

# ============== HELPER FUNCTIONS ==============

def load_json(file_path: Path) -> List[Dict]:
    """Load data from JSON file"""
    if not file_path.exists():
        return []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except:
        return []

def save_json(file_path: Path, data: List[Dict]):
    """Save data to JSON file"""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

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
        
        admins = load_json(ADMINS_FILE)
        admin = next((a for a in admins if a["id"] == admin_id), None)
        
        if not admin:
            raise HTTPException(status_code=401, detail="Admin not found")
        
        # Remove password from response
        admin_copy = admin.copy()
        admin_copy.pop("password", None)
        return admin_copy
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============== ROUTES ==============

@app.get("/api/")
async def root():
    return {"message": "Pulgax 3D Store API", "status": "running", "storage": "JSON files"}

# Admin Auth
@app.post("/api/admin/register", response_model=TokenResponse)
async def register_admin(admin: AdminCreate):
    admins = load_json(ADMINS_FILE)
    
    # Check if any admin exists
    if admins:
        raise HTTPException(status_code=400, detail="Admin already exists")
    
    # Check email
    if any(a["email"] == admin.email for a in admins):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    admin_id = str(uuid.uuid4())
    admin_doc = {
        "id": admin_id,
        "email": admin.email,
        "password": hash_password(admin.password),
        "name": admin.name,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    admins.append(admin_doc)
    save_json(ADMINS_FILE, admins)
    
    token = create_token(admin_id)
    admin_response = AdminResponse(
        id=admin_id,
        email=admin.email,
        name=admin.name,
        created_at=admin_doc["created_at"]
    )
    return TokenResponse(access_token=token, admin=admin_response)

@app.post("/api/admin/login", response_model=TokenResponse)
async def login_admin(credentials: AdminLogin):
    admins = load_json(ADMINS_FILE)
    admin = next((a for a in admins if a["email"] == credentials.email), None)
    
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

# Categories
@app.get("/api/categories", response_model=List[CategoryResponse])
async def get_categories():
    categories = load_json(CATEGORIES_FILE)
    return [CategoryResponse(**cat) for cat in categories]

@app.post("/api/categories", response_model=CategoryResponse)
async def create_category(category: CategoryCreate, admin = Depends(get_current_admin)):
    categories = load_json(CATEGORIES_FILE)
    
    category_id = str(uuid.uuid4())
    category_doc = {
        "id": category_id,
        **category.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    categories.append(category_doc)
    save_json(CATEGORIES_FILE, categories)
    
    return CategoryResponse(**category_doc)

@app.put("/api/categories/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: str, category: CategoryCreate, admin = Depends(get_current_admin)):
    categories = load_json(CATEGORIES_FILE)
    
    for i, cat in enumerate(categories):
        if cat["id"] == category_id:
            categories[i].update(category.model_dump())
            save_json(CATEGORIES_FILE, categories)
            return CategoryResponse(**categories[i])
    
    raise HTTPException(status_code=404, detail="Category not found")

@app.delete("/api/categories/{category_id}")
async def delete_category(category_id: str, admin = Depends(get_current_admin)):
    categories = load_json(CATEGORIES_FILE)
    categories = [cat for cat in categories if cat["id"] != category_id]
    save_json(CATEGORIES_FILE, categories)
    return {"message": "Category deleted"}

# Products
@app.get("/api/products", response_model=List[ProductResponse])
async def get_products():
    products = load_json(PRODUCTS_FILE)
    active_products = [p for p in products if p.get("active", True)]
    return [ProductResponse(**prod) for prod in active_products]

@app.get("/api/products/all", response_model=List[ProductResponse])
async def get_all_products(admin = Depends(get_current_admin)):
    products = load_json(PRODUCTS_FILE)
    return [ProductResponse(**prod) for prod in products]

@app.post("/api/products", response_model=ProductResponse)
async def create_product(product: ProductCreate, admin = Depends(get_current_admin)):
    products = load_json(PRODUCTS_FILE)
    
    product_id = str(uuid.uuid4())
    product_doc = {
        "id": product_id,
        **product.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    products.append(product_doc)
    save_json(PRODUCTS_FILE, products)
    
    return ProductResponse(**product_doc)

@app.put("/api/products/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, product: ProductCreate, admin = Depends(get_current_admin)):
    products = load_json(PRODUCTS_FILE)
    
    for i, prod in enumerate(products):
        if prod["id"] == product_id:
            products[i].update(product.model_dump())
            save_json(PRODUCTS_FILE, products)
            return ProductResponse(**products[i])
    
    raise HTTPException(status_code=404, detail="Product not found")

@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str, admin = Depends(get_current_admin)):
    products = load_json(PRODUCTS_FILE)
    products = [prod for prod in products if prod["id"] != product_id]
    save_json(PRODUCTS_FILE, products)
    return {"message": "Product deleted"}

# Orders (simplified)
@app.get("/api/orders")
async def get_orders(admin = Depends(get_current_admin)):
    orders = load_json(ORDERS_FILE)
    return orders

@app.put("/api/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str, admin = Depends(get_current_admin)):
    orders = load_json(ORDERS_FILE)
    
    for i, order in enumerate(orders):
        if order["id"] == order_id:
            orders[i]["status"] = status
            save_json(ORDERS_FILE, orders)
            return {"message": "Status updated", "status": status}
    
    raise HTTPException(status_code=404, detail="Order not found")

# Contact Messages
@app.get("/api/contact", response_model=List[ContactResponse])
async def get_contact_messages(admin = Depends(get_current_admin)):
    messages = load_json(MESSAGES_FILE)
    return [ContactResponse(**msg) for msg in messages]

@app.post("/api/contact", response_model=ContactResponse)
async def create_contact_message(message: ContactMessage):
    messages = load_json(MESSAGES_FILE)
    
    message_id = str(uuid.uuid4())
    message_doc = {
        "id": message_id,
        **message.model_dump(),
        "read": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    messages.append(message_doc)
    save_json(MESSAGES_FILE, messages)
    
    return ContactResponse(**message_doc)

@app.put("/api/contact/{message_id}/read")
async def mark_message_read(message_id: str, admin = Depends(get_current_admin)):
    messages = load_json(MESSAGES_FILE)
    
    for i, msg in enumerate(messages):
        if msg["id"] == message_id:
            messages[i]["read"] = True
            save_json(MESSAGES_FILE, messages)
            return {"message": "Marked as read"}
    
    raise HTTPException(status_code=404, detail="Message not found")

@app.delete("/api/contact/{message_id}")
async def delete_contact_message(message_id: str, admin = Depends(get_current_admin)):
    messages = load_json(MESSAGES_FILE)
    messages = [msg for msg in messages if msg["id"] != message_id]
    save_json(MESSAGES_FILE, messages)
    return {"message": "Message deleted"}

# Stats
@app.get("/api/stats")
async def get_stats(admin = Depends(get_current_admin)):
    products = load_json(PRODUCTS_FILE)
    categories = load_json(CATEGORIES_FILE)
    orders = load_json(ORDERS_FILE)
    messages = load_json(MESSAGES_FILE)
    
    return {
        "total_products": len(products),
        "total_categories": len(categories),
        "total_orders": len(orders),
        "pending_orders": len([o for o in orders if o.get("status") == "pending"]),
        "unread_messages": len([m for m in messages if not m.get("read", False)])
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Pulgax 3D Store API (Simple JSON Storage)")
    print("📁 Data will be stored in JSON files in the 'data' folder")
    print("🌐 API will be available at: http://localhost:8000")
    print("📚 API documentation at: http://localhost:8000/docs")
    uvicorn.run("server_simple:app", host="0.0.0.0", port=8000, reload=True)