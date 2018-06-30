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
        // render event.ejs for the admin
        if (rows[0].admin_url === event_id) {
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
      'start_time': req.body['start_time-1'] ? req.body['start_time-1'] : null,
      'end_time': req.body['end_time-1'] ? req.body['end_time-1'] : null,
      'note': req.body['note-1']
    };

    // 1. check user record
    checkRecord(knex, user, 'users')
      // if user doesn't exist in users tb, add the new user
      .then(() => {
        console.log("user doesn't exist in db. adding user...");
        return insertRecords(knex, 'users', user);
      })
      // if user exists in db. retrieve the user_id
      .catch(duplicate => {
        console.log('user exists in db. retrieving user_id');
        return duplicate.record[0].id;
      })
      // insert the user_id & the event record in events tb
      .then(creator_id => {
        console.log('user added!');
        event.creator_id = creator_id;
        return insertRecords(knex, 'events', event)
      })
      // upon success, append the new event row's unique id (event_id) to the options object
      // then insert the options data into options tb
      .then(result => {
        console.log(result.message);
        option.event_id = result.rowId[0];
        return insertRecords(knex, 'options', option);
      })
      // if inserting event record was UNSUCCESSFUL, display error message
      .catch(err => console.log(err.message))
      // if options were added to options tb, display a success message
      .then(result => {
        console.log(result.message);
        // redirect user to the admin page!
        const adminPage = `/events/${event.admin_url}`;
        res.redirect(adminPage);
      })
      // if inserting options was UNSUCCESSFUL, display error message
      .catch(err => console.log(err));
  });



  router.get('/events/:event_id/thanks', (req, res) => {
    //res.render('thanks',req.params.event_id);
    res.render('thanks');
  });


  return router;
}