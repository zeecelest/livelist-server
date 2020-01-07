const ListService = {
  getAllLists(knex) {
    return knex.select('*').from('lists'); // will need to pull more specifically
  },
  insertList(knex, newList) {
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
