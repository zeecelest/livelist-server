BEGIN;

TRUNCATE
    "users",
    "spots",
    "lists",
    "lists_spots",
    "users_lists",
    "liked_by",
    "visited_by"
    RESTART IDENTITY CASCADE;

-- users table
INSERT INTO "users" ("id", "username", "password","name", "city", "state")
VALUES 
    -- password ="pass"
    (1, 'admin', '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG', 'Dunder Mifflin Admin', 'AZ', 'Glendale'),
    -- password ='password'
    (2, 'test', '$2a$12$UNy2eRncG36U3KYfBaJq5ehHsaPwgUOPGNY6JynnMy7TlXS8SwchK', 'Julio H.', 'CA', 'Albany');
    
-- spots table
INSERT INTO "spots" ("id", "name", "tags" , "address", "city", "state", "lat", "lon")
VALUES 
    (1, 'Pinks Hot Dogs', '#restaurant' , '709 N La Brea Ave, 90038', 'CA', 'Los Angeles', '5.032', '20.6542' ),
    (2, 'Giggles Night Club', '#nightout', '215 N Brand Blvd, 91203', 'CA', 'Glendale', '33.0324', '18.2664' );

-- lists table
INSERT INTO "lists" ("id", "name", "tags", "city", "state", "is_public" )
VALUES 
    (1, 'Date night', '#datenight',  'Glendale','CA', false ),
    (2, 'Saturday fun night', '#nightout',  'Los Angeles','CA', true ),
    (3, 'Weekday Routine', '#nightout',  'NYC','NY', true );

-- lists_spots table
INSERT INTO "lists_spots" ("list_id", "spot_id") 
VALUES 
    (1,1),
    (2,2);

-- users_lists table
INSERT INTO "users_lists" ("users_id", "list_id")
VALUES
    (1,1),
    (2,1);

-- liked_by table
INSERT INTO "liked_by" ("users_id", "list_id")
VALUES
    (1,1),
    (1,2),
    (2,1),
    (2,2);

-- visited_by table
INSERT INTO "visited_by" ("users_id", "list_id")
VALUES
    (1,1),
    (1,2),
    (2,1),
    (2,2);

COMMIT;
