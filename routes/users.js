"use strict";

const express = require('express');
const router = express.Router();
const { checkRecord, insertRecords } = require('../libs/query-helpers');

module.exports = knex => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
      });
  });

  // user completes and submit the event and user forms
  // use post() for now for debugging but change it to put()
  router.post('/events', (req, res) => {
    const table = 'users';
    // test run
    // const { name } = req.body;
    checkRecord(knex, req.body, table)
      .then(() => {
        // record doesn't exist. insert the data
        insertRecords(knex, table, req.body)
          .then(result => console.log(result))
          .catch(err => console.log(err));
      })
      .catch(err => {
        // duplicate exists. print out an error
        if (err) console.log(err.message, err.record);
      });
  })

  return router;
}
