BEGIN;

ALTER TABLE product_variants
    ADD COLUMN IF NOT EXISTS color_data JSONB;

COMMIT;
