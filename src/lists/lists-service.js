const ListService = {
  getAllLists(knex) {
    return knex
      .raw(
        `
        SELECT count(list_id) AS liked,
               lists.id, 
               lists.name, 
               lists.tags, 
               lists.city, 
               lists.state, 
               lists.is_public 
               FROM liked_by
               RIGHT JOIN lists 
               ON lists.id = liked_by.list_id
               WHERE is_public = true
               GROUP BY lists.id;
        `
      )
      .then((rows) => rows);
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
    `
      )
      .then((resp) => resp.rows);
  },
  getAllListsFromCity(knex, city) {
    // needs implementation
    return knex
      .select('*')
      .from('lists')
      .where({ is_public: true })
      .where('city', 'ilike', city);
  },
  insertList(knex, newList, users_id) {
    return knex.transaction((trx) => {
      return knex('lists')
        .transacting(trx)
        .insert(newList)
        .returning('*')
        .then((resp) => {
          const list_id = resp[0].id;
          return knex('users_lists')
            .transacting(trx)
            .insert({
              users_id: users_id,
              list_id: list_id
            })
            .then((res2) => {
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
    `)
  },
  deleteListReference(knex, list_id, users_id) {
    return knex.transaction((trx) => {
      return knex('users_lists')
        .transacting(trx)
        .delete()
        .where('users_id', '=', users_id)
        .andWhere('list_id', '=', list_id)
        .then((res) => {
          if (res === 0) {
            return { message: 'You dont have access' };
          }
          return knex('lists_spots')
            .transacting(trx)
            .where({ list_id })
            .delete()
            .then((res) => {
              return knex('lists')
                .transacting(trx)
                .where('id', list_id)
                .delete()
                .then((res) => res);
            });
        });
    });
  },
  updateList(knex, user_id, list_id, newList){
    return knex.raw(`
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
    `)
      .then(res => {
        if(res.rows.length === 0) {
          return {message: "no lists"}
        }
        else {
          return res.rows[0]
        }
      })
  },
};

module.exports = ListService;
