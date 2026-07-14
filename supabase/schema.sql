-- ============================================================================
-- Friendship Academy website — Supabase setup
-- Run this once in your Supabase project: SQL Editor -> New query -> paste
-- this whole file -> Run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------------------

-- One row holds all homepage/about copy.
create table if not exists content (
  id int primary key default 1,
  school_name text,
  tagline text,
  hero_image text,
  stats_students int,
  stats_teachers int,
  stats_years_open int,
  mission text,
  vision text,
  history text,
  principal_name text,
  principal_title text,
  principal_photo text,
  principal_message text,
  address text,
  phone text,
  email text,
  social_facebook text,
  social_instagram text,
  social_twitter text,
  social_youtube text,
  map_embed_url text,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  body text,
  image text,
  category text,
  author text,
  date date not null default current_date,
  created_at timestamptz default now()
);

create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  department text,
  email text,
  photo text,
  created_at timestamptz default now()
);

create table if not exists gallery_events (
  id uuid primary key default gen_random_uuid(),
  year_ec text not null,
  title_am text not null,
  title_en text,
  category text,
  created_at timestamptz default now()
);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image text not null,
  category text,
  caption text,
  event_id uuid references gallery_events(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text,
  read boolean default false,
  created_at timestamptz default now()
);

-- Seed the content row so the homepage isn't empty on first load.
insert into content (id, school_name, tagline, hero_image, stats_students, stats_teachers, stats_years_open,
  mission, vision, history, principal_name, principal_title, principal_photo, principal_message,
  address, phone, email, social_facebook, social_instagram, social_twitter, social_youtube, map_embed_url)
values (
  1, 'Friendship Academy', 'Where Curiosity Becomes Character',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600&auto=format&fit=crop',
  1240, 86, 47,
  'To cultivate confident, principled learners who question deeply, act with integrity, and contribute meaningfully to their communities.',
  'A school where every student is known, challenged, and prepared to lead a purposeful life beyond our gates.',
  'Founded in 1979 by a small group of educators who believed rigorous academics and genuine kindness were not in tension, Friendship Academy began with 62 students in a single converted farmhouse.',
  'Dr. Eleanor Marsh', 'Principal',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
  'Every September, I remind our new families of the same thing: we are not in the business of producing a single kind of student.',
  '48 Cathedral Road, Riverside District, Lyford, LY4 2QP', '+1 (555) 213-4470', 'office@friendshipacademy.edu',
  'https://facebook.com', 'https://instagram.com', 'https://twitter.com', 'https://youtube.com',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2485.7!2d-0.1278!3d51.5074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDMwJzI2LjciTiAwwrAwNyc0MC4xIlc!5e0!3m2!1sen!2suk!4v1600000000000'
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 2. ROW LEVEL SECURITY
-- Public visitors can READ site content. Only signed-in admins can
-- create/edit/delete. The contact form allows anonymous INSERT only.
-- ---------------------------------------------------------------------------

alter table content  enable row level security;
alter table news     enable row level security;
alter table staff    enable row level security;
alter table gallery  enable row level security;
alter table messages enable row level security;

-- content: public read, admin write
create policy "content_public_read" on content for select using (true);
create policy "content_admin_write" on content for insert with check (auth.role() = 'authenticated');
create policy "content_admin_update" on content for update using (auth.role() = 'authenticated');

-- news: public read, admin write
create policy "news_public_read"   on news for select using (true);
create policy "news_admin_insert"  on news for insert with check (auth.role() = 'authenticated');
create policy "news_admin_update"  on news for update using (auth.role() = 'authenticated');
create policy "news_admin_delete"  on news for delete using (auth.role() = 'authenticated');

-- staff: public read, admin write
create policy "staff_public_read"  on staff for select using (true);
create policy "staff_admin_insert" on staff for insert with check (auth.role() = 'authenticated');
create policy "staff_admin_update" on staff for update using (auth.role() = 'authenticated');
create policy "staff_admin_delete" on staff for delete using (auth.role() = 'authenticated');

-- gallery: public read, admin write
create policy "gallery_public_read"  on gallery for select using (true);
create policy "gallery_admin_insert" on gallery for insert with check (auth.role() = 'authenticated');
create policy "gallery_admin_delete" on gallery for delete using (auth.role() = 'authenticated');

-- gallery_events (albums): public read, admin write
alter table gallery_events enable row level security;
create policy "gallery_events_public_read"  on gallery_events for select using (true);
create policy "gallery_events_admin_insert" on gallery_events for insert with check (auth.role() = 'authenticated');
create policy "gallery_events_admin_update" on gallery_events for update using (auth.role() = 'authenticated');
create policy "gallery_events_admin_delete" on gallery_events for delete using (auth.role() = 'authenticated');

-- messages: anyone can submit the contact form; only admins can read/manage them
create policy "messages_public_insert" on messages for insert with check (true);
create policy "messages_admin_read"    on messages for select using (auth.role() = 'authenticated');
create policy "messages_admin_update"  on messages for update using (auth.role() = 'authenticated');
create policy "messages_admin_delete"  on messages for delete using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- 3. STORAGE (hero image, news covers, staff photos, gallery uploads)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

create policy "media_admin_upload" on storage.objects
  for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "media_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and auth.role() = 'authenticated');

-- ============================================================================
-- Done. Next step: create your admin login in
-- Authentication -> Users -> Add user (see README for details).
-- ============================================================================
