const SpotsService = {
  getAllSpots(knex) {
    return knex.select('*').from('spots');
  },
  deleteSpotReference(knex, spot_id, user_id) {
    console.log(user_id, spot_id);
    return knex.raw(`
      BEGIN;
        DO $$
          DECLARE temp int;
          BEGIN
      SELECT
        users_lists.list_id
        INTO temp
        FROM users_lists
        JOIN lists_spots
        ON lists_spots.list_id = users_lists.list_id
        WHERE users_lists.users_id = ${user_id}
        AND lists_spots.spot_id = ${spot_id};
        IF NOT FOUND THEN
          RAISE EXCEPTION 'No access to that record';
        END IF;
      END
      $$;
      DELETE
      FROM lists_spots
      WHERE spot_id = ${spot_id}
      AND EXISTS (
        SELECT
          users_lists.list_id
          FROM users_lists
          JOIN lists_spots
          ON lists_spots.list_id = users_lists.list_id
          WHERE users_lists.users_id = ${user_id}
          AND lists_spots.spot_id = ${spot_id}
      );
        DELETE
        FROM spots
        WHERE id = 1;
      COMMIT


    `);
    //    return knex.raw(`
    //      BEGIN;
    //        DELETE
    //        FROM lists_spots
    //        WHERE spot_id = ${spot_id}
    //        AND list_id = (
    //          SELECT
    //            users_lists.list_id
    //            FROM users_lists
    //            JOIN lists_spots
    //            ON lists_spots.list_id = users_lists.list_id
    //            WHERE users_lists.users_id = ${user_id}
    //            AND lists_spots.spot_id = ${spot_id}
    //        );
    //        DELETE
    //        FROM spots
    //        WHERE id = ${spot_id};
    //      COMMIT;
    //    `)
    //    return knex.transaction((trx) => {
    //      return knex('lists_spots')
    //        .transacting(trx)
    //        .delete()
    //        .where({spot_id})
    //        .then(resp => {
    //          return knex('spots')
    //            .transacting(trx)
    //            .delete()
    //            .where({ id: spot_id })
    //            .then((resp2) => {
    //              return resp2;
    //            });
    //        });
    //    });
  },
  insertSpot(knex, newSpot, list_id) {
    return knex.transaction(trx => {
      return knex('spots')
        .transacting(trx)
        .insert(newSpot)
        .returning('*')
        .then(res => {
          return knex('lists_spots')
            .transacting(trx)
            .insert({
              list_id: list_id,
              spot_id: res[0].id,
            })
            .returning('*')
            .then(res2 => {
              return {
                list_id,
                ...res[0],
              };
            });
        });
    });
  },
  getSpotById(knex, id) {
    return knex
      .from('spots')
      .select('*')
      .where({id})
      .first();
  },
  updateSpot(knex, spot_id, user_id, list_id, newSpot) {
    console.log(newSpot, spot_id, user_id, list_id);
    return knex
      .raw(
        `
      UPDATE spots
      SET
        name = '${newSpot.name}',
        address = '${newSpot.address}',
        city = '${newSpot.city}',
        state = '${newSpot.state}',
        tags = '${newSpot.tags}'
      WHERE id = (
        SELECT spot_id
        FROM lists_spots
        WHERE lists_spots.list_id = (
          SELECT users_lists.list_id
          FROM users_lists
          WHERE users_lists.users_id = ${user_id}
          AND users_lists.list_id = ${list_id}
        )
        AND spot_id = ${spot_id}
      )
      RETURNING *
      ;
    `,
      )
      .then(res => {
        if (res.rows.length === 0) {
          return {message: 'nothing here'};
        } else {
          return res.rows[0];
        }
      });
  },
};
module.exports = SpotsService;
