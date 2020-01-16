-- select lists if users_id and list_id are on users_lists

DO $$
DECLARE
  row_exists NUMERIC;
BEGIN
  SELECT COUNT(*)
  INTO row_exists
  FROM liked_by
  WHERE list_id = 1
  AND users_id = 1;

  IF (row_exists > 0) THEN
    DELETE FROM liked_by
    WHERE list_id = 1
    AND users_id = 1;
  ELSE
    INSERT INTO liked_by
    VALUES(1, 1);
  END IF;
END;
$$


--DO $$
--  DECLARE temp int;
--  BEGIN
--    SELECT COUNT(*) INTO temp,
--      IF temp = 1
--        THEN 
--          DELETE FROM liked_by
--          WHERE list_id = 1
--          AND users_id = 1
--        ELSE
--          INSERT INTO liked_by
--          VALUES(1, 1)
--      END IF;
--    FROM liked_by
--    WHERE list_id = 1
--    AND users_id = 1
--  END;
--$$
--  THEN
--    DELETE FROM liked_by
--    WHERE list_id = 1
--    AND users_id = 1
--  ELSE
--   INSERT INTO liked_by
--   VALUES(1, 1)
--END
-- ** Grabcount of record
--BEGIN;
----  DO $$
----    DECLARE temp int;
----    BEGIN
----  SELECT list_id
----  INTO temp
----  FROM liked_by
----  WHERE list_id = lists.id;
----  END
----  $$;
--  SELECT (
--    SELECT COUNT(*)
--      FROM liked_by
--      WHERE list_id = lists.id
--  ) AS likes,
--  (SELECT COUNT(*)
--    FROM liked_by
--    WHERE list_id = lists.id
--    AND liked_by.users_id = 1
--  ) AS liked_by_user,
--  (
--    SELECT COUNT(*)
--    FROM liked_by
--    WHERE list_id = lists.id
--    AND list_id > (
--      SELECT COUNT(*)
--      FROM liked_by
--    ) * .05
--  ) AS on_fire,
--  *
--  FROM lists;
--COMMIT;


-- ** delete refrence
--BEGIN;
--      DO $$
--        DECLARE temp int;
--        BEGIN
--    SELECT
--      users_lists.list_id
--      INTO temp
--      FROM users_lists
--      JOIN lists_spots
--      ON lists_spots.list_id = users_lists.list_id
--      WHERE users_lists.users_id = 1
--      AND lists_spots.spot_id = 1;
--      IF NOT FOUND THEN
--        RAISE EXCEPTION 'No access to that record';
--      END IF;
--    END
--    $$;
--  DELETE
--  FROM lists_spots
--  WHERE spot_id = 1
--  AND EXISTS (
--    SELECT
--      users_lists.list_id
--      FROM users_lists
--      JOIN lists_spots
--      ON lists_spots.list_id = users_lists.list_id
--      WHERE users_lists.users_id = 1
--      AND lists_spots.spot_id = 1
--  );
--    DELETE
--    FROM spots
--    WHERE id = 1;
--COMMIT
-- ** currently working, but need to have a condition
--BEGIN;
--  DELETE
--  FROM lists_spots
--  WHERE spot_id = 1
--  AND list_id = (
--    SELECT
--      users_lists.list_id
--      FROM users_lists
--      JOIN lists_spots
--      ON lists_spots.list_id = users_lists.list_id
--      WHERE users_lists.users_id = 1
--      AND lists_spots.spot_id = 1
--  );
--  DELETE
--  FROM spots
--  WHERE id = 1;
--COMMIT;

-- **update spots
--
--UPDATE spots
--SET
--  name = 'NEW NAME'
--WHERE id = (
--  SELECT spot_id
--  FROM lists_spots
--  WHERE lists_spots.list_id = (
--    SELECT users_lists.list_id
--    FROM users_lists
--    WHERE users_lists.users_id = 1
--    AND users_lists.list_id = 1
--  )
--  AND spot_id = 6
--  )
--RETURNING *
--;
-- **UPDATE lists
--SET city = 'update 3'
--WHERE id = (
--  SELECT users_lists.list_id
--  FROM users_lists
--  WHERE users_lists.users_id = 3
--  AND users_lists.list_id = lists.id
--)
--AND id = 5
--RETURNING *
--;
--        SELECT count(list_id) AS liked,
--               lists.id,
--               lists.name,
--               lists.tags,
--               lists.city,
--               lists.state,
--               lists.is_public
--               FROM liked_by
--               RIGHT JOIN lists
--               ON lists.id = liked_by.list_id
--               WHERE is_public = true
--               GROUP BY lists.id;

-- Select likecount and fav count
--(SELECT
--lists.id,
--lists.name,
--lists.city,
--lists.state,
--lists.is_public,
--(SELECT count(list_id) AS liked
--          FROM liked_by
--          INNER JOIN lists
--          ON lists.id = liked_by.list_id
--          WHERE lists.id = 2
--        ),
--(SELECT count(list_id) AS fav
--          FROM visited_by
--          INNER JOIN lists
--          ON lists.id = visited_by.list_id
--          WHERE lists.id = 2
--        )
--FROM lists
--WHERE lists.id = 2)
--;
