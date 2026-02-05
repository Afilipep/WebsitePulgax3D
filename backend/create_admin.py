#!/usr/bin/env python3
import bcrypt
import json
from pathlib import Path
import os

# Change to backend directory
os.chdir('backend')

# Create admin with known password
password = "admin123"
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

admin_data = {
    "id": "admin-test-123",
    "email": "admin@pulgax.com",
    "password": hashed,
    "name": "Admin Pulgax",
    "created_at": "2026-02-04T01:50:48.384980+00:00"
}

# Update admins.json
admins_file = Path("data/admins.json")
admins = []
if admins_file.exists():
    with open(admins_file, 'r', encoding='utf-8') as f:
        admins = json.load(f)

# Replace existing admin or add new one
admins = [admin for admin in admins if admin["email"] != "admin@pulgax.com"]
admins.append(admin_data)

with open(admins_file, 'w', encoding='utf-8') as f:
    json.dump(admins, f, indent=2, ensure_ascii=False)

print(f"Admin created successfully!")
print(f"Email: admin@pulgax.com")
print(f"Password: admin123")