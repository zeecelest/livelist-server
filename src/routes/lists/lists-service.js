const ListService = {
  getAllLists(knex) {
    return knex.select('*').from('lists');
  },
  insertListmark(knex, newList) {
    return knex
      .insert(newList)
      .into('lists')
      .returning('*')
      .then(rows => rows[0]);
  },
  getById(knex, id) {
    return knex
      .from('lists')
      .select('*')
      .where('id', id)
      .first();
  },
  deleteListmark(knex, id) {
    return knex('lists')
      .where({ id })
      .delete();
  },
  updatelists(knex, id, newListField) {
    return knex('lists')
      .where({ id })
      .update(newListField);
  }
};

module.exports = ListService;
