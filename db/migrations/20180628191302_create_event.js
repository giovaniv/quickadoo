
exports.up = function (knex, Promise) {
    return knex.schema.createTable('events', function (table) {
        table.increments('id').primary();
        table.string('title').notNullable().defaultTo('');
        table.string('description').defaultTo('');
        table.timestamps('created_at');
        table.date('expiration_time');
        table.string('secret_url').notNullable().defaultTo('');
        table.boolean("is_valid").defaultTo(true);
        // table.integer('creator_id').inTable('users').references('id');
        table.integer('creator_id');
        table.foreign('creator_id').references('users.id');
    })
    .then(function () {
        return knex.schema.createTable('options', function (table) {
            table.increments('id').primary();
            table.string('title').notNullable().defaultTo('');
            table.dateTime('start_time').notNullable();
            table.dateTime('end_time');
            table.string('note');
            // table.integer('event_id').inTable('events').references('id');
            table.integer('event_id');
            table.foreign('event_id').references('events.id');
    })
    })
    .then(function () {
        return knex.schema.createTable('option_voters', function (table) {
            table.increments('id').primary();
            // table.interger("option_id").inTable('options').references('id');
            // table.interger('person_id').inTable('users').references('id');
            table.integer('option_id');
            table.integer('person_id');
            table.foreign('option_id').references('options.id');
            table.foreign('person_id').references('users.id');
    });
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('events');
    return knex.schema.dropTable('options');
    return knex.schema.dropTable('option_voters');
};
