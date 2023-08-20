CREATE DATABASE example;

CREATE TABLE cards (
  id_card serial PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  card_number VARCHAR(16) NOT NULL,
  cvv VARCHAR(3) NOT NULL,
  expiration_month VARCHAR(2) NOT NULL,
  expiration_year VARCHAR(4) NOT NULL
);