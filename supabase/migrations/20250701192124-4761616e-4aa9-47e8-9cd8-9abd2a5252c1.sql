
-- Create enum types for better data integrity
CREATE TYPE member_role AS ENUM ('regular', 'leadership', 'ro', 'green', 'gold');
CREATE TYPE status_type AS ENUM ('active', 'inactive');
CREATE TYPE discount_type AS ENUM ('flat', 'percentage');

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status status_type NOT NULL DEFAULT 'active',
  member_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create members table
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  business_name TEXT NOT NULL,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
  chapter_name TEXT NOT NULL,
  member_role member_role NOT NULL DEFAULT 'regular',
  membership_end_date DATE NOT NULL,
  status status_type NOT NULL DEFAULT 'active',
  profile_image TEXT,
  join_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deals table
CREATE TABLE public.deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  discount_type discount_type NOT NULL DEFAULT 'percentage',
  discount_value DECIMAL(10,2) NOT NULL,
  special_role_discount BOOLEAN DEFAULT FALSE,
  special_discount_type discount_type,
  special_discount_value DECIMAL(10,2),
  category TEXT NOT NULL,
  status status_type NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create forms table
CREATE TABLE public.forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  submissions INTEGER NOT NULL DEFAULT 0,
  status status_type NOT NULL DEFAULT 'active',
  public_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_members_chapter_id ON public.members(chapter_id);
CREATE INDEX idx_members_email ON public.members(email);
CREATE INDEX idx_members_status ON public.members(status);
CREATE INDEX idx_deals_member_id ON public.deals(member_id);
CREATE INDEX idx_deals_status ON public.deals(status);
CREATE INDEX idx_deals_end_date ON public.deals(end_date);
CREATE INDEX idx_chapters_status ON public.chapters(status);
CREATE INDEX idx_forms_status ON public.forms(status);

-- Create function to update member count in chapters
CREATE OR REPLACE FUNCTION update_chapter_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.chapters 
    SET member_count = member_count + 1,
        updated_at = now()
    WHERE id = NEW.chapter_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.chapters 
    SET member_count = member_count - 1,
        updated_at = now()
    WHERE id = OLD.chapter_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.chapter_id != NEW.chapter_id THEN
      UPDATE public.chapters 
      SET member_count = member_count - 1,
          updated_at = now()
      WHERE id = OLD.chapter_id;
      
      UPDATE public.chapters 
      SET member_count = member_count + 1,
          updated_at = now()
      WHERE id = NEW.chapter_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update member counts
CREATE TRIGGER trigger_update_chapter_member_count
  AFTER INSERT OR UPDATE OR DELETE ON public.members
  FOR EACH ROW EXECUTE FUNCTION update_chapter_member_count();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update updated_at timestamps
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON public.chapters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON public.forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.chapters (name, status, member_count) VALUES
('Downtown Business Network', 'active', 0),
('Tech Entrepreneurs Hub', 'active', 0),
('Healthcare Professionals', 'active', 0),
('Real Estate Professionals', 'inactive', 0);

INSERT INTO public.members (name, email, phone, business_name, chapter_name, member_role, membership_end_date, status) VALUES
('John Smith', 'john.smith@example.com', '+1-555-0101', 'Smith & Associates', 'Downtown Business Network', 'leadership', '2024-12-31', 'active'),
('Sarah Johnson', 'sarah.johnson@example.com', '+1-555-0102', 'Johnson Tech Solutions', 'Tech Entrepreneurs Hub', 'regular', '2024-11-30', 'active'),
('Michael Brown', 'michael.brown@example.com', '+1-555-0103', 'Brown Medical Center', 'Healthcare Professionals', 'ro', '2024-10-15', 'active'),
('Emily Davis', 'emily.davis@example.com', '+1-555-0104', 'Davis Real Estate', 'Real Estate Professionals', 'gold', '2025-03-31', 'inactive');

INSERT INTO public.deals (deal_name, short_description, long_description, member_name, start_date, end_date, discount_type, discount_value, category, status) VALUES
('Business Consultation Special', '20% off business consulting services', 'Get expert business consultation at a discounted rate for BNI members', 'John Smith', '2024-01-01', '2024-12-31', 'percentage', 20, 'Services', 'active'),
('Tech Support Package', '$50 off monthly tech support', 'Comprehensive tech support package with priority service for BNI members', 'Sarah Johnson', '2024-02-01', '2024-11-30', 'flat', 50, 'Technology', 'active'),
('Health Screening Discount', '15% off annual health screenings', 'Complete health screening package at reduced rates', 'Michael Brown', '2024-03-01', '2024-10-31', 'percentage', 15, 'Healthcare', 'active'),
('Property Valuation Deal', '$100 off property valuation', 'Professional property valuation services at discounted rates', 'Emily Davis', '2024-01-15', '2024-06-15', 'flat', 100, 'Real Estate', 'inactive');

INSERT INTO public.forms (title, description, submissions, status, public_url) VALUES
('Deal Submission Form', 'Form for members to submit new deal requests', 24, 'active', 'https://example.com/forms/deal-submission'),
('Member Registration Form', 'Form for new member registration requests', 12, 'active', 'https://example.com/forms/member-registration'),
('Chapter Feedback Form', 'Form for collecting chapter meeting feedback', 8, 'inactive', 'https://example.com/forms/chapter-feedback');
