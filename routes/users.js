'use strict';
const express = require('express');
const router = express.Router();
const { checkRecord, insertRecords, generateRandomString, capitaliseFirstLetter, parseOptions } = require('../libs/query-helpers');

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
    // Note: form is validated on the client side
    const formValues = JSON.parse(Object.keys(req.body)[0]);

    // user data
    let { first_name, last_name, email } = formValues;
    // make sure first letter of name is capitalised
    first_name = capitaliseFirstLetter(first_name);
    last_name = capitaliseFirstLetter(last_name);
    const user = { first_name, last_name, email };
    // event data

    const { title, description } = formValues;
    const event = {
      title,
      description,
      created_at: new Date(),
      admin_url: generateRandomString(7),
      poll_url: generateRandomString(7)
    };

    // options: calculate how many options were returned
    // # of returned options = (# of total fields - 5) / 4
    // 5: (3 user data fields, 2 event data fields))
    // 4: (4 option fields)
    const optionFields = ['name', 'start_time', 'end_time', 'note'];
    const optionLen = (Object.keys(formValues).length - 5) / optionFields.length;


    // 1. check user record




    // // 1. check user record
    // checkRecord(knex, user, 'users')
    //   // if user doesn't exist in users tb, add the new user
    //   .then(() => {
    //     console.log("user doesn't exist in db. adding user...");
    //     return insertRecords(knex, 'users', user);
    //   })
    //   // if user exists in db. retrieve the user_id
    //   .catch(duplicate => {
    //     console.log('user exists in db. retrieving user_id');
    //     return duplicate.rowId;
    //   })
    //   // insert the user_id & the event record in events tb
    //   .then(creator_id => {
    //     event.creator_id = creator_id;
    //     return insertRecords(knex, 'events', event)
    //   })
    //   // upon success, append the new event row's unique id (event_id) to the options object
    //   // then insert the options data into options tb
    //   .then(result => {
    //     console.log(1);
    //     console.log('event added!');
    //     console.log(result.message);
    //     // const optionInputs = parseOptions(formValues, optionLen, optionFields, result.rowId[0]);
    //     // return insertRecords(knex, 'options', optionInputs);
    //   })
    //   // if inserting event record was UNSUCCESSFUL, display error message
    //   .catch(err => {
    //     console.log(2);
    //     console.log(err.message);
    //   })
      // // if options were added to options tb, display a success message
      // .then(result => {
      //   console.log(result.message);
      //   // redirect user to the admin page!
      //   const adminPage = `/events/${event.admin_url}`;
      //   res.redirect(adminPage);
      // })
      // // if inserting options was UNSUCCESSFUL, display error message
      // .catch(err => console.log(err));
  })


  return router;
}