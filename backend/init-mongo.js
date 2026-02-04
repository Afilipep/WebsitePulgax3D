// MongoDB initialization script for Pulgax 3D Store
db = db.getSiblingDB('pulgax_3d_store');

// Create collections
db.createCollection('admins');
db.createCollection('categories');
db.createCollection('products');
db.createCollection('orders');
db.createCollection('contact_messages');

// Create indexes for better performance
db.admins.createIndex({ "email": 1 }, { unique: true });
db.categories.createIndex({ "name_pt": 1 });
db.categories.createIndex({ "name_en": 1 });
db.products.createIndex({ "category_id": 1 });
db.products.createIndex({ "featured": 1 });
db.products.createIndex({ "active": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "created_at": -1 });
db.contact_messages.createIndex({ "read": 1 });
db.contact_messages.createIndex({ "created_at": -1 });

// Insert sample categories
db.categories.insertMany([
  {
    "id": "cat-1",
    "name_pt": "Decoração",
    "name_en": "Decoration",
    "description_pt": "Itens decorativos impressos em 3D para casa e escritório",
    "description_en": "3D printed decorative items for home and office",
    "image_url": "",
    "created_at": new Date().toISOString()
  },
  {
    "id": "cat-2", 
    "name_pt": "Utilitários",
    "name_en": "Utilities",
    "description_pt": "Objetos úteis para o dia a dia",
    "description_en": "Useful everyday objects",
    "image_url": "",
    "created_at": new Date().toISOString()
  },
  {
    "id": "cat-3",
    "name_pt": "Brinquedos",
    "name_en": "Toys", 
    "description_pt": "Brinquedos e jogos impressos em 3D",
    "description_en": "3D printed toys and games",
    "image_url": "",
    "created_at": new Date().toISOString()
  }
]);

// Insert sample products
db.products.insertMany([
  {
    "id": "prod-1",
    "name_pt": "Vaso Decorativo Moderno",
    "name_en": "Modern Decorative Vase",
    "description_pt": "Vaso decorativo moderno impresso em 3D com design elegante",
    "description_en": "Modern decorative vase 3D printed with elegant design",
    "base_price": 25.99,
    "category_id": "cat-1",
    "colors": [
      { "name_pt": "Branco", "name_en": "White", "hex_code": "#FFFFFF", "image_url": "" },
      { "name_pt": "Preto", "name_en": "Black", "hex_code": "#000000", "image_url": "" }
    ],
    "sizes": [
      { "name": "Pequeno", "price_adjustment": 0 },
      { "name": "Grande", "price_adjustment": 10 }
    ],
    "customization_options": [
      { "name_pt": "Gravação", "name_en": "Engraving", "type": "text", "required": false, "max_length": 50 }
    ],
    "images": [],
    "featured": true,
    "active": true,
    "created_at": new Date().toISOString()
  },
  {
    "id": "prod-2",
    "name_pt": "Suporte para Telemóvel",
    "name_en": "Phone Stand",
    "description_pt": "Suporte ajustável para telemóvel impresso em 3D",
    "description_en": "Adjustable phone stand 3D printed",
    "base_price": 12.50,
    "category_id": "cat-2",
    "colors": [],
    "sizes": [],
    "customization_options": [],
    "images": [],
    "featured": false,
    "active": true,
    "created_at": new Date().toISOString()
  }
]);

print('✅ Pulgax 3D Store database initialized successfully!');
print('📊 Sample categories and products created');
print('🔍 Indexes created for better performance');