exports.seed = function(knex, Promise) {
  return knex('option_voters').del()
    .then(function () {
      return Promise.all([
        knex('option_voters').insert({id: '1'}),
        knex('option_voters').insert({id: '2'}),
        knex('option_voters').insert({id: '3'}),
        knex('option_voters').insert({id: '4'}),
        knex('option_voters').insert({id: '5'}),
        knex('option_voters').insert({id: '6'}),
      ]);
    });
};