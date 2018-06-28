'use strict';
const express = require('express');
const router = express.Router();
const { checkRecord, insertRecords } = require('../libs/query-helpers');

module.exports = knex => {
  // root. redirect to /home with http status of 302
  router.get('/', (req, res) => {
    res.status(302).redirect('/home');
  });

  // landing page. render index.ejs (home page)
  router.get('/home', (req, res) => {
    res.render('index');
  });

  // 'click to start' btn on /home renders events.ejs
  router.get('/events', (req, res) => {
    res.render('events');
  });

  // admin page
  router.get('/events/:event_id/users/:user_id', (req, res) => {
    // use event_id to getthe event data from psql
    // and check if the event owner is the same is user_id
    const { event_id, user_id } = req.params;
    console.log(req.params);
  });

  router.get("/api/users", (req, res) => {
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