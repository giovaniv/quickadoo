exports.seed = function(knex, Promise) {
  return knex('options').del()
    .then(function () {
      return Promise.all([
        knex('options').insert({title: 'Avengers', start_time: '2018.09.09', end_time: '2018.09.09', note: 'pick me!'}),
        knex('options').insert({title: 'Avengers', start_time: '2018.09.09', end_time: '2018.09.09', note: 'pick me!'}),
        knex('options').insert({title: 'Batman', start_time: '2018.09.09', end_time: '2018.09.09', note: 'pick me!'})
      ]);
    });
};