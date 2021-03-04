module.exports = function (app) {
  const express = require('express');
  const firebase = require('../firebase'); // FireBase Functions
  const endpoints = require('../config/endpoints.json');

  firebase.init();
  app.use(express.json());

  app.get('/', function (req, res) {
    res.redirect(endpoints.pages.login.url);
  });

  const routes = endpoints.routes;
  Object.keys(routes).forEach(route => {
    const url = routes[route].url;
    const method = routes[route].method || 'get'; // Get is default
    app[method](url, require('.' + url));
  });

  const pages = endpoints.pages;
  Object.keys(pages).forEach(page => {
    app.get(pages[page].url, function (req, res) {
      res.render(pages[page].page, {
        pageTitle: pages[page].title,
        endpoints: endpoints,
        bodyclassName: pages[page].bodyclassName,
      });
    });
  });
};