CREATE TABLE spots (
    id serial PRIMARY KEY,
    name varchar(50),
    tags varchar(50),
    address varchar(50),
    city varchar(50),
    state varchar(50),
    lat decimal,
    lon decimal
);
CREATE TABLE lists (
    id serial PRIMARY KEY,
    name varchar(50),
    tags varchar(50),
    city varchar(50),
    state varchar(50),
    public BOOLEAN
);
CREATE TABLE lists_spots (
    list_id serial PRIMARY KEY,
    spot_id serial PRIMARY KEY,
    FOREIGN KEY (list_id) REFERENCES lists(id),
    FOREIGN KEY (spot_id) REFERENCES spots(id)
);
CREATE TABLE users_lists (
  users_id serial PRIMARY KEY,
  FOREIGN KEY (users_id) REFERENCES users(id),
  list_id serial PRIMARY,
  FOREIGN KEY (lists_id) REFERENCES lists(id)
);