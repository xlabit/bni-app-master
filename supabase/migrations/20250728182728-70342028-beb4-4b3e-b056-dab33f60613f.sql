-- Add keywords field to deals table
ALTER TABLE public.deals 
ADD COLUMN keywords text;

-- Add is_premium_deal field to deals table
ALTER TABLE public.deals 
ADD COLUMN is_premium_deal boolean NOT NULL DEFAULT false;

-- Add keywords field to members table
ALTER TABLE public.members 
ADD COLUMN keywords text;