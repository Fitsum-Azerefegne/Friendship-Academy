-- Add grade and phone columns to staff table
alter table staff add column if not exists grade text;
alter table staff add column if not exists phone text;
