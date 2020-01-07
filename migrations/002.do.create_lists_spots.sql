CREATE TABLE spots (
    id serial PRIMARY KEY,
    name varchar(50),
    tags varchar(50),
    address varchar(50),
    city varchar(50),
    state varchar(50)
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
    list_id serial INTEGER REFERENCES lists(id) ON DELETE CASCADE NULL,
    spot_id serial INTEGER REFERENCES spots(id) ON DELETE CASCADE NULL
);
CREATE TABLE users_lists (
  users_id serial INTEGER REFERENCES users(id) ON DELETE CASCADE NULL,
  list_id serial INTEGER REFERENCES lists(id) ON DELETE CASCADE NULL
);