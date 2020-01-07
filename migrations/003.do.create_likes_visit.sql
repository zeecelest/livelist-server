CREATE TABLE liked_by (
    users_id serial INTEGER ON DELETE CASCADE NULL,
    FOREIGN KEY (users_id) REFERENCES users(id),
    list_id serial INTEGER REFERENCES lists(id) ON DELETE CASCADE NULL,
    FOREIGN KEY (list_id) REFERENCES lists(id),
);

CREATE TABLE visited_by (
    users_id serial INTEGER ON DELETE CASCADE NULL,
    FOREIGN KEY (users_id) REFERENCES users(id),
    list_id serial INTEGER ON DELETE CASCADE NULL,
    FOREIGN KEY (list_id) REFERENCES lists(id),
);