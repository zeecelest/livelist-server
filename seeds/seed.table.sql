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
    (1, 'Pinks Hot Dogs', '#restaurant' , '709 N La Brea Ave', 'CA', 'Los Angeles', '34.083824', '-118.344266' ),
    (2, 'Giggles Night Club', '#nightout', '215 N Brand Blvd', 'CA', 'Los Angeles', '34.032400', '-118.324664' ),
    (3, 'Hickups', '#cheap #tips', '215 N Brand Blvd', 'CA', 'Los Angeles', '34.0324', '-118.332664' ),
    (4, 'Giggles Night Club', '#wine #beer', '18 N Brand Blvd', 'CA', 'Los Angeles', '34.0324', '-118.312664' ),
    (5, 'Marvel Museum', '#views', '11 N Fake', 'CA', 'Los Angeles', '34.0324', '-118.325664' ),
    (6, 'Hodads', '#burgers', '11 N Fake', 'CA', 'San Diego', '32.715116', '-117.161025' ),
    (7, 'Donut Bar', '#oreodonut', '113 robers dr', 'CA', 'San Diego', '32.718423', '-117.15830' ),
    (8, 'House of Blues', '#music #club #expensive', '154 metro', 'CA', 'San Diego', '32.71630', '-117.159545' ),
    (9, 'Alamillas mexican', '#churros #tacos #birria', '1894 first ave', 'CA', 'San Diego', '32.719797', '-117.159111' ),
    (10, 'private 1', '#private', '11 N Fake', 'CA', 'San Diego', '32.713420', '-117.167534' ),
    (11, 'private 2', '#private', '11 N Fake', 'CA', 'San Diego', '32.713333', '-118.325664' ),
    (12, 'private 3', '#private', '11 N Fake', 'CA', 'San Diego', '32.713999', '-118.325664' );

-- lists table
INSERT INTO "lists" ("id", "name", "tags", "city", "state", "is_public" )
VALUES 
    (1, 'Date night', '#datenight',  'Los Angeles','CA', true ),
    (2, 'Trendy resturants in gas lamp', '#costs #hip #drinks #gaslamp', 'San Diego','CA', true ),
    (3, 'My secret list', '#private', 'San Diego','CA', false );

-- lists_spots table
INSERT INTO "lists_spots" ("list_id", "spot_id") 
VALUES 
    (1,1),
    (1,2),
    (1,3),
    (1,4),
    (1,5),
    (2,6),
    (2,7),
    (2,8),
    (2,9),
    (3,10),
    (3,11),
    (3,12);

-- users_lists table
INSERT INTO "users_lists" ("users_id", "list_id")
VALUES
    (1,1),
    (2,1),
    (1,3);

-- liked_by table
INSERT INTO "liked_by" ("users_id", "list_id")
VALUES
    (1,1);

-- visited_by table
INSERT INTO "visited_by" ("users_id", "list_id")
VALUES
    (1,1);

COMMIT;
