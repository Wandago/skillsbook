-- Skillsbook core schema.
-- Accounts are either an individual or a business; both own listings.

create extension if not exists "pgcrypto";

create type account_type as enum ('individual', 'business');
create type listing_status as enum ('draft', 'live', 'unclaimed', 'archived');

create table categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  accent      text not null default 'pink',
  sort_order  int  not null default 0
);

create table profiles (
  id            uuid primary key references auth.users on delete cascade,
  account_type  account_type not null default 'individual',
  display_name  text not null,
  -- business accounts trade under a registered name and carry a contact person
  legal_name    text,
  contact_name  text,
  headline      text,
  bio           text,
  phone         text,
  area          text,
  city          text not null default 'Nairobi',
  avatar_url    text,
  verified_at   timestamptz,
  created_at    timestamptz not null default now(),
  constraint business_needs_legal_name
    check (account_type <> 'business' or legal_name is not null)
);

create table listings (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid references profiles on delete cascade,
  category_id   uuid not null references categories on delete restrict,
  title         text not null,
  description   text,
  price_amount  int,
  price_unit    text default 'day',
  currency      text not null default 'KES',
  area          text,
  city          text not null default 'Nairobi',
  status        listing_status not null default 'draft',
  -- unclaimed listings are seeded from public directories and have no owner yet
  claim_token   text unique,
  source        text,
  created_at    timestamptz not null default now(),
  constraint owned_unless_unclaimed
    check (status = 'unclaimed' or owner_id is not null)
);

create table portfolio_items (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references listings on delete cascade,
  storage_path text not null,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table conversations (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid references listings on delete set null,
  client_id   uuid not null references profiles on delete cascade,
  provider_id uuid not null references profiles on delete cascade,
  created_at  timestamptz not null default now(),
  unique (listing_id, client_id, provider_id)
);

create table messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations on delete cascade,
  sender_id       uuid not null references profiles on delete cascade,
  body            text not null,
  read_at         timestamptz,
  created_at      timestamptz not null default now()
);

create table reviews (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references listings on delete cascade,
  author_id   uuid not null references profiles on delete cascade,
  rating      int  not null check (rating between 1 and 5),
  body        text,
  created_at  timestamptz not null default now(),
  unique (listing_id, author_id)
);

create index on listings (category_id, status);
create index on listings (city, area);
create index on messages (conversation_id, created_at desc);
create index on portfolio_items (listing_id, sort_order);
create index on reviews (listing_id);

-- Row level security ------------------------------------------------------

alter table profiles        enable row level security;
alter table listings        enable row level security;
alter table portfolio_items enable row level security;
alter table conversations   enable row level security;
alter table messages        enable row level security;
alter table reviews         enable row level security;
alter table categories      enable row level security;

create policy "categories are public" on categories
  for select using (true);

create policy "profiles are public" on profiles
  for select using (true);
create policy "own profile is writable" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "live listings are public" on listings
  for select using (status in ('live', 'unclaimed') or owner_id = auth.uid());
create policy "own listings are writable" on listings
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "portfolio follows its listing" on portfolio_items
  for select using (
    exists (select 1 from listings l
            where l.id = listing_id
              and (l.status in ('live', 'unclaimed') or l.owner_id = auth.uid())));
create policy "own portfolio is writable" on portfolio_items
  for all using (
    exists (select 1 from listings l where l.id = listing_id and l.owner_id = auth.uid()))
  with check (
    exists (select 1 from listings l where l.id = listing_id and l.owner_id = auth.uid()));

create policy "participants read conversations" on conversations
  for select using (auth.uid() in (client_id, provider_id));
create policy "clients start conversations" on conversations
  for insert with check (auth.uid() = client_id);

create policy "participants read messages" on messages
  for select using (
    exists (select 1 from conversations c
            where c.id = conversation_id and auth.uid() in (c.client_id, c.provider_id)));
create policy "participants send messages" on messages
  for insert with check (
    auth.uid() = sender_id
    and exists (select 1 from conversations c
                where c.id = conversation_id and auth.uid() in (c.client_id, c.provider_id)));

create policy "reviews are public" on reviews
  for select using (true);
create policy "own reviews are writable" on reviews
  for all using (author_id = auth.uid()) with check (author_id = auth.uid());

-- New auth users get a profile row; the signup form supplies the metadata.
create function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, account_type, display_name, legal_name, contact_name, phone)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'account_type')::account_type, 'individual'),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'legal_name',
    new.raw_user_meta_data ->> 'contact_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
