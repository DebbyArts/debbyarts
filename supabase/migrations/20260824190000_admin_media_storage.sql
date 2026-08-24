-- Supabase Auth and Storage infrastructure only. Prisma remains the sole
-- migration authority for application tables.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'catalogue-media',
  'catalogue-media',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- There are deliberately no authenticated-role write policies. Catalogue
-- mutations use a server-only privileged client only after requireAdmin has
-- verified the sole configured owner. The public bucket remains read-only to
-- browser clients, so a separately authenticated Supabase user cannot upload,
-- replace, or delete catalogue objects through the Storage API.
drop policy if exists "catalogue media owner insert" on storage.objects;
drop policy if exists "catalogue media owner update" on storage.objects;
drop policy if exists "catalogue media owner delete" on storage.objects;
