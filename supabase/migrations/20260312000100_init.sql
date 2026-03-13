create extension if not exists pgcrypto;
create extension if not exists citext;

create type app_role as enum ('customer', 'admin');
create type review_status as enum ('pending', 'approved', 'rejected');
create type membership_status as enum ('active', 'paused', 'canceled');
create type order_payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type order_fulfillment_status as enum ('pending_review', 'processing', 'shipped', 'delivered', 'canceled');
create type promo_discount_type as enum ('percent', 'fixed');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext,
  full_name text,
  role app_role not null default 'customer',
  membership_tier text,
  marketing_opt_in boolean not null default true,
  order_updates_opt_in boolean not null default true,
  push_opt_in boolean not null default false,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  sku text not null unique,
  description text not null,
  price numeric(10,2) not null check (price >= 0),
  sale_price numeric(10,2) check (sale_price is null or sale_price >= 0),
  origin text not null,
  size text not null,
  wrapper text not null,
  binder text not null,
  filler text not null,
  strength text not null,
  tasting_notes text[] not null default '{}',
  pairing_suggestions text[] not null default '{}',
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  badges text[] not null default '{}',
  featured boolean not null default false,
  new_arrival boolean not null default false,
  best_seller boolean not null default false,
  limited_edition boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_product_images_updated_at
before update on public.product_images
for each row
execute function public.set_updated_at();

create table if not exists public.product_categories (
  product_id text not null references public.products(id) on delete cascade,
  category_id text not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (product_id, category_id)
);

create trigger set_product_categories_updated_at
before update on public.product_categories
for each row
execute function public.set_updated_at();

create table if not exists public.inventory (
  product_id text primary key references public.products(id) on delete cascade,
  stock integer not null default 0 check (stock >= 0),
  reorder_threshold integer not null default 10,
  backorder_allowed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_inventory_updated_at
before update on public.inventory
for each row
execute function public.set_updated_at();

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  order_number text not null unique,
  stripe_session_id text unique,
  customer_email citext,
  payment_method text,
  payment_status order_payment_status not null default 'pending',
  fulfillment_status order_fulfillment_status not null default 'pending_review',
  subtotal numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  shipping numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  currency text not null default 'USD',
  shipping_address jsonb,
  billing_address jsonb,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_order_items_updated_at
before update on public.order_items
for each row
execute function public.set_updated_at();

create table if not exists public.cart_sessions (
  id text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  cart_data jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  recovered_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_cart_sessions_updated_at
before update on public.cart_sessions
for each row
execute function public.set_updated_at();

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, product_id)
);

create trigger set_favorites_updated_at
before update on public.favorites
for each row
execute function public.set_updated_at();

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  status review_status not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_reviews_updated_at
before update on public.reviews
for each row
execute function public.set_updated_at();

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text,
  first_name text not null,
  last_name text not null,
  company text,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null,
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_addresses_updated_at
before update on public.addresses
for each row
execute function public.set_updated_at();

create table if not exists public.gift_cards (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  initial_amount numeric(10,2) not null check (initial_amount >= 0),
  balance numeric(10,2) not null check (balance >= 0),
  issued_to_email citext,
  purchased_by_user_id uuid references public.profiles(id) on delete set null,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_gift_cards_updated_at
before update on public.gift_cards
for each row
execute function public.set_updated_at();

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type promo_discount_type not null,
  discount_value numeric(10,2) not null,
  minimum_subtotal numeric(10,2) not null default 0,
  usage_limit integer,
  usage_count integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_promo_codes_updated_at
before update on public.promo_codes
for each row
execute function public.set_updated_at();

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  status text not null default 'subscribed',
  source text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_newsletter_subscribers_updated_at
before update on public.newsletter_subscribers
for each row
execute function public.set_updated_at();

create table if not exists public.push_subscribers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  one_signal_subscription_id text not null unique,
  status text not null default 'subscribed',
  segment text,
  last_seen_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_push_subscribers_updated_at
before update on public.push_subscribers
for each row
execute function public.set_updated_at();

create table if not exists public.events (
  id text primary key,
  title text not null,
  slug text not null unique,
  description text not null,
  date timestamptz not null,
  location text not null,
  capacity integer not null check (capacity > 0),
  ticket_price numeric(10,2) not null default 0,
  featured_image text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_events_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tier text not null,
  status membership_status not null default 'active',
  started_at timestamptz not null default timezone('utc', now()),
  ends_at timestamptz,
  auto_renew boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_memberships_updated_at
before update on public.memberships
for each row
execute function public.set_updated_at();

create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  status text not null default 'success',
  payload jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_admin_logs_updated_at
before update on public.admin_logs
for each row
execute function public.set_updated_at();

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

create index if not exists idx_products_slug on public.products (slug);
create index if not exists idx_products_featured on public.products (featured) where featured = true;
create index if not exists idx_product_images_product on public.product_images (product_id, sort_order);
create index if not exists idx_product_categories_category on public.product_categories (category_id);
create index if not exists idx_orders_user on public.orders (user_id);
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_order_items_order on public.order_items (order_id);
create index if not exists idx_favorites_user on public.favorites (user_id);
create index if not exists idx_reviews_product_status on public.reviews (product_id, status);
create index if not exists idx_addresses_user on public.addresses (user_id);
create index if not exists idx_newsletter_email on public.newsletter_subscribers (email);
create index if not exists idx_push_subscribers_user on public.push_subscribers (user_id);
create index if not exists idx_events_date on public.events (date);
create index if not exists idx_memberships_user on public.memberships (user_id);
create index if not exists idx_cart_sessions_updated on public.cart_sessions (updated_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_categories enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.cart_sessions enable row level security;
alter table public.favorites enable row level security;
alter table public.reviews enable row level security;
alter table public.addresses enable row level security;
alter table public.gift_cards enable row level security;
alter table public.promo_codes enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.push_subscribers enable row level security;
alter table public.events enable row level security;
alter table public.memberships enable row level security;
alter table public.admin_logs enable row level security;
alter table public.site_settings enable row level security;

create policy "Profiles are viewable by owner"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

create policy "Profiles are updatable by owner"
on public.profiles for update
using (id = auth.uid() or public.is_admin());

create policy "Categories are readable by all"
on public.categories for select
using (true);

create policy "Products are readable by all"
on public.products for select
using (is_active = true or public.is_admin());

create policy "Product images are readable by all"
on public.product_images for select
using (true);

create policy "Product categories are readable by all"
on public.product_categories for select
using (true);

create policy "Inventory is readable by all"
on public.inventory for select
using (true);

create policy "Orders are readable by owner"
on public.orders for select
using (user_id = auth.uid() or public.is_admin());

create policy "Orders are insertable by owner"
on public.orders for insert
with check (user_id = auth.uid() or public.is_admin());

create policy "Orders are updatable by admin"
on public.orders for update
using (public.is_admin());

create policy "Order items readable by order owner"
on public.order_items for select
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

create policy "Order items insert by admin"
on public.order_items for insert
with check (public.is_admin());

create policy "Favorites owned by user"
on public.favorites for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "Reviews readable when approved"
on public.reviews for select
using (status = 'approved' or user_id = auth.uid() or public.is_admin());

create policy "Reviews insert by user"
on public.reviews for insert
with check (user_id = auth.uid());

create policy "Reviews update by admin"
on public.reviews for update
using (public.is_admin());

create policy "Addresses owned by user"
on public.addresses for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "Gift cards admin only"
on public.gift_cards for all
using (public.is_admin())
with check (public.is_admin());

create policy "Promo codes read all"
on public.promo_codes for select
using (active = true or public.is_admin());

create policy "Promo codes admin manage"
on public.promo_codes for all
using (public.is_admin())
with check (public.is_admin());

create policy "Newsletter admin manage"
on public.newsletter_subscribers for all
using (public.is_admin())
with check (public.is_admin());

create policy "Push subscribers user read own"
on public.push_subscribers for select
using (user_id = auth.uid() or public.is_admin());

create policy "Push subscribers insert all"
on public.push_subscribers for insert
with check (true);

create policy "Push subscribers update own"
on public.push_subscribers for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "Events are readable by all"
on public.events for select
using (true);

create policy "Events admin manage"
on public.events for all
using (public.is_admin())
with check (public.is_admin());

create policy "Memberships owned by user"
on public.memberships for select
using (user_id = auth.uid() or public.is_admin());

create policy "Memberships admin manage"
on public.memberships for all
using (public.is_admin())
with check (public.is_admin());

create policy "Site settings read all"
on public.site_settings for select
using (true);

create policy "Site settings admin manage"
on public.site_settings for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admin logs admin only"
on public.admin_logs for all
using (public.is_admin())
with check (public.is_admin());

create policy "Cart sessions admin manage"
on public.cart_sessions for all
using (public.is_admin())
with check (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
