CREATE TABLE liked_by (
    users_id serial INTEGER REFERENCES users(id) ON DELETE CASCADE NULL,
    list_id serial INTEGER REFERENCES lists(id) ON DELETE CASCADE NULL,
);

CREATE TABLE visited_by (
    users_id serial INTEGER REFERENCES users(id) ON DELETE CASCADE NULL,
    list_id serial INTEGER REFERENCES lists(id) ON DELETE CASCADE NULL,
);