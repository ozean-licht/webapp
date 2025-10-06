-- ============================================================================
-- COURSE MAPPING TABLE
-- ============================================================================
-- Purpose: Map Ablefy product_id to Supabase course_id
-- Source: Airtable course_mapping table (tblS5nhisQH2xsCPs)
-- ============================================================================

CREATE TABLE course_mapping (
  -- ============================================================================
  -- IDENTIFIERS
  -- ============================================================================
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Ablefy Product ID (from legacy system)
  ablefy_product_id INTEGER UNIQUE NOT NULL,
  
  -- Supabase Course ID (from courses table)
  -- Note: Using BIGINT to match courses.id type
  course_id BIGINT REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  
  -- Course Title (for reference)
  course_title TEXT,
  
  -- ============================================================================
  -- METADATA
  -- ============================================================================
  notes TEXT, -- Any migration notes
  is_active BOOLEAN DEFAULT TRUE, -- Can disable mappings
  
  -- ============================================================================
  -- AUDIT
  -- ============================================================================
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_course_mapping_ablefy_product_id ON course_mapping(ablefy_product_id);
CREATE INDEX idx_course_mapping_course_id ON course_mapping(course_id);
CREATE UNIQUE INDEX idx_course_mapping_unique_pair ON course_mapping(ablefy_product_id, course_id);

-- ============================================================================
-- TRIGGER
-- ============================================================================
CREATE TRIGGER update_course_mapping_updated_at
    BEFORE UPDATE ON course_mapping
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION: Get Course ID from Ablefy Product ID
-- ============================================================================
CREATE OR REPLACE FUNCTION get_course_from_ablefy_product(p_product_id INTEGER)
RETURNS BIGINT AS $$
DECLARE
    v_course_id BIGINT;
BEGIN
    SELECT course_id INTO v_course_id
    FROM course_mapping
    WHERE ablefy_product_id = p_product_id
    AND is_active = TRUE;
    
    RETURN v_course_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- SAMPLE MAPPINGS (populate from Airtable)
-- ============================================================================
-- Example structure (to be filled from Airtable sync):
-- INSERT INTO course_mapping (ablefy_product_id, course_id, course_title) VALUES
-- (419336, 'uuid-here', 'Sterben für Anfänger'),
-- (443030, 'uuid-here', 'Earth Code'),
-- (420632, 'uuid-here', 'Workshop UFO Sichtungen');

-- ============================================================================
-- RLS
-- ============================================================================
ALTER TABLE course_mapping ENABLE ROW LEVEL SECURITY;

-- Public read access (needed for access derivation)
CREATE POLICY "Anyone can read course_mapping"
    ON course_mapping FOR SELECT
    TO authenticated
    USING (true);

-- Only admins can modify
CREATE POLICY "Only admins can modify course_mapping"
    ON course_mapping FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE course_mapping IS 'Maps Ablefy product IDs to Supabase course IDs for migration and access derivation';
COMMENT ON FUNCTION get_course_from_ablefy_product IS 'Returns course_id for given Ablefy product_id';

