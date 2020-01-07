CREATE TABLE spots (
    id serial PRIMARY KEY,
    name varchar(50),
    tags varchar(50),
    address varchar(50),
    city varchar(50),
    state varchar(50)
)
CREATE TABLE lists (
    id serial PRIMARY KEY,
    name varchar(50),
    tags varchar(50),
    city varchar(50),
    state varchar(50),
    public BOOLEAN
)