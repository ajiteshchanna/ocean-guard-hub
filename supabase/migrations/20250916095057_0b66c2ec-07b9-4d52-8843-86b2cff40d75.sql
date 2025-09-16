-- Add missing columns to reports table
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS media_files TEXT[],
ADD COLUMN IF NOT EXISTS reporter_email TEXT;

-- Create storage bucket for report media files
INSERT INTO storage.buckets (id, name, public) VALUES ('report-media', 'report-media', true);

-- Create policies for report media uploads
CREATE POLICY "Users can view report media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'report-media');

CREATE POLICY "Authenticated users can upload report media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'report-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their report media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'report-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their report media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'report-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for reports table
ALTER TABLE public.reports REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;