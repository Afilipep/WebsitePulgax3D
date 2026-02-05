#!/usr/bin/env python3
"""
Test authentication endpoints
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_customer_login():
    print("🧪 Testing customer login...")
    
    # Test login with test customer
    login_data = {
        "email": "customer@test.com",
        "password": "test123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/customer/login", json=login_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Customer login successful!")
            print(f"Customer: {data.get('customer', {}).get('name')}")
            print(f"Token: {data.get('access_token', '')[:20]}...")
            return data.get('access_token')
        else:
            print(f"❌ Customer login failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_admin_login():
    print("\n🧪 Testing admin login...")
    
    # Test login with admin
    login_data = {
        "email": "admin@pulgax.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/admin/login", json=login_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Admin login successful!")
            print(f"Admin: {data.get('admin', {}).get('name')}")
            print(f"Token: {data.get('access_token', '')[:20]}...")
            return data.get('access_token')
        else:
            print(f"❌ Admin login failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_products_api():
    print("\n🧪 Testing products API...")
    
    try:
        response = requests.get(f"{BASE_URL}/products")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            products = response.json()
            print(f"✅ Products API successful! Found {len(products)} products")
            
            if products:
                first_product = products[0]
                print(f"First product: {first_product.get('name_pt')} - €{first_product.get('base_price')}")
                
                # Test individual product
                product_id = first_product.get('id')
                if product_id:
                    detail_response = requests.get(f"{BASE_URL}/products/{product_id}")
                    if detail_response.status_code == 200:
                        print(f"✅ Product detail API successful!")
                    else:
                        print(f"❌ Product detail failed: {detail_response.status_code}")
            
            return True
        else:
            print(f"❌ Products API failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_customer_orders(token):
    print("\n🧪 Testing customer orders API...")
    
    if not token:
        print("❌ No customer token available")
        return False
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/customer/orders", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            orders = response.json()
            print(f"✅ Customer orders API successful! Found {len(orders)} orders")
            return True
        else:
            print(f"❌ Customer orders failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Pulgax 3D Store API")
    print("=" * 50)
    
    # Test customer login
    customer_token = test_customer_login()
    
    # Test admin login
    admin_token = test_admin_login()
    
    # Test products API
    test_products_api()
    
    # Test customer orders
    test_customer_orders(customer_token)
    
    print("\n" + "=" * 50)
    print("🏁 Tests completed!")