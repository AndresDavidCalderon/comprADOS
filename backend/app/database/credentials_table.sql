DROP TABLE IF EXISTS credentials;
CREATE TABLE credentials (
    username VARCHAR(120) PRIMARY KEY,
    password_hash TEXT NOT NULL
);