exports.seed = function(knex, Promise) {
  return knex('events').del()
    .then(function () {
      return Promise.all([
        knex('events').insert({title: 'Movie Night', description: 'Emergency hangout', expiration_time: '2020-01-01', secret_url: 'abc123', is_valid:true}),
      ]);
    });
};