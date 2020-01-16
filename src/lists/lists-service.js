const ListService = {
  /*on_fire returns an int if total likes is more then %5 of all likes
   * found in the datase.*/
  getAllLists(knex, user_id) {
    return knex
      .raw(`
        SELECT (
          SELECT COUNT(*)
            FROM liked_by
            WHERE list_id = lists.id
        ) AS likes,
        (SELECT COUNT(*)
          FROM liked_by
          WHERE list_id = lists.id
          AND liked_by.users_id = ${user_id}
        ) AS liked_by_user,
        (
          SELECT COUNT(*)
          FROM liked_by
          WHERE list_id = lists.id
          AND list_id > (
            SELECT COUNT(*)
            FROM liked_by
          ) * .05
        ) AS on_fire,
        *
        FROM lists;
    `)
  },
  getAllListsFromUser(knex, id) {
    return knex
      .raw(
        `
      SELECT *
      FROM users_lists
      JOIN lists
      ON list_id = lists.id
      WHERE users_id = ${id};
    `,
      )
      .then(resp => resp.rows);
  },
  getAllListsFromCity(knex, city) {
    // needs implementation
    return knex
      .select('*')
      .from('lists')
      .where({is_public: true})
      .where('city', 'ilike', city);
  },
  insertList(knex, newList, users_id) {
    return knex.transaction(trx => {
      return knex('lists')
        .transacting(trx)
        .insert(newList)
        .returning('*')
        .then(resp => {
          const list_id = resp[0].id;
          return knex('users_lists')
            .transacting(trx)
            .insert({
              users_id: users_id,
              list_id: list_id,
            })
            .then(res2 => {
              return resp[0];
            });
        });
    });
  },
  getListById(knex, id) {
    return knex.raw(`
        SELECT
          lists_spots.list_id,
          lists.name AS list_name,
          lists.tags AS list_tags,
          users.name AS created_by,
          spot_id,
          spots.name,
          spots.tags AS spots_tags,
          spots.address,
          spots.city,
          spots.state,
          spots.lat,
          spots.lon AS lng
        FROM lists_spots
        JOIN spots
        ON spot_id = spots.id
        JOIN lists
        ON list_id = lists.id
        JOIN users_lists
        ON lists_spots.list_id = users_lists.list_id
        JOIN users
        ON users_lists.users_id = users.id
        WHERE lists_spots.list_id = ${id}
        ;
    `);
  },
  deleteListReference(knex, list_id, users_id) {
    return knex.transaction(trx => {
      return knex('users_lists')
        .transacting(trx)
        .delete()
        .where('users_id', '=', users_id)
        .andWhere('list_id', '=', list_id)
        .then(res => {
          if (res === 0) {
            return {message: 'You dont have access'};
          }
          return knex('lists_spots')
            .transacting(trx)
            .where({list_id})
            .delete()
            .then(res => {
              return knex('lists')
                .transacting(trx)
                .where('id', list_id)
                .delete()
                .then(res => res);
            });
        });
    });
  },
  updateList(knex, user_id, list_id, newList) {
    return knex
      .raw(
        `
      UPDATE lists
      SET
        name = '${newList.name}',
        city = '${newList.city}',
        state = '${newList.state}',
        is_public = ${newList.is_public},
        description = '${newList.description}',
        tags = '${newList.tags}'
      WHERE id = (
        SELECT users_lists.list_id
        FROM users_lists
        WHERE users_lists.users_id = ${user_id}
        AND users_lists.list_id = ${list_id}
        )
      AND id = ${list_id}
      RETURNING *
      ;
    `,
      )
      .then(res => {
        if (res.rows.length === 0) {
          return {message: 'no lists'};
        } else {
          return res.rows[0];
        }
      });
  },
  likeList(knex, list_id, user_id) {
    return knex
      .raw(`
      BEGIN;
      DO $$
        DECLARE
          row_exists NUMERIC;
        BEGIN
          SELECT COUNT(*)
          INTO row_exists
          FROM liked_by
          WHERE list_id = ${parseInt(list_id)}
          AND users_id = ${parseInt(user_id)};
          IF (row_exists > 0) THEN
            DELETE FROM liked_by
            WHERE list_id = ${parseInt(list_id)}
            AND users_id = ${user_id};
          ELSE
            INSERT INTO liked_by
            VALUES(${user_id}, ${parseInt(list_id)});
          END IF;
        END;
        $$ LANGUAGE plpgsql;
          SELECT COUNT(*)
          FROM liked_by
          WHERE list_id = ${parseInt(list_id)}
          AND users_id = ${parseInt(user_id)};
        COMMIT;
      `)
  }
}
module.exports = ListService;
