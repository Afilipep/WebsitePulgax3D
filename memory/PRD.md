# Pulgax 3D Store - Product Requirements Document

## Original Problem Statement
Build a modern, professional e-commerce website for Pulgax 3D Store, a small business focused on 3D printing products and personalized items.

## User Personas
1. **Individual Customers**: Looking for unique 3D printed gifts
2. **Business Clients**: Seeking customized 3D-printed items for their companies
3. **Admin/Owner**: Managing products, categories, orders, and messages

## Core Requirements
- Bilingual website (Portuguese primary, English secondary)
- Light/Dark mode toggle
- E-commerce with shopping cart
- Product catalog with categories, colors, sizes, customization options
- Admin panel for CRUD operations
- Contact form with order management
- Payment methods display (MB Way, Vinted, Bank Transfer)
- Social media links integration

## What's Been Implemented (Feb 2025)
### Backend (FastAPI + MongoDB)
- Admin authentication (JWT-based)
- Categories CRUD endpoints
- Products CRUD with colors, sizes, customizations
- Orders management with status tracking
- Contact messages handling
- Stats dashboard API

### Frontend (React + Tailwind + Shadcn UI)
- Responsive landing page with Hero, About, Services, Process, Payment, Contact sections
- Product catalog with category filtering and search
- Product detail page with color/size/customization selection
- Shopping cart functionality
- Checkout page with order submission
- Admin login and dashboard
- Language toggle (PT/EN)
- Theme toggle (Light/Dark)

## Backlog (P0/P1/P2)
### P0 - Critical
- [x] Core e-commerce flow
- [x] Admin product management
- [x] Bilingual support

### P1 - Important
- [ ] Email notifications for orders
- [ ] Product image upload (currently using URLs)
- [ ] Order confirmation email to customer

### P2 - Nice to Have
- [ ] Product reviews
- [ ] Wishlist functionality
- [ ] Advanced product filtering
- [ ] Sales analytics dashboard

## Tech Stack
- Backend: FastAPI + MongoDB
- Frontend: React + Tailwind CSS + Shadcn UI
- Auth: JWT tokens
- State: React Context (Language, Theme, Cart, Auth)

## Social Links
- Instagram: https://www.instagram.com/pulgaxstore/
- TikTok: https://www.tiktok.com/@pulgaxstore
- Beacons: https://beacons.ai/pulgaxstore
