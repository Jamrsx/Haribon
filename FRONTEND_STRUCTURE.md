# Haribon Frontend Structure Guide

This document defines the purpose and expected behavior of each page and component in the system.

Stack:
- Laravel (backend)
- Inertia.js (routing bridge)
- React (frontend)

---

# 📄 PAGES

## 🌐 Public Pages

### HomePage.jsx
- Landing page
- Shows featured properties
- Basic search input
- CTA for sellers to list property

---

### PropertyBrowsePage.jsx
- Displays list/grid of all properties
- Supports pagination
- Basic filtering (price, size, etc.)

---

### PropertyDetailsPage.jsx
- Shows full property information:
  - Title
  - Description
  - Images
  - Lot size
  - Price per sqm
  - Contact number
- Displays map (pin or polygon)

---

### PropertySearchPage.jsx
- Advanced search page
- Includes:
  - Filters
  - Map-based search
- Can reuse PropertyCard component

---

## 🔐 Auth Pages

### LoginPage.jsx
- Email + password login form
- Handles authentication

---

### RegisterPage.jsx
- User registration
- Must include role selection:
  - Buyer
  - Seller

---

## 👤 Seller Pages

### SellerDashboardPage.jsx
- Overview page
- Shows:
  - Total listings
  - Subscription status
  - Quick actions (add property)

---

### PropertyListPage.jsx
- Lists all properties created by seller
- Actions:
  - Edit
  - Delete

---

### CreatePropertyPage.jsx
- Form to create a property
- Uses:
  - PropertyForm
  - PropertyImagesUpload
  - MapPicker / PolygonDrawingTool

---

### EditPropertyPage.jsx
- Same as CreatePropertyPage
- Pre-filled with existing data

---

### SubscriptionOverviewPage.jsx
- Shows current subscription
- Status (active / expired)
- Expiration date

---

### SubscriptionPlansPage.jsx
- Lists available plans
- Uses SubscriptionPlanCard
- Button to trigger payment (PayMongo)

---

### SubscriptionSuccessPage.jsx
- Shown after successful payment
- Confirms upgrade
- Redirect to dashboard

---

## 👤 Buyer Pages

### FavoritePropertiesPage.jsx
- Displays saved properties (optional feature)

---

# 🧩 COMPONENTS

## 🎨 UI Components

### Button.jsx
- Reusable button
- Supports variants (primary, secondary)

---

### Input.jsx
- Reusable input field
- Supports validation display

---

### Modal.jsx
- Popup container
- Used for confirmations or forms

---

## 🧱 Layout Components

### MainLayout.jsx
- Used for public pages
- Includes:
  - Navbar
  - Footer

---

### AuthLayout.jsx
- Used for login/register
- Minimal layout

---

### DashboardLayout.jsx
- Used for seller pages
- Includes:
  - Sidebar
  - Header

---

## 🏡 Property Components

### PropertyCard.jsx
- Displays property preview:
  - Image
  - Title
  - Price
- Used in listings

---

### PropertyForm.jsx
- Main form logic for property
- Handles:
  - Title
  - Description
  - Price
  - Lot size
  - Contact number

---

### PropertyImagesUpload.jsx
- Handles multiple image uploads
- Preview images before saving

---

### PropertyMapView.jsx
- Displays property location
- Supports:
  - Marker
  - Polygon rendering

---

## 🗺️ Map Components

### MapPicker.jsx
- Allows user to select a location
- Returns lat/lng

---

### PolygonDrawingTool.jsx
- Allows drawing area on map
- Returns polygon coordinates

---

## 💳 Subscription Components

### SubscriptionPlanCard.jsx
- Displays plan details:
  - Price
  - Duration
  - Features
- Button to select plan

---

# 📁 OTHER DIRECTORIES

## Hooks/
- Custom React hooks
- Example:
  - useAuth
  - useMap

---

## Utils/
- Helper functions
- Example:
  - formatPrice
  - calculateSubscriptionStatus

---

# 🧠 DEVELOPMENT NOTES

- Keep components reusable
- Keep pages thin (logic inside components)
- Use Inertia for page routing
- Avoid mixing UI and business logic

---

# 🚀 FUTURE EXTENSIONS

- Chat system
- Admin panel
- Analytics dashboard
- Property verification system

---