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

  // user submits the complete form
  router.post('/events', (req, res) => {
    // update neccessary tables to save event data
    // user data
    const { first_name, last_name, email } = req.body;
    const user = { first_name, last_name, email };

    // event data
    const { title, description } = req.body;
    const event = {
      title,
      description,
      created_at: new Date(),
      admin_url: generateRandomString(7),
      poll_url: generateRandomString(7)
    };

    // options
    const option = {
      'name': req.body['name-1'],
      'start_time': req.body['start_time-1'],
      'end_time': req.body['end_time-1'],
      'note': req.body['note-1']
    };

    // check user record
    checkRecord(knex, user, 'users')
      // user doesn't exist in users tb
      .then(() => {
        console.log('not exist');
      })
      // user exists in db. retrieve the user_id
      .catch(duplicate => {
        console.log('user exists in db. retrieving user_id');
        return duplicate.record[0].id;
      })
      // use the user_id to insert the event record in events tb
      .then(creator_id => {
        event.creator_id = creator_id;
        // insert the event data along with the user id
        return insertRecords(knex, 'events', event)
      })
      .catch(err => console.log(err.message))
      // return the event_id and insert option data with it
      .then(result => {
        console.log(result.message);

        option.event_id = result.rowId[0];
        return insertRecords(knex, 'options', option);
      })
      // print out any error while inserting option data
      .then(result => {
        console.log('1111111111111111111111');
      })
      .catch(err => console.log(err));

  })


  return router;
}