CREATE TABLE spots ( id serial PRIMARY KEY UNIQUE,
                                           name varchar(50),
                                                tags varchar(50),
                                                     address varchar(50),
                                                             city varchar(50),
                                                                  state varchar(50),
                                                                        lat decimal, lon decimal);


CREATE TABLE lists ( id serial PRIMARY KEY UNIQUE,
                                           name varchar(50),
                                                tags varchar(50),
                                                     city varchar(50),
                                                          state varchar(50),
                                                                is_public BOOLEAN);


CREATE TABLE lists_spots ( list_id INTEGER, spot_id INTEGER,
                          FOREIGN KEY (list_id) REFERENCES lists(id),
                          FOREIGN KEY (spot_id) REFERENCES spots(id));


CREATE TABLE users_lists ( users_id INTEGER, list_id INTEGER,
                          FOREIGN KEY (users_id) REFERENCES users(id),
                          FOREIGN KEY (list_id) REFERENCES lists(id));

