-- Add onboarding_completed flag to users table
-- Tracks whether a user has completed the multi-step onboarding wizard
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Mark ALL existing users as onboarded so they are NOT forced into the wizard.
-- Only brand-new signups (after this migration) will have onboarding_completed = false.
UPDATE public.users SET onboarding_completed = true WHERE onboarding_completed = false;
