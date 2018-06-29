
exports.up = function (knex, Promise) {
  return knex.schema.table('events', function (table) {
    table.dropTimestamps();
  })
  .then (function () {
    return knex.schema.table('events', function (table) {
      table.timestamps(true, true);
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('events', function (table) {
    table.dropTimestamps();
  })
  .then (function () {
    return knex.schema.table('events', function (table) {
      table.timestamps('created_at');
    });
  });
};