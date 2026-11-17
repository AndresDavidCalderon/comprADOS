BEGIN;

ALTER TABLE product_variants
    DROP COLUMN IF EXISTS quantity_override;

COMMIT;
