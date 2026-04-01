-- User profiles table
-- Created automatically on first sign-in via trigger
create table if not exists public.user_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Users can read and update their own profile
create policy "users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

create policy "users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.handle_updated_at();
