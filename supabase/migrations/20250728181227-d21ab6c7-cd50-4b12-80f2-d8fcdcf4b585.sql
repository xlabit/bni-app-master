-- Let's first clean up any orphaned profiles and create a proper admin user
-- Delete any orphaned profiles
DELETE FROM public.profiles WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Create admin user using Supabase's proper signup flow simulation
-- Since we can't directly insert into auth.users, let's create the profile entry
-- The user will be created through the app's signup flow

-- First, let's ensure we have a clean slate
DELETE FROM public.profiles WHERE email = 'admin@demo.com';

-- Insert admin profile (the auth user will be created via signup)
INSERT INTO public.profiles (
    user_id,
    email,
    full_name,
    role
) VALUES (
    gen_random_uuid(), -- temporary UUID, will be updated when actual user signs up
    'admin@demo.com',
    'System Administrator',
    'admin'
) 
ON CONFLICT (user_id) DO NOTHING;