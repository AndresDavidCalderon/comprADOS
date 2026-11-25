BEGIN;

CREATE TABLE IF NOT EXISTS product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_type TEXT NOT NULL DEFAULT 'Unica',
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    quantity_override BOOLEAN NOT NULL DEFAULT TRUE,
    photos TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    description_override TEXT,
    price_override NUMERIC(12, 2),
    materials_override TEXT[],
    color_data JSONB,
    is_showcase BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT product_variants_price_override_nonnegative
        CHECK (price_override IS NULL OR price_override >= 0)
);

ALTER TABLE product_variants
    ADD COLUMN IF NOT EXISTS quantity_override BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE product_variants
    ADD COLUMN IF NOT EXISTS color_data JSONB;

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS variant_kind TEXT;

UPDATE products AS product
SET variant_kind = CASE
    WHEN variant_summary.variant_count < 2 THEN NULL
    WHEN variant_summary.all_colors THEN 'color'
    ELSE 'name'
END
FROM (
    SELECT
        product_id,
        COUNT(*) AS variant_count,
        BOOL_AND(variant_type ~ '^#[0-9A-Fa-f]{6}$') AS all_colors
    FROM product_variants
    GROUP BY product_id
) AS variant_summary
WHERE product.id = variant_summary.product_id
  AND product.variant_kind IS NULL;

CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON product_variants(product_id);
CREATE UNIQUE INDEX IF NOT EXISTS product_variants_one_showcase_per_product_idx
    ON product_variants(product_id)
    WHERE is_showcase;

DO $migration$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'products'
          AND column_name = 'quantity'
    ) THEN
        INSERT INTO product_variants (
            product_id,
            variant_type,
            quantity,
            photos,
            is_showcase
        )
        SELECT
            product.id,
            COALESCE(NULLIF(BTRIM(product.size), ''), 'Unica'),
            GREATEST(product.quantity, 0),
            COALESCE(product.photos, ARRAY[]::TEXT[]),
            TRUE
        FROM products AS product
        WHERE NOT EXISTS (
            SELECT 1
            FROM product_variants AS variant
            WHERE variant.product_id = product.id
        );
    END IF;
END;
$migration$;

ALTER TABLE products
    ALTER COLUMN price TYPE NUMERIC(12, 2) USING price::NUMERIC(12, 2),
    DROP COLUMN IF EXISTS quantity,
    DROP COLUMN IF EXISTS photos,
    DROP COLUMN IF EXISTS size;

COMMIT;