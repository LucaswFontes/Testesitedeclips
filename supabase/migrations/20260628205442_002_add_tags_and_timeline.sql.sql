/*
# Add tags, timeline, and enhanced categories

1. New Tables
- `timeline_moments`
  - id (uuid, primary key)
  - title (text, not null)
  - description (text)
  - timestamp (time)
  - category (text)
  - tags (text array)
  - favorite (boolean)
  - priority (text)
  - converted_to_clip (boolean)
  - clip_id (uuid, foreign key)
  - created_at (timestamp)

2. Modified Tables
- `clips`
  - Add `tags` (text array)
  - Add `timeline_moment_id` (uuid, foreign key)

3. Indexes
- GIN index on tags for array searching
- Index on timeline created_at
- Index on clip timeline_moment_id

4. Security
- Enable RLS on timeline_moments
- CRUD policies for anon + authenticated users
*/

-- Add tags column to clips
ALTER TABLE clips ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Add timeline_moment_id to clips
ALTER TABLE clips ADD COLUMN IF NOT EXISTS timeline_moment_id uuid;

-- Create timeline_moments table
CREATE TABLE IF NOT EXISTS timeline_moments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  timestamp text,
  category text,
  tags text[] DEFAULT '{}',
  favorite boolean NOT NULL DEFAULT false,
  priority text CHECK (priority IN ('low', 'medium', 'high')),
  converted_to_clip boolean NOT NULL DEFAULT false,
  clip_id uuid REFERENCES clips(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create GIN indexes for array searching
CREATE INDEX IF NOT EXISTS idx_clips_tags ON clips USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_timeline_tags ON timeline_moments USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_timeline_created_at ON timeline_moments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clips_timeline_moment ON clips(timeline_moment_id);

-- Enable RLS on timeline_moments
ALTER TABLE timeline_moments ENABLE ROW LEVEL SECURITY;

-- Policies for timeline_moments
DROP POLICY IF EXISTS "anon_select_timeline" ON timeline_moments;
CREATE POLICY "anon_select_timeline" ON timeline_moments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_timeline" ON timeline_moments;
CREATE POLICY "anon_insert_timeline" ON timeline_moments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_timeline" ON timeline_moments;
CREATE POLICY "anon_update_timeline" ON timeline_moments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_timeline" ON timeline_moments;
CREATE POLICY "anon_delete_timeline" ON timeline_moments FOR DELETE
  TO anon, authenticated USING (true);