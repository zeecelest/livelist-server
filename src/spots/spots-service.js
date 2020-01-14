const SpotsService = {
  getAllSpots(knex) {
    return knex.select('*').from('spots');
  },
  deleteSpotReference(knex, spot_id, user_id) {
    return knex.transaction((trx) => {
      return knex('lists_spots')
        .transacting(trx)
        .delete()
        .where({ spot_id, user_id })
        .then((resp) => {
          console.log(resp);
          return knex('spots')
            .transacting(trx)
            .delete()
            .where({ id: spot_id })
            .then((resp2) => {
              return resp2;
            });
        });
    });
  },
  insertSpot(knex, newSpot, list_id) {
    return knex.transaction((trx) => {
      return knex('spots')
        .transacting(trx)
        .insert(newSpot)
        .returning('*')
        .then((res) => {
          return knex('lists_spots')
            .transacting(trx)
            .insert({
              list_id: list_id,
              spot_id: res[0].id
            })
            .returning('*')
            .then((res2) => {
              return {
                list_id,
                ...res[0]
              };
            });
        });
    });
  },
  getSpotById(knex, id) {
    return knex
      .from('spots')
      .select('*')
      .where({ id })
      .first();
  },
  //  deleteSpot(knex, id) {
  //    return knex('spots')
  //      .where({id})
  //      .delete();
  //  },
  updateSpot(knex, id, newSpotsField) {
    return knex('spots')
      .where({ id })
      .update(newSpotsField);
  }
};
module.exports = SpotsService;
