# Routes Checklist

This checklist tracks route implementation progress for the Haribon web app.

Legend:
- `[x]` Implemented
- `[ ]` Pending

---

## Current Route Status (from `routes/web.php`)

- [x] `GET /` (currently renders `Home`)

---

## Target Public Routes

- [ ] `GET /` -> `Public/HomePage`
- [ ] `GET /properties` -> `Public/PropertyBrowsePage`
- [ ] `GET /properties/search` -> `Public/PropertySearchPage`
- [ ] `GET /properties/{property}` -> `Public/PropertyDetailsPage`

---

## Target Auth Routes

- [ ] `GET /login` -> `Auth/LoginPage`
- [ ] `POST /login` -> login action
- [ ] `POST /logout` -> logout action
- [ ] `GET /register` -> `Auth/RegisterPage`
- [ ] `POST /register` -> register action

---

## Target Seller Routes

- [ ] `GET /seller/dashboard` -> `Seller/SellerDashboardPage`
- [ ] `GET /seller/properties` -> `Seller/PropertyListPage`
- [ ] `GET /seller/properties/create` -> `Seller/CreatePropertyPage`
- [ ] `POST /seller/properties` -> store property
- [ ] `GET /seller/properties/{property}/edit` -> `Seller/EditPropertyPage`
- [ ] `PUT /seller/properties/{property}` -> update property
- [ ] `DELETE /seller/properties/{property}` -> delete property
- [ ] `GET /seller/subscription` -> `Seller/SubscriptionOverviewPage`
- [ ] `GET /seller/subscription/plans` -> `Seller/SubscriptionPlansPage`
- [ ] `GET /seller/subscription/success` -> `Seller/SubscriptionSuccessPage`

---

## Target Buyer Routes

- [ ] `GET /buyer/favorites` -> `Buyer/FavoritePropertiesPage`

---

## Future Payment Routes (PayMongo, Final Phase)

- [ ] `POST /seller/subscription/checkout` -> create checkout session
- [ ] `GET /seller/subscription/callback` -> payment callback handler
- [ ] `POST /webhooks/paymongo` -> webhook endpoint

---

## Suggested Route Middleware Plan

- Public pages: no auth middleware
- Auth pages: guest middleware
- Seller pages: auth + role check (`seller`)
- Buyer favorites: auth + role check (`buyer` or mixed policy)
- Payment callback/webhook: signed/verified request validation

---

## Notes

- The current `/` route still points to `Home`; migrate it to `Public/HomePage` when that page is implemented.
- Keep route names consistent for Inertia links and future policy checks.
- Add validation and user-friendly alerts for create/update/delete flows.
