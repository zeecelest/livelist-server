const ListService = {
  getAllLists(knex) {
    return knex.transaction(function(trx) {
      return knex('lists')
        .transacting(trx)
        .returning('*')
        .where({ is_public: true })
        .then(res => {
          return knex('liked_by')
            .transacting(trx)
            .returning('*')
            .where({ list_id: res[0].id })
            .then(second_res => {
              return { likes: second_res, lists: res };
            });
        });
    });
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
