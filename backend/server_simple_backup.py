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
from email_service import send_order_status_email, send_order_confirmation_email
from validation import validate_product_data, validate_order_data, validate_category_references

# Configuration
JWT_SECRET = "pulgax-3d-store-secret-key-2024-very-secure-long-key-for-jwt-tokens"
JWT_ALGORITHM = "HS256"
# ============== HELPER FUNCTIONS ==============
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

# Data files
ADMINS_FILE = DATA_DIR / "admins.json"
CUSTOMERS_FILE = DATA_DIR / "customers.json"
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

class CustomerTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    customer: CustomerResponse

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

class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = ""
    address: Optional[Dict[str, str]] = {}

class CustomerLogin(BaseModel):
    email: EmailStr
    password: str

class CustomerResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    address: Dict[str, str]
    created_at: str

class CustomerAddressUpdate(BaseModel):
    street: str
    city: str
    postal_code: str
    country: str = "Portugal"

class GoogleAuthRequest(BaseModel):
    credential: str

class ContactMessage(BaseModel):
    name: str
    email: str
    phone: str
    subject: str
    message: str

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    shipping_address: str
    notes: Optional[str] = ""
    payment_method: str
    payment_details: Dict[str, Any] = {}
    total_amount: float
    customer_id: Optional[str] = None
    items: List[Dict[str, Any]]

class OrderResponse(BaseModel):
    id: str
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    shipping_address: str
    notes: str
    payment_method: str
    total_amount: float
    status: str
    items: List[Dict[str, Any]]
    created_at: str

class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    subject: str
    message: str
    read: bool
    created_at: str

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
    
    # Check if email already exists
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

# Customer Auth
@app.post("/api/customer/register", response_model=CustomerTokenResponse)
async def register_customer(customer: CustomerCreate):
    customers = load_json(CUSTOMERS_FILE)
    
    # Check if email already exists
    if any(c["email"] == customer.email for c in customers):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    customer_id = str(uuid.uuid4())
    customer_doc = {
        "id": customer_id,
        "email": customer.email,
        "password": hash_password(customer.password),
        "name": customer.name,
        "phone": customer.phone,
        "address": customer.address or {},
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    customers.append(customer_doc)
    save_json(CUSTOMERS_FILE, customers)
    
    token = create_token(customer_id)
    customer_response = CustomerResponse(
        id=customer_id,
        email=customer.email,
        name=customer.name,
        phone=customer.phone,
        address=customer.address or {},
        created_at=customer_doc["created_at"]
    )
    return CustomerTokenResponse(access_token=token, customer=customer_response)

@app.post("/api/customer/login", response_model=CustomerTokenResponse)
async def login_customer(credentials: CustomerLogin):
    customers = load_json(CUSTOMERS_FILE)
    customer = next((c for c in customers if c["email"] == credentials.email), None)
    
    if not customer or not verify_password(credentials.password, customer["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(customer["id"])
    customer_response = CustomerResponse(
        id=customer["id"],
        email=customer["email"],
        name=customer["name"],
        phone=customer["phone"],
        address=customer.get("address", {}),
        created_at=customer["created_at"]
    )
    return CustomerTokenResponse(access_token=token, customer=customer_response)

@app.post("/api/customer/google", response_model=CustomerTokenResponse)
async def google_auth(auth_request: GoogleAuthRequest):
    """
    Google OAuth authentication endpoint.
    In production, this would verify the Google JWT token.
    For development/testing, it creates a demo user.
    """
    customers = load_json(CUSTOMERS_FILE)
    
    try:
        # In production, you would verify the Google JWT token here:
        # from google.oauth2 import id_token
        # from google.auth.transport import requests
        # 
        # idinfo = id_token.verify_oauth2_token(
        #     auth_request.credential, 
        #     requests.Request(), 
        #     "YOUR_GOOGLE_CLIENT_ID"
        # )
        # 
        # google_user_id = idinfo['sub']
        # email = idinfo['email']
        # name = idinfo['name']
        
        # For demo/development purposes:
        google_user_id = "demo_google_user_123"
        email = "demo.google@gmail.com"
        name = "Demo Google User"
        
        # Check if customer already exists by Google ID or email
        customer = next((c for c in customers if 
                        c.get("google_id") == google_user_id or 
                        c.get("email") == email), None)
        
        if not customer:
            # Create new customer from Google account
            customer_id = str(uuid.uuid4())
            customer_doc = {
                "id": customer_id,
                "email": email,
                "password": hash_password("google_oauth_" + google_user_id),  # Placeholder
                "name": name,
                "phone": "",
                "address": {},
                "google_id": google_user_id,
                "auth_provider": "google",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            customers.append(customer_doc)
            save_json(CUSTOMERS_FILE, customers)
            customer = customer_doc
        else:
            # Update existing customer with Google ID if not set
            if not customer.get("google_id"):
                for i, c in enumerate(customers):
                    if c["id"] == customer["id"]:
                        customers[i]["google_id"] = google_user_id
                        customers[i]["auth_provider"] = "google"
                        save_json(CUSTOMERS_FILE, customers)
                        customer = customers[i]
                        break
        
        token = create_token(customer["id"])
        customer_response = CustomerResponse(
            id=customer["id"],
            email=customer["email"],
            name=customer["name"],
            phone=customer.get("phone", ""),
            address=customer.get("address", {}),
            created_at=customer["created_at"]
        )
        return CustomerTokenResponse(access_token=token, customer=customer_response)
        
    except Exception as e:
        # In production, log the actual error
        raise HTTPException(status_code=400, detail="Invalid Google credential")

# Customer Profile Management
@app.get("/api/customer/profile", response_model=CustomerResponse)
async def get_customer_profile(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        customer_id = payload.get("sub")
        
        customers = load_json(CUSTOMERS_FILE)
        customer = next((c for c in customers if c["id"] == customer_id), None)
        
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        
        return CustomerResponse(
            id=customer["id"],
            email=customer["email"],
            name=customer["name"],
            phone=customer.get("phone", ""),
            address=customer.get("address", {}),
            created_at=customer["created_at"]
        )
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.put("/api/customer/address", response_model=CustomerResponse)
async def update_customer_address(address: CustomerAddressUpdate, credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        customer_id = payload.get("sub")
        
        customers = load_json(CUSTOMERS_FILE)
        
        for i, customer in enumerate(customers):
            if customer["id"] == customer_id:
                customers[i]["address"] = address.model_dump()
                save_json(CUSTOMERS_FILE, customers)
                
                return CustomerResponse(
                    id=customer["id"],
                    email=customer["email"],
                    name=customer["name"],
                    phone=customer.get("phone", ""),
                    address=address.model_dump(),
                    created_at=customer["created_at"]
                )
        
        raise HTTPException(status_code=404, detail="Customer not found")
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

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

@app.get("/api/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    products = load_json(PRODUCTS_FILE)
    product = next((p for p in products if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductResponse(**product)

@app.post("/api/products", response_model=ProductResponse)
async def create_product(product: ProductCreate, admin = Depends(get_current_admin)):
    products = load_json(PRODUCTS_FILE)
    categories = load_json(CATEGORIES_FILE)
    
    # Validate product data
    product_dict = product.model_dump()
    validation = validate_product_data(product_dict)
    if not validation['valid']:
        raise HTTPException(status_code=400, detail=f"Validation errors: {', '.join(validation['errors'])}")
    
    # Validate category exists
    if not any(cat['id'] == product.category_id for cat in categories):
        raise HTTPException(status_code=400, detail=f"Category {product.category_id} does not exist")
    
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
    categories = load_json(CATEGORIES_FILE)
    
    # Validate product data
    product_dict = product.model_dump()
    validation = validate_product_data(product_dict)
    if not validation['valid']:
        raise HTTPException(status_code=400, detail=f"Validation errors: {', '.join(validation['errors'])}")
    
    # Validate category exists
    if not any(cat['id'] == product.category_id for cat in categories):
        raise HTTPException(status_code=400, detail=f"Category {product.category_id} does not exist")
    
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

# Orders (enhanced with full details)
@app.get("/api/orders")
async def get_orders(admin = Depends(get_current_admin)):
    orders = load_json(ORDERS_FILE)
    return orders

@app.get("/api/customer/orders")
async def get_customer_orders(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        customer_id = payload.get("sub")
        
        orders = load_json(ORDERS_FILE)
        customer_orders = [order for order in orders if order.get("customer_id") == customer_id]
        
        # Sort by creation date (newest first)
        customer_orders.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        
        return customer_orders
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/api/orders", response_model=OrderResponse)
async def create_order(order: OrderCreate):
    orders = load_json(ORDERS_FILE)
    products = load_json(PRODUCTS_FILE)
    
    order_id = str(uuid.uuid4())
    order_number = f"PX{datetime.now().strftime('%Y%m%d')}{len(orders) + 1:03d}"
    
    # Validate and enrich order items with real product data
    validated_items = []
    subtotal = 0
    total_adjustments = 0
    
    for item in order.items:
        # Find the real product
        product = next((p for p in products if p["id"] == item.get("product_id")), None)
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item.get('product_id')} not found")
        
        # Calculate price adjustments
        size_adjustment = 0
        if item.get("selected_size"):
            size_obj = next((s for s in product.get("sizes", []) if s["name"] == item["selected_size"]), None)
            if size_obj:
                size_adjustment = size_obj.get("price_modifier", 0)
        
        customization_adjustment = 0
        if item.get("customizations"):
            for custom_name, custom_value in item["customizations"].items():
                if custom_value and custom_value.strip():  # Only count non-empty customizations
                    custom_opt = next((opt for opt in product.get("customization_options", []) if opt["name"] == custom_name), None)
                    if custom_opt:
                        customization_adjustment += custom_opt.get("price_modifier", 0)
        
        # Get product image (color image if available, otherwise main image)
        image_url = ""
        if item.get("selected_color"):
            color_obj = next((c for c in product.get("colors", []) if c["name"] == item["selected_color"]), None)
            if color_obj and color_obj.get("image_url"):
                image_url = color_obj["image_url"]
        
        if not image_url and product.get("images"):
            image_url = product["images"][0]
        
        # Create validated item
        validated_item = {
            "product_id": product["id"],
            "product_name": product["name_pt"],  # Use Portuguese name as default
            "quantity": item.get("quantity", 1),
            "unit_price": product["base_price"],
            "selected_color": item.get("selected_color"),
            "selected_size": item.get("selected_size"),
            "size_price_adjustment": size_adjustment,
            "customizations": item.get("customizations", {}),
            "image_url": image_url
        }
        
        validated_items.append(validated_item)
        
        # Calculate totals
        item_subtotal = product["base_price"] * validated_item["quantity"]
        item_adjustments = (size_adjustment + customization_adjustment) * validated_item["quantity"]
        
        subtotal += item_subtotal
        total_adjustments += item_adjustments
    
    total_amount = subtotal + total_adjustments
    
    # Process payment details securely (remove sensitive data for storage)
    safe_payment_details = {}
    if order.payment_method == 'mbway':
        safe_payment_details = {
            "method": "mbway",
            "phone_last_digits": order.payment_details.get("mbway_phone", "")[-3:] if order.payment_details.get("mbway_phone") else ""
        }
    elif order.payment_method == 'card':
        card_number = order.payment_details.get("card_number", "").replace(" ", "")
        safe_payment_details = {
            "method": "card",
            "card_last_digits": card_number[-4:] if len(card_number) >= 4 else "",
            "card_type": "Visa/Mastercard"  # In production, detect card type
        }
    elif order.payment_method == 'transfer':
        safe_payment_details = {
            "method": "transfer"
        }
    
    order_doc = {
        "id": order_id,
        "order_number": order_number,
        "customer_id": order.customer_id,
        "customer": {
            "name": order.customer_name,
            "email": order.customer_email,
            "phone": order.customer_phone
        },
        "shipping": {
            "address": order.shipping_address,
            "notes": order.notes
        },
        "payment": {
            "method": order.payment_method,
            "details": safe_payment_details,
            "status": "pending",
            "amount": total_amount
        },
        "items": validated_items,
        "totals": {
            "subtotal": subtotal,
            "adjustments": total_adjustments,
            "total": total_amount
        },
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    orders.append(order_doc)
    save_json(ORDERS_FILE, orders)
    
    # Send confirmation email
    try:
        send_order_confirmation_email(order_doc)
    except Exception as e:
        print(f"Failed to send confirmation email: {e}")
    
    return OrderResponse(
        id=order_id,
        order_number=order_number,
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_phone=order.customer_phone,
        shipping_address=order.shipping_address,
        notes=order.notes,
        payment_method=order.payment_method,
        total_amount=total_amount,
        status="pending",
        items=validated_items,
        created_at=order_doc["created_at"]
    )

@app.get("/api/orders/{order_id}")
async def get_order_details(order_id: str, admin = Depends(get_current_admin)):
    orders = load_json(ORDERS_FILE)
    order = next((o for o in orders if o["id"] == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.put("/api/orders/{order_id}/status")
async def update_order_status(order_id: str, status: str, note: str = "", admin = Depends(get_current_admin)):
    orders = load_json(ORDERS_FILE)
    
    for i, order in enumerate(orders):
        if order["id"] == order_id:
            old_status = order.get("status", "pending")
            orders[i]["status"] = status
            orders[i]["updated_at"] = datetime.now(timezone.utc).isoformat()
            
            # Add to status history
            if "status_history" not in orders[i]:
                orders[i]["status_history"] = []
            
            orders[i]["status_history"].insert(0, {
                "status": status,
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "note": note,
                "updated_by": admin["email"]
            })
            
            save_json(ORDERS_FILE, orders)
            
            # Send email notification if status changed
            if old_status != status:
                try:
                    send_order_status_email(orders[i], status, note)
                except Exception as e:
                    print(f"Failed to send status update email: {e}")
            
            return {"message": "Status updated", "status": status}
    
    raise HTTPException(status_code=404, detail="Order not found")

@app.post("/api/orders/{order_id}/refund")
async def process_refund(order_id: str, refund_data: dict, admin = Depends(get_current_admin)):
    orders = load_json(ORDERS_FILE)
    
    for i, order in enumerate(orders):
        if order["id"] == order_id:
            if order["status"] == "refunded":
                raise HTTPException(status_code=400, detail="Order already refunded")
            
            # Process refund
            refund_info = {
                "amount": refund_data.get("amount", order["totals"]["total"]),
                "reason": refund_data.get("reason", ""),
                "method": refund_data.get("method", order["payment"]["method"]),
                "processed_at": datetime.now(timezone.utc).isoformat(),
                "processed_by": admin["email"]
            }
            
            orders[i]["refund"] = refund_info
            orders[i]["status"] = "refunded"
            orders[i]["payment"]["status"] = "refunded"
            orders[i]["updated_at"] = datetime.now(timezone.utc).isoformat()
            
            save_json(ORDERS_FILE, orders)
            return {"message": "Refund processed successfully", "refund": refund_info}
    
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

# Data validation endpoint
@app.get("/api/validate")
async def validate_data(admin = Depends(get_current_admin)):
    """
    Validate data consistency across all entities
    """
    from validation import run_full_validation
    
    results = run_full_validation(Path("data"))
    
    if not results['valid']:
        return {
            "status": "error",
            "message": "Data validation failed",
            "errors": results['errors'],
            "warnings": results.get('warnings', [])
        }
    
    return {
        "status": "success",
        "message": "All data is valid and consistent",
        "errors": [],
        "warnings": results.get('warnings', [])
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Pulgax 3D Store API (Simple JSON Storage)")
    print("📁 Data will be stored in JSON files in the 'data' folder")
    print("🌐 API will be available at: http://localhost:8000")
    print("📚 API documentation at: http://localhost:8000/docs")
    uvicorn.run("server_simple:app", host="0.0.0.0", port=8000, reload=True)