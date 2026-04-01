-- Add streak + icon columns to user_profiles
alter table public.user_profiles
  add column if not exists match_streak           int not null default 0,
  add column if not exists match_streak_last_date date,
  add column if not exists mine_streak            int not null default 0,
  add column if not exists mine_streak_last_date  date,
  add column if not exists unlocked_icons         text[] not null default '{}',
  add column if not exists active_icon            text not null default 'default';

-- Game sessions
create table if not exists public.game_sessions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references auth.users(id) on delete cascade not null,
  mode              text not null check (mode in ('standard', 'mine', 'all-countries')),
  card_mode         text not null,  -- 'name-capital' | 'flag-name' | 'flag-capital'
  pairs_matched     int not null default 0,
  wrong_guesses     int not null default 0,
  duration_seconds  int,
  completed         boolean not null default false,
  played_at         timestamptz not null default now()
);

alter table public.game_sessions enable row level security;

create policy "users can view own sessions"
  on public.game_sessions for select
  using (auth.uid() = user_id);

create policy "users can insert own sessions"
  on public.game_sessions for insert
  with check (auth.uid() = user_id);
