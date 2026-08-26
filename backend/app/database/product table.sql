DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id BIGSERIAl PRIMARY KEY ,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    quantity INT NOT NULL,
    tags text[],
    photos text[],
    category text NOT NULL,
    size TEXT,
    materials TEXT[],
    is_hidden BOOLEAN DEFAULT FALSE
);