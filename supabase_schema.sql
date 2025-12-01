
-- Enable Row Level Security
alter default privileges revoke execute on functions from public;

-- 1. PROFILES TABLE
-- Holds public user information (synced with Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  phone text unique,
  avatar_url text
);

-- Turn on RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 2. TRANSACTIONS TABLE
-- Stores cloud-synced loans
create type transaction_status as enum ('PENDING', 'ACTIVE', 'SETTLED_PENDING', 'SETTLED', 'REJECTED');

create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  lender_id uuid references public.profiles(id) not null,
  borrower_id uuid references public.profiles(id) not null,
  amount numeric not null,
  note text,
  status transaction_status default 'PENDING',
  created_by uuid references public.profiles(id) not null
);

-- Turn on RLS
alter table public.transactions enable row level security;

-- Policies
create policy "Users can see transactions they are involved in"
  on transactions for select
  using ( auth.uid() = lender_id or auth.uid() = borrower_id );

create policy "Users can create transactions"
  on transactions for insert
  with check ( auth.uid() = created_by );

create policy "Users can update transactions they are involved in"
  on transactions for update
  using ( auth.uid() = lender_id or auth.uid() = borrower_id );

-- 3. HANDLE NEW USER SIGNUP
-- Automatically create a profile entry when a new user signs up via Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.phone);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
