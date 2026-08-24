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

drop policy if exists "catalogue media owner insert" on storage.objects;
create policy "catalogue media owner insert"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'catalogue-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "catalogue media owner update" on storage.objects;
create policy "catalogue media owner update"
on storage.objects for update to authenticated
using (
  bucket_id = 'catalogue-media'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'catalogue-media'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "catalogue media owner delete" on storage.objects;
create policy "catalogue media owner delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'catalogue-media'
  and owner_id = (select auth.uid()::text)
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
