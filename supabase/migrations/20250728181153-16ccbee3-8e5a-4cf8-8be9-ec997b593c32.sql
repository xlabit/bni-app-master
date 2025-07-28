-- Create admin user account
-- Note: This creates the user directly in auth.users and profiles tables
-- Password: admin123 (hashed)

-- Insert into auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "System Administrator"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Get the user ID we just created
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@example.com';
    
    -- Insert corresponding profile
    INSERT INTO public.profiles (
        user_id,
        email,
        full_name,
        role
    ) VALUES (
        admin_user_id,
        'admin@example.com',
        'System Administrator',
        'admin'
    );
END $$;