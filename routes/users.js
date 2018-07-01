'use strict';
const express = require('express');
const router = express.Router();
const { updateFormData, generateRandomString, capitaliseFirstLetter } = require('../libs/query-helpers');

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

    const checkExistingEvent = (knex, event_id) => {
      return new Promise((resolve, reject) => {
        knex.select('*').from('options')
        .join('events', 'options.event_id', 'events.id')
        .join('users', 'events.creator_id', 'users.id')
          .where(function () {
            this.where('events.admin_url', event_id).orWhere('events.poll_url', event_id)
          })
          .then(eventRecord => {
            resolve(eventRecord);
          })
          .catch(err => {
            reject(err);
          })
      })
    };

    async function getEventRecord(knex, event_id) {
      const eventRecord = await checkExistingEvent(knex, event_id);
      return eventRecord;
    }

    getEventRecord(knex, event_id)
      .then(formData => {
        if(event_id === formData[0].admin_url){
          res.status(200).render('admin',{ poll: formData });
        }else{
          res.status(200).render('poll',{ poll: formData });
        }
      })
      .catch(err => {
        console.log(err);
      })
    // knex.select('*').from('events')
    //   .where(function () {
    //     this.where('admin_url', event_id).orWhere('poll_url', event_id)
    //   })
    //   .then(rows => {
    //     // if rows.length = 0 => there is no event in the database
    //     // render index.ejs with an error message
    //     if (!rows.length) {
    //       res.status(400).render('index', {
    //         message: "Sorry, we couldn't find the poll you requested :("
    //       });
    //     }
    //     // if event_id === admin_url, usere is an admin.
    //     // render event.ejs for the admin
    //     if (rows[0].admin_url === event_id) {
    //       res.status(200).render('event');
    //     } else {
    //       // event_id === poll_url. Render event.ejs for attendees
    //       res.status(200).render('event');
    //     }
    //   })
    //   .catch(err => console.log(err));
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

    updateFormData(knex, user, event, formValues).then(ids => {
      console.log('update complete', ids);
      const admin_page = `/events/${event.admin_url}`;
      res.redirect(admin_page);
    }).catch(err => {
      console.log(err);
    });
  })


  // ==================================================
  // Start of change by Giovani
  // ==================================================
  router.post('/events/:event_id/vote', (req, res) => {
    //console.log(req.body);
    let event_id = req.body.event_id;
    let person_id = req.body.person_id;
    let voter_first_name = req.body.voter_first_name;
    let voter_last_name = req.body.voter_last_name;
    let voter_email = req.body.voter_email;
    console.log(event_id, person_id, voter_first_name, voter_last_name, voter_email);

    // 1 - check if the user exists
    // 1.1 - If exists, delete all options in option_voters table
    // 1.1.1 - Insert the new options of this user
    // 1.2 - If user not exists, insert user and options
    // 2 - redirect to the same place

    // //We delete all options that this user voted and
    // //after that we insert the new votes from him
    // //and after that we redirect to the same page
    // knex('option_voters')
    // .where('person_id', 13)
    // .del().then(function(){
    //   knex.insert({option_id:1, person_id:15})
    //   .into('option_voters')
    //   .then(function(){

    //   });
    // });

    return;
  });
  // ==================================================
  // End of change by Giovani
  // ==================================================

  return router;
}