DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    total_price INT NOT NULL,
    client JSONB NOT NULL,
    items JSONB NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);