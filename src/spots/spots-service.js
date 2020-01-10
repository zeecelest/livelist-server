const SpotsService = {
  getAllSpots(knex) {
    return knex.select('*').from('spots');
  },
  deleteListReference(knex, list_id, users_id) {
    return knex.transaction(trx => {
      return knex('users_lists')
        .transacting(trx)
        .where({list_id})
        .where({users_id})
        .delete()
        .then(res => {
          return knex('lists_spots')
            .transacting(trx)
            .where({list_id})
            .delete()
            .then(res => {
              return knex('lists')
                .transacting(trx)
                .where('id', list_id)
                .delete()
                .then(res => res)
            })
        })
    })
    //    return knex('users_lists')
    //      .where({ list_id, users_id })
    //      .delete();
  },
  insertSpot(knex, newSpot, list_id) {
    return knex.transaction(trx => {
      return knex('spots')
        .transacting(trx)
        .insert(newSpot)
        .returning('*')
        .then(res => {
          console.log(res)
          return knex('lists_spots')
            .transacting(trx)
            .insert({
              list_id: list_id,
              spot_id: res[0].id
            })
            .returning('*')
            .then(res2 => {
              return {
                list_id,
                ...res[0]
              }
            })
        })
    })
    //      .insert(newSpot)
    //      .into('spots')
    //      .returning('*')
    //      .then(rows => rows[0]);
  },
  getSpotById(knex, id) {
    return knex
      .from('spots')
      .select('*')
      .where({ id })
      .first();
  },
  deleteSpot(knex, id) {
    return knex('spots')
      .where({ id })
      .delete();
  },
  updateSpot(knex, id, newSpotsField) {
    return knex('spots')
      .where({ id })
      .update(newSpotsField);
  }
};

module.exports = SpotsService;
