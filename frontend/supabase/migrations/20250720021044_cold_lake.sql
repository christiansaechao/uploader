/*
  # Create Super Admin System

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `role` (text, admin level)
      - `created_at` (timestamp)
      - `created_by` (uuid, who created this admin)

  2. Security
    - Enable RLS on `admin_users` table
    - Add policy for admins to read admin data
    - Add policy for super admins to manage admin users

  3. Initial Data
    - Create super admin user with email: admin@markethub.com
    - Password: SuperAdmin123!
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view admin data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

-- Create super admin user
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Insert the admin user into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
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
    'admin@markethub.com',
    crypt('SuperAdmin123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (email) DO NOTHING
  RETURNING id INTO admin_user_id;

  -- If user was created, add to admin_users table
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO admin_users (user_id, role, created_by)
    VALUES (admin_user_id, 'super_admin', admin_user_id);
  ELSE
    -- If user already exists, get their ID and ensure they're a super admin
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@markethub.com';
    
    INSERT INTO admin_users (user_id, role, created_by)
    VALUES (admin_user_id, 'super_admin', admin_user_id)
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
  END IF;
END $$;

-- Create view for easy admin checking
CREATE OR REPLACE VIEW user_admin_status AS
SELECT 
  u.id as user_id,
  u.email,
  COALESCE(au.role, 'user') as role,
  au.created_at as admin_since
FROM auth.users u
LEFT JOIN admin_users au ON u.id = au.user_id;

-- Grant access to the view
GRANT SELECT ON user_admin_status TO authenticated;