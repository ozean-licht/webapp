-- ============================================================================
-- ADD TAGS COLUMN TO COURSES TABLE
-- ============================================================================
-- Purpose: Add tags support for courses (e.g., LCQ, Basis, Master, etc.)
-- ============================================================================

-- Add tags column as TEXT ARRAY
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create index for better performance when filtering by tags
CREATE INDEX IF NOT EXISTS idx_courses_tags ON courses USING GIN(tags);

-- Add comment for documentation
COMMENT ON COLUMN courses.tags IS 'Course tags like LCQ, Basis, Aufbau, Fortgeschritten, Master, Q&A, Kostenlos, Interview';

