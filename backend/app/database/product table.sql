CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    quantity INT NOT NULL,
    tags JSONB,
    photos JSONB,
    category VARCHAR(50) NOT NULL,
    size TEXT,
    materials TEXT,
    is_hidden BOOLEAN DEFAULT FALSE
);