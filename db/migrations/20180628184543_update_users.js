exports.up = function(knex, Promise) {
    return knex.schema.table('users', function (table) {
        table.dropColumn('name'); 
        table.string('email').notNullable().defaultTo('');
        table.string('first_name').notNullable().defaultTo('');
        table.string('last_name').notNullable().defaultTo('');
    });
  };

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function (table) {
        table.string('name'); 
        table.dropColumn('email');
        table.dropColumn('first_name');
        table.dropColumn('last_name');
    });
};
