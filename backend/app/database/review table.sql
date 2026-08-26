DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    stars INT NOT NULL,
    comment TEXT
);