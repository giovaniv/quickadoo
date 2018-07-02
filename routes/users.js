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

    getEventRecord(knex, url)
      .then(stats => {
        //console.log(stats);
        if (url === stats.eventRecord[0].admin_url) {
          //console.log('render admin page');
          res.status(200).render('event', { formData: stats.eventRecord });
        } else {
          //console.log('poll');
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

  //check if email exists and if exists, returns voters info
  router.post('/voters', (req, res) => {
    const { email } = req.body;
    knex.raw('select * from users where email = ?', email)
      .then(result => {
        if (result.rowCount) {
          knex.raw('select * from option_voters where person_id = ?', result.rows[0].id)
            .then(lines => {
              const myOptions = [];
              for (let i = 0; i < lines.rows.length; i++) {
                myOptions.push(lines.rows[i].option_id);
              }
              res.status(200).send({
                attendee: result.rows[0],
                options: myOptions
              });
            });
        }
      });
  });

  router.post('/events/:event_id/vote', (req, res) => {
    // fields that we need
    const { voter_first_name, voter_last_name, voter_email, poll_url, poll_info } = req.body;
    // let path = "/events/" + poll_url;

    // check if the fields have some value
    if (!voter_email || !voter_first_name || !voter_last_name) {
      res.status(302).render('poll', {
        poll: JSON.parse(poll_info), message: 'Please fill your e-mail and name'
      });
    }

    // function to filter keys in a object and return the values of this filter
    let filterValues = (obj, filter) => {
      let key, keys = []
      for (key in obj) {
        if (obj.hasOwnProperty(key) && filter.test(key)) {
          keys.push(obj[key])
        }
      }
      return keys
    }

    // we filter all the keys 'option?' where ? is any number
    // and we return all the options_id that the user selected
    let filteredOptions = filterValues(req.body, /option/);


    // 1 - check if the user exists
    // 1.1 - If user not exists, insert user and user votes
    // 1.2 - If user exists, delete all user votes and insert the new votes again
    // 2 - redirect to the same place

    // 1 - check if the user exists
    knex.raw('select * from users where email = ?', voter_email)
      .then(function (result) {

        // 1.1 - If user not exists, insert user and user votes
        if (!result.rowCount) {
          let myData = {
            first_name: voter_first_name,
            last_name: voter_last_name,
            email: voter_email
          }
          knex('users')
            .returning('id')
            .insert(myData)
            .then(function (result) {
              let myID = result[0];
              // new options
              filteredOptions.forEach(function (option) {
                knex.raw(`insert into option_voters (option_id, person_id) values (${option},${myID})`)
                  .catch(function (err) {
                    console.log(err);
                  })
              });
            })
            .catch(function (err) {
              console.log(err);
            })
        } else {
          // 1.2 - If user exists, delete all user votes and insert the new votes again
          const id = result.rows[0].id;
          knex('option_voters').where('person_id', id).del()
            .catch(function (err) {
              console.log(err);
            })
          // new options
          filteredOptions.forEach(function (option) {
            knex.raw(`insert into option_voters (option_id, person_id) values (${option},${id})`)
              .catch(function (err) {
                console.log(err);
              })
          });
        }

        // 2 - redirect to the thanks page
        res.status(200).render('thanks', { url: poll_url });

      });

    return;

  });
  // ==================================================
  // End of change by Giovani
  // ==================================================

  return router;
};