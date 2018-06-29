exports.seed = function(knex, Promise) {
  return knex('options').del()
    .then(function () {
      return Promise.all([
        knex('options').insert({titles: 'Avengers', start_time: '2018-09-09 10:00', end_time: '2018-09-09 12:00', note: 'pick me!'}),
        knex('options').insert({titles: 'Avengers', start_time: '2018-09-09 11:00', end_time: '2018-09-09 13:00', note: 'pick me!'}),
        knex('options').insert({titles: 'Batman', start_time: '2018-09-09 10:00', end_time: '2018-09-09 11:00', note: 'pick me!'})
      ]);
    });
};