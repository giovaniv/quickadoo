
exports.up = function (knex, Promise) {
  return knex.schema.table('options', function (table) {
    table.dropColumn('title');
    table.string('name').notNullable().defaultTo('');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('options', function (table) {
    table.dropColumn('name');
    table.string('title').notNullable().defaultTo('');
  })
};
