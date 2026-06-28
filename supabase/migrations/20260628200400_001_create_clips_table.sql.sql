/*
# Create clips table (single-tenant, no auth)

1. New Tables
- `clips`
  - `id` (uuid, primary key)
  - `title` (text, not null)
  - `clip_url` (text, not null)
  - `platform` (text, not null) - Kick, Twitch, YouTube
  - `category` (text)
  - `game` (text)
  - `streamer` (text)
  - `notes` (text)
  - `date` (date)
  - `rating` (integer, 1-5)
  - `priority` (text) - low, medium, high
  - `status` (text) - to_edit, editing, ready, posted
  - `favorite` (boolean, default false)
  - `thumbnail_url` (text)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

2. Security
- Enable RLS on `clips`.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (single-tenant app, no sign-in).
*/

CREATE TABLE IF NOT EXISTS clips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  clip_url text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('kick', 'twitch', 'youtube')),
  category text,
  game text,
  streamer text,
  notes text,
  date date,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  priority text CHECK (priority IN ('low', 'medium', 'high')),
  status text NOT NULL DEFAULT 'to_edit' CHECK (status IN ('to_edit', 'editing', 'ready', 'posted')),
  favorite boolean NOT NULL DEFAULT false,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_clips_platform ON clips(platform);
CREATE INDEX IF NOT EXISTS idx_clips_status ON clips(status);
CREATE INDEX IF NOT EXISTS idx_clips_priority ON clips(priority);
CREATE INDEX IF NOT EXISTS idx_clips_favorite ON clips(favorite);
CREATE INDEX IF NOT EXISTS idx_clips_date ON clips(date DESC);
CREATE INDEX IF NOT EXISTS idx_clips_rating ON clips(rating DESC);

ALTER TABLE clips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_clips" ON clips;
CREATE POLICY "anon_select_clips" ON clips FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_clips" ON clips;
CREATE POLICY "anon_insert_clips" ON clips FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_clips" ON clips;
CREATE POLICY "anon_update_clips" ON clips FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_clips" ON clips;
CREATE POLICY "anon_delete_clips" ON clips FOR DELETE
  TO anon, authenticated USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_clips_updated_at ON clips;
CREATE TRIGGER update_clips_updated_at
  BEFORE UPDATE ON clips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();