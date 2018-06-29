
exports.up = function (knex, Promise) {
  return knex.schema.table('options', function (table) {
    table.dropColumn('start_time');
  })
    .then(function () {
      return knex.schema.table('options', function (table) {
        table.dateTime('start_time');
      });
    });
};

exports.down = function (knex, Promise) {
  return knex.schema.table('options', function (table) {
    table.dropColumn('start_time');
  })
    .then(function () {
      return knex.schema.table('options', function (table) {
        table.dateTime('start_time').notNullable();
      });
    });
};
