exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({email: 'alice@aa.com', first_name: 'Alice', last_name: 'Wonder'}),
        knex('users').insert({email: 'bob@aa.com', first_name: 'Bob', last_name: 'Loblaw'}),
        knex('users').insert({email: 'charlie@aa.com', first_name: 'Charlie', last_name: 'Horse'})
      ]);
    });
};
