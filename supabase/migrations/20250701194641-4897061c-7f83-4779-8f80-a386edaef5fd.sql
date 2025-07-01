
-- Add image fields to the deals table
ALTER TABLE public.deals 
ADD COLUMN logo_image_url TEXT,
ADD COLUMN banner_image_url TEXT;

-- Create storage bucket for deal images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'deal-images', 
  'deal-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create policy to allow public read access to deal images
CREATE POLICY "Public read access for deal images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'deal-images');

-- Create policy to allow authenticated users to upload deal images
CREATE POLICY "Authenticated users can upload deal images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'deal-images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update deal images
CREATE POLICY "Authenticated users can update deal images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'deal-images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete deal images
CREATE POLICY "Authenticated users can delete deal images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'deal-images' AND auth.role() = 'authenticated');
