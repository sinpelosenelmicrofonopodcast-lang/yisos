# YISOS CIGARS

A premium, cinematic, full-stack Next.js 15 commerce flagship for a luxury cigar brand.

## Stack
- Next.js 15 App Router
- React + TypeScript
- Tailwind CSS + shadcn-style UI primitives
- Framer Motion + lucide-react
- Supabase (Auth, Postgres, Storage-ready)
- Stripe Checkout (Apple Pay / Google Pay / promotion codes)
- OneSignal web push
- Resend transactional email
- PostHog analytics
- Vercel deployment + cron support

## Core Features
- Cinematic luxury homepage with 21+ age gate overlay
- Full catalog and premium product detail pages
- Shop filtering: category, strength, flavor notes, wrapper, price, sort, search
- Favorites (wishlist), cart drawer, full cart page, promo code handling
- Checkout pipeline with Stripe session generation + manual local payment fallback
- Order confirmation route and webhook-based order recording
- Account area: profile overview, orders, favorites, notification preferences
- Admin dashboard: products, orders, customers, push campaigns, analytics snapshot
- Push subscription capture + campaign send endpoint
- Newsletter capture + welcome email
- Abandoned cart recovery (cron route + script)
- Full metadata, Open Graph/Twitter support, schema, sitemap, robots

## Routes
- `/`
- `/shop`
- `/shop/[slug]`
- `/about`
- `/membership`
- `/gift-cards`
- `/contact`
- `/events`
- `/cart`
- `/checkout`
- `/order-confirmation`
- `/account`
- `/account/orders`
- `/account/favorites`
- `/account/notifications`
- `/admin`
- `/admin/products`
- `/admin/orders`
- `/admin/customers`
- `/admin/notifications`
- `/admin/analytics`

## API Routes
- `POST /api/newsletter`
- `POST /api/push-subscriptions`
- `POST /api/promo-codes/apply`
- `POST /api/shipping/quote`
- `POST /api/cart-sessions`
- `POST /api/favorites/sync`
- `POST /api/checkout/manual`
- `POST /api/stripe/checkout`
- `POST /api/stripe/webhook`
- `POST /api/account/preferences`
- `POST /api/admin/notifications/send`
- `POST /api/resend/test`
- `GET /api/cron/abandoned-cart`

## Database
- Migration: `supabase/migrations/20260312000100_init.sql`
- Includes required tables: `profiles`, `products`, `product_images`, `categories`, `product_categories`, `inventory`, `orders`, `order_items`, `cart_sessions`, `favorites`, `reviews`, `addresses`, `gift_cards`, `promo_codes`, `newsletter_subscribers`, `push_subscribers`, `events`, `memberships`, `admin_logs`, `site_settings`
- Includes RLS policies and admin helper function `public.is_admin()`

## Local Setup
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Copy environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Configure all keys in `.env.local`.
4. Run Supabase migration in your project.
5. Seed demo data:
   ```bash
   pnpm seed
   ```
6. Start development server:
   ```bash
   pnpm dev
   ```

## Supabase Integration
1. Create a Supabase project.
2. Put these values into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Run the migration at [20260312000100_init.sql](/Users/gabriel/Yisos Cigars/supabase/migrations/20260312000100_init.sql).
4. Create the storage bucket `product-images`.
5. Seed the database:
   ```bash
   pnpm seed
   ```
6. Verify the connection:
   ```bash
   pnpm check:supabase
   ```
7. HTTP health check:
   - `GET /api/health/supabase`

## Auth Flow
- Magic-link auth now completes through `/auth/callback`.
- Add these redirect URLs in Supabase Auth:
  - `http://localhost:3000/auth/callback`
  - your production callback URL

## Stripe Setup
1. Add Stripe keys to env.
2. Configure webhook to `POST /api/stripe/webhook`.
3. Enable wallets/payment methods in Stripe Dashboard (card, Apple Pay, Google Pay, PayPal where available).
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain.

## USPS Shipping Setup
1. Add USPS API credentials to env:
   - `USPS_CLIENT_ID`
   - `USPS_CLIENT_SECRET`
   - `USPS_ORIGIN_ZIP`
   - `USPS_ACCOUNT_TYPE`
   - `USPS_ACCOUNT_NUMBER`
2. Optional package defaults:
   - `USPS_DEFAULT_ITEM_WEIGHT_OZ`
   - `USPS_PACKAGING_WEIGHT_OZ`
   - `USPS_PACKAGE_LENGTH_IN`
   - `USPS_PACKAGE_WIDTH_IN`
   - `USPS_PACKAGE_HEIGHT_IN`
   - `USPS_PACKAGE_HEIGHT_PER_ITEM_IN`
   - `USPS_HANDLING_FEE`
   - `FREE_SHIPPING_THRESHOLD`
3. Checkout will validate US addresses with `Addresses 3.0` and quote rates with `Prices 3.0`.
4. The app currently uses package defaults plus cart quantity for USPS rating. If you need per-product shipping precision, add weight/dimension fields to the catalog next.

## OneSignal Setup
1. Add OneSignal app keys to env.
2. Keep `public/OneSignalSDKWorker.js` deployed at the root.
3. Use `/admin/notifications` to trigger push campaigns.

## Resend Setup
1. Add `RESEND_API_KEY` and a verified sender in `RESEND_FROM_EMAIL`.
2. Newsletter subscription triggers welcome email.
3. Stripe webhook sends order confirmation emails.

## Abandoned Cart Recovery
- Cron endpoint is configured in `vercel.json` to run every 6 hours.
- Manual run script:
  ```bash
  pnpm recover-carts
  ```

## Deploy (Vercel)
1. Push repository to GitHub.
2. Import project in Vercel.
3. Set all environment variables.
4. Ensure cron + webhook URLs point to production domain.
5. Run migration + seed against production Supabase.

## Notes
- Admin area is protected by profile role (`role = 'admin'`).
- Route-level admin checks happen in `app/admin/layout.tsx`.
- API admin actions validate role via Supabase profile lookup.
