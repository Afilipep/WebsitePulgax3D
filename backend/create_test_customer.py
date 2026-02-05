#!/usr/bin/env python3
"""
Create a test customer for development/testing
"""

import json
import bcrypt
import uuid
from datetime import datetime, timezone
from pathlib import Path

def create_test_customer():
    customers_file = Path("data/customers.json")
    
    # Load existing customers
    if customers_file.exists():
        with open(customers_file, 'r', encoding='utf-8') as f:
            customers = json.load(f)
    else:
        customers = []
    
    # Check if test customer already exists
    test_email = "customer@test.com"
    if any(c["email"] == test_email for c in customers):
        print(f"✅ Test customer {test_email} already exists")
        return
    
    # Create test customer
    test_password = "test123"
    hashed_password = bcrypt.hashpw(test_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    test_customer = {
        "id": str(uuid.uuid4()),
        "email": test_email,
        "password": hashed_password,
        "name": "Test Customer",
        "phone": "912345678",
        "address": {
            "street": "Rua de Teste, 123",
            "city": "Lisboa",
            "postal_code": "1000-001",
            "country": "Portugal"
        },
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    customers.append(test_customer)
    
    # Save customers
    with open(customers_file, 'w', encoding='utf-8') as f:
        json.dump(customers, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Created test customer:")
    print(f"   Email: {test_email}")
    print(f"   Password: {test_password}")
    print(f"   ID: {test_customer['id']}")

if __name__ == "__main__":
    create_test_customer()