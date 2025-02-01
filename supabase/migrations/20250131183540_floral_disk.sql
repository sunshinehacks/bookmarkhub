/*
  # Add Storage Policies for Avatar Uploads

  1. Security
    - Enable storage policies for avatar uploads
    - Allow authenticated users to upload their own avatars
    - Allow public access to view avatars
*/

-- Create policy to allow authenticated users to upload avatars
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow authenticated users to update their avatars
CREATE POLICY "Allow authenticated users to update avatars"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow authenticated users to delete their avatars
CREATE POLICY "Allow authenticated users to delete avatars"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow public access to avatars
CREATE POLICY "Allow public to view avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');