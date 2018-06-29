
exports.up = function (knex, Promise) {
  return knex.schema.table('events', function (table) {
    table.dropColumn('secret_url');
    table.string('admin_url').notNullable().defaultTo('');
    table.string('poll_url').notNullable().defaultTo('');
  })
  .then(function () {
    return knex.schema.table('users', function (table) {
      table.dropColumn('email');
    });
  })
  .then(function() {
    return knex.schema.table('users', function (table) {
      table.string('email').unique().notNullable().defaultTo('');
    });
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.table('events', function (table) {
    table.string('secret_url').notNullable().defaultTo('');
    table.dropColumn('admin_url');
    table.dropColumn('poll_url');
  })
  .then(function () {
    return knex.schema.table('users', function (table) {
      table.dropColumn('email');
    })
  })
  .then(function () {
    return knex.schema.table('users', function (table) {
      table.string('email').notNullable().defaultTo('');
    })
  })
};