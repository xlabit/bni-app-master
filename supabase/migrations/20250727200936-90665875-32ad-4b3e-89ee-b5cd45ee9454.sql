-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create admin-only policy for categories
CREATE POLICY "Only admins can access categories" ON public.categories
  FOR ALL USING (public.get_current_user_role() = 'admin');

-- Add index for better search performance
CREATE INDEX idx_categories_name ON public.categories USING GIN(to_tsvector('english', name));

-- Create trigger for updating categories timestamp
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default categories
INSERT INTO public.categories (name, description) VALUES
  ('Restaurant', 'Food and dining services'),
  ('Services', 'Professional and business services'),
  ('Retail', 'Retail and shopping'),
  ('Healthcare', 'Medical and healthcare services'),
  ('Education', 'Educational institutions and services'),
  ('Technology', 'Technology and IT services'),
  ('Other', 'Other categories');