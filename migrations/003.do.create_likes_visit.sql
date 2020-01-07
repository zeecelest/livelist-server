CREATE TABLE liked_by (
    users_id serial PRIMARY KEY,
    FOREIGN KEY (users_id) REFERENCES users(id),
    list_id serial PRIMARY KEY REFERENCES lists(id) ON DELETE CASCADE NULL,
    FOREIGN KEY (list_id) REFERENCES lists(id),
);

CREATE TABLE visited_by (
    users_id serial PRIMARY KEY ON DELETE CASCADE NULL,
    FOREIGN KEY (users_id) REFERENCES users(id),
    list_id serial PRIMARY KEY ON DELETE CASCADE NULL,
    FOREIGN KEY (list_id) REFERENCES lists(id),
);