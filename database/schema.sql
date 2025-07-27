-- Morning Buddy Waitlist Database Schema
-- This file contains the SQL commands to set up the database schema in Supabase

-- Create the waiting_list table
CREATE TABLE IF NOT EXISTS waiting_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waiting_list_email ON waiting_list(email);

-- Create an index on confirmed status for analytics queries
CREATE INDEX IF NOT EXISTS idx_waiting_list_confirmed ON waiting_list(confirmed);

-- Create an index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_waiting_list_created_at ON waiting_list(created_at);

-- Enable Row Level Security
ALTER TABLE waiting_list ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to insert new entries
CREATE POLICY "Allow insert for service role" ON waiting_list
  FOR INSERT TO service_role WITH CHECK (true);

-- Create policy for service role to update entries (for email confirmation)
CREATE POLICY "Allow update for service role" ON waiting_list
  FOR UPDATE TO service_role USING (true);

-- Create policy for service role to select entries (for analytics)
CREATE POLICY "Allow select for service role" ON waiting_list
  FOR SELECT TO service_role USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_waiting_list_updated_at 
  BEFORE UPDATE ON waiting_list 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create a view for analytics (optional, for easier querying)
CREATE OR REPLACE VIEW waitlist_stats AS
SELECT 
  COUNT(*) as total_signups,
  COUNT(*) FILTER (WHERE confirmed = true) as confirmed_signups,
  COUNT(*) FILTER (WHERE confirmed = false) as unconfirmed_signups,
  ROUND(
    (COUNT(*) FILTER (WHERE confirmed = true)::float / COUNT(*)::float) * 100, 
    2
  ) as confirmation_rate
FROM waiting_list;