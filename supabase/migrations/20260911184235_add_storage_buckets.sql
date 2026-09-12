-- ============================================================================
-- Storage buckets + policies, mirrored from production (crelands VPS).
-- Buckets and storage.objects RLS policies are NOT captured by `supabase db
-- dump` since `storage` is a Supabase-managed schema — this migration exists
-- specifically to close that gap so local matches prod going forward.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. BUCKETS
-- Both public, no file_size_limit or allowed_mime_types restrictions,
-- matching prod exactly.
-- ----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('public-assets', 'public-assets', true, NULL, NULL),
  ('product-files', 'product-files', true, NULL, NULL)
ON CONFLICT (id) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 2. STORAGE POLICIES
-- Mirrors the 8 policies present on the VPS: insert/select/update/delete
-- for each of the two buckets, all scoped to the `authenticated` role.
-- Note: SELECT is gated to `authenticated` only, even though both buckets
-- are public=true — this matches prod's existing (intentional-looking)
-- setup and is preserved as-is rather than opened up to `anon`.
-- ----------------------------------------------------------------------------

-- public-assets
CREATE POLICY "Allow authenticated uploads"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'public-assets');

CREATE POLICY "Allow authenticated reads"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'public-assets');

CREATE POLICY "Allow authenticated updates"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'public-assets' AND auth.uid() = owner);

CREATE POLICY "Allow authenticated deletes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'public-assets' AND auth.uid() = owner);

-- product-files
CREATE POLICY "Allow authenticated uploads for product files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-files');

CREATE POLICY "Allow authenticated reads for product files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'product-files');

CREATE POLICY "Allow authenticated updates for product files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-files' AND auth.uid() = owner);

CREATE POLICY "Allow authenticated deletes for product files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-files' AND auth.uid() = owner);