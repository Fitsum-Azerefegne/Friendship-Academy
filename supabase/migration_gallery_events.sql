-- ============================================================================
-- Gallery Events (albums) migration
-- Run this in the Supabase SQL Editor. Safe to run even if you already ran
-- schema.sql — every statement is idempotent.
-- Adds: "year E.C. + Amharic event name" albums that group gallery photos,
-- so the public Gallery page can show event cards that pop open a photo set.
-- ============================================================================

create table if not exists gallery_events (
  id uuid primary key default gen_random_uuid(),
  year_ec text not null,
  title_am text not null,
  title_en text,
  category text,
  created_at timestamptz default now()
);

alter table gallery add column if not exists event_id uuid references gallery_events(id) on delete set null;

alter table gallery_events enable row level security;

drop policy if exists "gallery_events_public_read" on gallery_events;
create policy "gallery_events_public_read" on gallery_events for select using (true);

drop policy if exists "gallery_events_admin_insert" on gallery_events;
create policy "gallery_events_admin_insert" on gallery_events for insert with check (auth.role() = 'authenticated');

drop policy if exists "gallery_events_admin_update" on gallery_events;
create policy "gallery_events_admin_update" on gallery_events for update using (auth.role() = 'authenticated');

drop policy if exists "gallery_events_admin_delete" on gallery_events;
create policy "gallery_events_admin_delete" on gallery_events for delete using (auth.role() = 'authenticated');

-- ============================================================================
-- Done. Create albums from the admin Gallery Manager, or seed a few here:
--
-- insert into gallery_events (year_ec, title_am, title_en, category) values
--   ('2017', 'የወላጆች ቀን', 'Parent-Teacher Conference Day', 'Events');
-- ============================================================================
