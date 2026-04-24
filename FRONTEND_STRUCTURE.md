# Haribon Frontend Structure Guide (Updated)

This document reflects the current project status and the agreed target structure.

Stack:
- Laravel 13
- Inertia.js (Laravel adapter v3)
- React (via `@inertiajs/react`)
- Tailwind CSS v4 + Vite

---

# Current Status Snapshot

Implemented now:
- Inertia root view is configured in `resources/views/app.blade.php`
- Inertia middleware is configured in `app/Http/Middleware/HandleInertiaRequests.php`
- React entry is `resources/js/app.jsx`
- Vite is configured for React + Tailwind in `vite.config.js`
- Current default route in `routes/web.php` points to an Inertia page

In progress / placeholders:
- Most page files under `resources/js/Pages/**` exist but are empty
- Route mapping for the complete page tree is not yet implemented
- Shared layouts and reusable UI/components are not yet implemented

---

# Route-to-Page Plan (Target)

## Public
- `/` -> `Public/HomePage`
- `/properties` -> `Public/PropertyBrowsePage`
- `/properties/search` -> `Public/PropertySearchPage`
- `/properties/{property}` -> `Public/PropertyDetailsPage`

## Auth
- `/login` -> `Auth/LoginPage`
- `/register` -> `Auth/RegisterPage`

## Seller
- `/seller/dashboard` -> `Seller/SellerDashboardPage`
- `/seller/properties` -> `Seller/PropertyListPage`
- `/seller/properties/create` -> `Seller/CreatePropertyPage`
- `/seller/properties/{property}/edit` -> `Seller/EditPropertyPage`
- `/seller/subscription` -> `Seller/SubscriptionOverviewPage`
- `/seller/subscription/plans` -> `Seller/SubscriptionPlansPage`
- `/seller/subscription/success` -> `Seller/SubscriptionSuccessPage`

## Buyer (optional account-based feature)
- `/buyer/favorites` -> `Buyer/FavoritePropertiesPage`

---

# Pages and Responsibilities

## Public Pages

### `Public/HomePage.jsx`
- Landing page
- Featured properties
- Basic search CTA
- Seller CTA ("List your property")

### `Public/PropertyBrowsePage.jsx`
- Property list/grid
- Pagination
- Basic filters (price, lot area, location)

### `Public/PropertyDetailsPage.jsx`
- Full property details
- Image gallery
- Location marker and lot polygon preview map
- Seller contact info

### `Public/PropertySearchPage.jsx`
- Advanced search + map-based search
- Filter panel + map viewport interactions

## Auth Pages

### `Auth/LoginPage.jsx`
- Email + password login
- Error and validation feedback

### `Auth/RegisterPage.jsx`
- Registration with explicit role selection (Buyer / Seller)
- Phone, email, password confirmation

## Seller Pages

### `Seller/SellerDashboardPage.jsx`
- Total listings
- Subscription status
- Quick actions

### `Seller/PropertyListPage.jsx`
- Seller-owned properties
- Edit/delete actions
- Status badge (active/inactive)

### `Seller/CreatePropertyPage.jsx`
- Property creation form
- Image upload
- Map location picker
- Polygon drawing for lot boundary

### `Seller/EditPropertyPage.jsx`
- Same form as create page, prefilled values
- Update location/polygon/images

### `Seller/SubscriptionOverviewPage.jsx`
- Active/expired status
- Current plan and expiration

### `Seller/SubscriptionPlansPage.jsx`
- List available plans
- Trigger payment checkout (PayMongo in final phase)

### `Seller/SubscriptionSuccessPage.jsx`
- Payment success confirmation
- Redirect action to dashboard/subscription page

## Buyer Pages

### `Buyer/FavoritePropertiesPage.jsx`
- Saved properties list (optional, account-based)

---

# Shared Data Contract (Property + Map)

Use these field names consistently across frontend forms, Inertia props, validation, and DB:

- `location_lat` (number)
- `location_lng` (number)
- `lot_polygon` (array of `{ lat, lng }`)
- `lot_area_sqm` (number, nullable)
- `price_total` (number)
- `price_per_sqm` (number)

Notes:
- `lot_polygon` is nullable when seller only provides a marker.
- `lot_area_sqm` can be manual or computed from polygon.

---

# Components to Implement

## Layouts
- `Layouts/MainLayout.jsx` (public pages)
- `Layouts/AuthLayout.jsx` (login/register)
- `Layouts/DashboardLayout.jsx` (seller pages)

## Reusable UI
- `Components/UI/Button.jsx`
- `Components/UI/Input.jsx`
- `Components/UI/Modal.jsx`

Modal rule:
- Use this class on modal overlay:
  - `bg-clear bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50`

## Property
- `Components/Property/PropertyCard.jsx`
- `Components/Property/PropertyForm.jsx`
- `Components/Property/PropertyImagesUpload.jsx`
- `Components/Property/PropertyMapView.jsx`

## Map
- `Components/Map/MapPicker.jsx`
- `Components/Map/PolygonDrawingTool.jsx`

## Subscription
- `Components/Subscription/SubscriptionPlanCard.jsx`

---

# Suggested Directory Structure

`resources/js/`
- `Pages/Public/*`
- `Pages/Auth/*`
- `Pages/Seller/*`
- `Pages/Buyer/*`
- `Components/UI/*`
- `Components/Layouts/*`
- `Components/Property/*`
- `Components/Map/*`
- `Components/Subscription/*`
- `Hooks/*`
- `Utils/*`
- `Types/property.js` (or `Types/property.ts` later)

---

# Development Notes

- Keep pages thin; move reusable UI/business blocks to components/hooks.
- Keep naming consistent with route and page responsibility.
- Add validation messages and user alerts where needed.
- Keep console logs during development for testing visibility.
- Build mobile-responsive UI first and preserve accessibility.
- Use Inertia page routing; avoid direct Blade page rendering for app pages.

---

# Future Extensions

- PayMongo membership checkout flow (6-month and 1-year plans)
- Chat between buyer and seller
- Admin moderation and verification workflow
- Property analytics dashboard

---