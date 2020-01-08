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
      .then(rows => rows.rows);
  },
  getListByIdTwo(knex, id) {
    return knex.raw(
      `
      SELECT * from lists where
      `
    );
  },
  getAllListsFromCity(knex, city) {
    return knex
      .select('*')
      .from('lists')
      .where({ is_public: true, city });
  },
  insertList(knex, newList) {
    return knex
      .insert(newList)
      .into('lists')
      .returning('*')
      .then(rows => rows[0]);
  },
  getListById(knex, id) {
    return knex
      .from('lists')
      .select('*')
      .where({ id })
      .first();
  },
  deleteListReference(knex, list_id, user_id) {
    return knex('users_lists')
      .where({ list_id, user_id })
      .delete();
  },
  deleteList(knex, id) {
    return knex('lists')
      .where({ id })
      .delete();
  },
  updateList(knex, id, newListField) {
    return knex('lists')
      .where({ id })
      .update(newListField);
  }
};

module.exports = ListService;
