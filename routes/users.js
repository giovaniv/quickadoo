'use strict';
const express = require('express');
const router = express.Router();
const { checkRecord, insertRecords } = require('../libs/query-helpers');
const generateRandomString = require('../libs/makeRandomId');

module.exports = knex => {
  // root. redirect to /home with http status of 302
  router.get('/', (req, res) => {
    res.status(302).redirect('/home');
  });

  // landing page. render index.ejs (home page)
  router.get('/home', (req, res) => {
    res.render('index');
  });

  // 'click to start' btn on /home renders event.ejs
  router.get('/events', (req, res) => {
    res.render('event');
  });

  // event_id can be either admin_url (only admin knows it) or poll_url (public)
  router.get('/events/:event_id', (req, res) => {
    // use event_id to see if there is a corresponding event saved in psql
    const { event_id } = req.params;

    knex.select('*').from('events')
      .where(function () {
        this.where('admin_url', event_id).orWhere('poll_url', event_id)
      })
      .then(rows => {
        // if rows.length = 0 => there is no event in the database
        // render index.ejs with an error message
        if (!rows.length) {
          res.status(400).render('index', {
            message: "Sorry, we couldn't find the poll you requested :("
          });
        }
        // if event_id === admin_url, usere is an admin.
        // Render event.ejs for the admin
        if (rows.admin_url === event_id) {
          res.status(200).render('event');
        } else {
          // event_id === poll_url. Render event.ejs for attendees
          res.status(200).render('event');
        }
      })
      .catch(err => console.log(err));
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
    // update neccessary tables to save event data
    // user data
    const { first_name, last_name, email } = req.body;
    const { title, description } = req.body;

    const user = { first_name, last_name, email };
    const event = { title, description };
    event.admin_url = generateRandomString(7);
    event.poll_url = generateRandomString(7);

    const option = {
      'name': req.body['name-1'],
      'start_time': req.body['start_time-1'],
      'end_time': req.body['end_time-1']
    };
    console.log(user);
    // console.log(event);
    // console.log(option);

    checkRecord(knex, user, 'users')
      .then(()=>{
        console.log('not exist');
        //     // record doesn't exist. insert the data
        //     insertRecords(knex, table, req.body)
        //       .then(result => console.log(result))
        //       .catch(err => console.log(err));
      })
      .catch(err => {
        // duplicate exists. print out an error
        if (err) console.log(err.message, err.record);
      })
    // redirect to /events/:event_id where event_id === admin_url so that admin page loads up
    // const table = 'users';
    // // test run
    // // const { name } = req.body;
    // checkRecord(knex, req.body, table)
    //   .then(() => {
    //   })
    //   .catch(err => {
    //   });
  })


  return router;
}