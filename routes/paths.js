'use strict';
const express = require('express');
const router = express.Router();

module.exports = () => {
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
  })



  return router;
}