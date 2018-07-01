'use strict';
const express = require('express');
const router = express.Router();
const { getEventRecord, updateFormData, generateRandomString, capitaliseFirstLetter } = require('../libs/query-helpers');

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

  // url can be either admin_url (only admin knows it) or poll_url (public)
  router.get('/events/:url', (req, res) => {
    // use url to see if there is a corresponding event saved in psql
    const { url } = req.params;

    // check if url is admin_url or public url and render pages accordingly
    getEventRecord(knex, url)
      .then(stats => {
        if (url === stats.eventRecord[0].admin_url) {
          res.status(200).render('event', { formData: stats.eventRecord });
        } else {
          res.status(200).render('poll', { poll: stats });
        }
      })
      .catch(err => {
        console.log(err);
      })
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
      created_at: new Date(Date.now()),
      admin_url: generateRandomString(7),
      poll_url: generateRandomString(7)
    };


    // update form data to appropriate tables
    updateFormData(knex, user, event, formValues).then(ids => {
      console.log('update complete', ids);

      res.status(200).send({
        admin_url: event.admin_url,
        poll_url: event.poll_url
      });
    }).catch(err => {
      console.log(err);
    });
  })


  // ==================================================
  // Start of change by Giovani
  // ==================================================
  router.post('/events/:event_id/vote', (req, res) => {
    console.log(req.body);
    let voter_first_name = req.body.voter_first_name;
    let voter_last_name = req.body.voter_last_name;
    let voter_email = req.body.email;
    return;
  });
  // ==================================================
  // End of change by Giovani
  // ==================================================

  return router;
}