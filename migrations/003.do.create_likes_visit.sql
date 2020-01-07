CREATE TABLE liked_by (
    users_id INTEGER,
    list_id INTEGER,
    FOREIGN KEY (users_id) REFERENCES users(id),
    FOREIGN KEY (list_id) REFERENCES lists(id)
);

CREATE TABLE visited_by (
    users_id INTEGER,
    list_id INTEGER,
    FOREIGN KEY (users_id) REFERENCES users(id),
    FOREIGN KEY (list_id) REFERENCES lists(id)
);