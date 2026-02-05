"""
Validation utilities to ensure data consistency between admin and frontend
"""
import json
from pathlib import Path
from typing import List, Dict, Any

def validate_product_data(product: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate and normalize product data to ensure consistency
    """
    errors = []
    
    # Required fields
    required_fields = ['name_pt', 'name_en', 'description_pt', 'description_en', 'base_price', 'category_id']
    for field in required_fields:
        if not product.get(field):
            errors.append(f"Missing required field: {field}")
    
    # Validate price
    if product.get('base_price') and product['base_price'] < 0:
        errors.append("Base price cannot be negative")
    
    # Validate colors
    if product.get('colors'):
        for i, color in enumerate(product['colors']):
            if not color.get('name'):
                errors.append(f"Color {i} missing name")
            if not color.get('hex_code') or not color['hex_code'].startswith('#'):
                errors.append(f"Color {i} invalid hex code")
    
    # Validate sizes
    if product.get('sizes'):
        for i, size in enumerate(product['sizes']):
            if not size.get('name'):
                errors.append(f"Size {i} missing name")
            if size.get('price_modifier') and size['price_modifier'] < 0:
                errors.append(f"Size {i} price modifier cannot be negative")
    
    # Validate customization options
    if product.get('customization_options'):
        for i, opt in enumerate(product['customization_options']):
            if not opt.get('name'):
                errors.append(f"Customization option {i} missing name")
            if opt.get('price_modifier') and opt['price_modifier'] < 0:
                errors.append(f"Customization option {i} price modifier cannot be negative")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'product': product
    }

def validate_order_data(order: Dict[str, Any], products: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Validate order data against existing products
    """
    errors = []
    
    # Validate items
    if not order.get('items'):
        errors.append("Order must have at least one item")
    else:
        for i, item in enumerate(order['items']):
            product_id = item.get('product_id')
            if not product_id:
                errors.append(f"Item {i} missing product_id")
                continue
            
            # Find product
            product = next((p for p in products if p['id'] == product_id), None)
            if not product:
                errors.append(f"Item {i} references non-existent product: {product_id}")
                continue
            
            # Validate color
            if item.get('selected_color'):
                color_exists = any(c['name'] == item['selected_color'] for c in product.get('colors', []))
                if not color_exists:
                    errors.append(f"Item {i} references non-existent color: {item['selected_color']}")
            
            # Validate size
            if item.get('selected_size'):
                size_exists = any(s['name'] == item['selected_size'] for s in product.get('sizes', []))
                if not size_exists:
                    errors.append(f"Item {i} references non-existent size: {item['selected_size']}")
            
            # Validate customizations
            if item.get('customizations'):
                for custom_name in item['customizations'].keys():
                    custom_exists = any(opt['name'] == custom_name for opt in product.get('customization_options', []))
                    if not custom_exists:
                        errors.append(f"Item {i} references non-existent customization: {custom_name}")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'order': order
    }

def validate_category_references(products: List[Dict[str, Any]], categories: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Validate that all product category references exist
    """
    errors = []
    category_ids = {cat['id'] for cat in categories}
    
    for product in products:
        if product.get('category_id') and product['category_id'] not in category_ids:
            errors.append(f"Product {product.get('id', 'unknown')} references non-existent category: {product['category_id']}")
    
    return {
        'valid': len(errors) == 0,
        'errors': errors
    }

def run_full_validation(data_dir: Path = Path("data")) -> Dict[str, Any]:
    """
    Run full validation on all data files
    """
    results = {
        'valid': True,
        'errors': [],
        'warnings': []
    }
    
    try:
        # Load data
        with open(data_dir / "products.json", 'r', encoding='utf-8') as f:
            products = json.load(f)
        
        with open(data_dir / "categories.json", 'r', encoding='utf-8') as f:
            categories = json.load(f)
        
        with open(data_dir / "orders.json", 'r', encoding='utf-8') as f:
            orders = json.load(f)
        
        # Validate products
        for product in products:
            validation = validate_product_data(product)
            if not validation['valid']:
                results['errors'].extend([f"Product {product.get('id', 'unknown')}: {error}" for error in validation['errors']])
        
        # Validate category references
        cat_validation = validate_category_references(products, categories)
        if not cat_validation['valid']:
            results['errors'].extend(cat_validation['errors'])
        
        # Validate orders
        for order in orders:
            order_validation = validate_order_data(order, products)
            if not order_validation['valid']:
                results['errors'].extend([f"Order {order.get('order_number', 'unknown')}: {error}" for error in order_validation['errors']])
        
        results['valid'] = len(results['errors']) == 0
        
    except Exception as e:
        results['valid'] = False
        results['errors'].append(f"Validation failed: {str(e)}")
    
    return results

if __name__ == "__main__":
    # Run validation
    results = run_full_validation()
    
    if results['valid']:
        print("✅ All data is valid and consistent!")
    else:
        print("❌ Validation errors found:")
        for error in results['errors']:
            print(f"  - {error}")
    
    if results['warnings']:
        print("⚠️ Warnings:")
        for warning in results['warnings']:
            print(f"  - {warning}")