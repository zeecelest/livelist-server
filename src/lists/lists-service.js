const ListService = {
  getAllLists(knex) {
    return knex
      .select(
        '* AS likes',
        'lists.id',
        'lists.name',
        'lists.tags',
        'lists.city',
        'lists.state',
        'lists.is_public'
      )
      .from('liked_by')
      .rightJoin('lists')
      .on((lists.id = likes.id))
      .group(lists.id);
  },

  //select count(*) as likes,
  //lists.id, lists.name, lists.tags, lists.city, lists.state, lists.is_public
  //from liked_by right join lists on lists.id = liked_by.list_id group by lists.id;

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
