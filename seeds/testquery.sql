-- select lists if users_id and list_id are on users_lists

UPDATE lists
SET city = 'update 3'
WHERE id = (
  SELECT users_lists.list_id
  FROM users_lists
  WHERE users_lists.users_id = 3
  AND users_lists.list_id = lists.id
)
AND id = 5
RETURNING *
;
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
