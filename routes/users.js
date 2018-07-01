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

  // url can be either admin_url (only admin knows it) or poll_url (public)
  router.get('/events/:url', (req, res) => {
    // use url to see if there is a corresponding event saved in psql
    const { url } = req.params;

    const getEventId = (knex, url) => {
      return new Promise((resolve, reject) => {
        knex.select('id').from('events')
          .where(function () {
            this.where('events.admin_url', url).orWhere('events.poll_url', url)
          }).then(eventId => {
            if (eventId.length) {
              resolve(eventId[0].id);
            } else {
              reject('no event_id found!');
            }
          })
      })
    }

    const checkExistingEvent = (knex, url) => {
      return new Promise((resolve, reject) => {
        knex.select('*', 'options.id as option_id').from('options')
          .join('events', 'options.event_id', 'events.id')
          .join('users', 'events.creator_id', 'users.id')
          .where(function () {
            this.where('events.admin_url', url).orWhere('events.poll_url', url)
          })
          .then(eventRecord => {
            if (eventRecord.length) {
              resolve(eventRecord);
            } else {
              reject('no url found!');
            }
          })
      })
    };


    const countVoters = (knex, event_id) => {
      return new Promise((resolve, reject) => {
        knex.raw(`select option_id, count(person_id) from
        (select id from options where event_id = ${event_id}) as tb1
        join option_voters on tb1.id = option_voters.option_id group by option_id;`)
          .then(result => {
            resolve(result.rows);
          })
      })
    }


    async function getEventRecord(knex, url) {
      const event_id = await getEventId(knex, url);
      const eventRecord = await checkExistingEvent(knex, url);
      const voterCounts = await countVoters(knex, event_id);
      return { eventRecord, voterCounts };
    }

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
  router.post('/atendees', (req, res) => {
    const email = req.body.email;
    const poll = req.body.poll;
    knex.raw('select * from users where email = ?',email)
    .then(function(result){
      if (result.rowCount) {
        // const id = result.rows[0].id;
        //res.status(200).render('poll',{ poll: JSON.parse(poll), atendee: result.rows[0] });
        res.status(200).send({
          poll: JSON.parse(poll),
          atendee: result.rows[0]
        });
      }
    });
  });

  router.post('/events/:event_id/vote', (req, res) => {
 
    // fields that we need
    //console.log(req.body);
    let event_id = req.body.event_id;
    let person_id = req.body.person_id;
    let voter_first_name = req.body.voter_first_name;
    let voter_last_name = req.body.voter_last_name;
    let voter_email = req.body.voter_email;
    let poll_url = req.body.poll_url;

    // function to filter keys in a object and return the values of this filter
    let filterValues = (obj, filter) => {
      let key, keys = []
      for (key in obj)
        if (obj.hasOwnProperty(key) && filter.test(key))
          keys.push(obj[key])
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
    knex.raw('select * from users where email = ?',voter_email)
    .then(function(result){

      // 1.1 - If user not exists, insert user and user votes
      if (!result.rowCount) {
        const myQuery = `insert into users (first_name, last_name, email) `;
        myQuery += `values (${voter_first_name},${voter_last_name},${voter_email})`;
        knex.raw(myQuery)
        .then(function(result){
          console.log(result);
        })
        .catch(function(err){
          console.log(err);
        })
      } else {
        // 1.2 - If user exists, delete all user votes and insert the new votes again
        const id = result.rows[0].id;
        knex('option_voters').where('person_id',id).del()
        .catch(function(err){
          console.log(err);
        })
        // new options
        filteredOptions.forEach(function(option) {
          knex.raw(`insert into option_voters (option_id, person_id) values (${option},${id})`)
          .catch(function(err){
            console.log(err);
          })
        });
      }
      // 2 - redirect to the same place
      let path = "/events/" + poll_url;
      res.status(302).redirect(path);
    });

    return;

  });
  // ==================================================
  // End of change by Giovani
  // ==================================================

  return router;
}