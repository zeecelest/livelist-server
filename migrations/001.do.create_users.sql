CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL
);
CREATE TABLE users_lists (
  users_id serial PRIMARY KEY,
  list_id
);
