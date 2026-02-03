-- Enable various extensions
create extension if not exists "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
-- drop table if exists transactions;
-- drop table if exists budget_items;
-- drop table if exists financial_obligations;

-- 1. Financial Obligations (Master List)
create type obligation_type as enum ('credit_card', 'loan', 'recurring_expense');

create table financial_obligations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  type obligation_type not null,
  due_day integer check (due_day >= 1 and due_day <= 31),
  cut_off_day integer check (cut_off_day >= 1 and cut_off_day <= 31), -- Optional
  current_balance numeric default 0, -- For cards/loans
  fixed_payment_amount numeric default 0, -- For loans/recurring
  credit_limit numeric, -- Optional
  months_to_pay integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Budget Items (Monthly Plan)
create table budget_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  category_name text not null,
  projected_amount numeric default 0,
  executed_amount numeric default 0,
  period text not null, -- e.g., '2024-Feb'
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Transactions (The Ledger)
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  amount numeric not null,
  description text,
  category text, -- Can link to budget_items category_name or be free text
  payment_method text, -- 'cash', 'debit', or financial_obligations.id (as text or UUID)
  date date default CURRENT_DATE,
  source text default 'App', -- 'App', 'Telegram'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Realtime
alter publication supabase_realtime add table transactions;
alter publication supabase_realtime add table financial_obligations;

-- Row Level Security (RLS)
alter table financial_obligations enable row level security;
alter table budget_items enable row level security;
alter table transactions enable row level security;

-- Policies (Simple: Users can only see/edit their own data)
create policy "Users can view their own obligations" on financial_obligations
  for select using (auth.uid() = user_id);
create policy "Users can insert their own obligations" on financial_obligations
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own obligations" on financial_obligations
  for update using (auth.uid() = user_id);

create policy "Users can view their own budget" on budget_items
  for select using (auth.uid() = user_id);
create policy "Users can insert their own budget" on budget_items
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own budget" on budget_items
  for update using (auth.uid() = user_id);

create policy "Users can view their own transactions" on transactions
  for select using (auth.uid() = user_id);
create policy "Users can insert their own transactions" on transactions
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own transactions" on transactions
  for update using (auth.uid() = user_id);
