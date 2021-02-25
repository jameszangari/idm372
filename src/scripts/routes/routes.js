const express = require('express');
const firebase = require('../firebase'); // FireBase Functions

module.exports = function (app) {
  const endpoints = require('../config/endpoints.json');

  firebase.init();
  app.use(express.json());

  const routes = [
    'login',
    'authorize',
    'callback',
    'connected',
    'refreshToken',
    'search',
    'update',
    'users',
    'chat',
  ];
  
  routes.forEach(route => {
    app.get(endpoints[route].url, require('./' + route));
  });
  
  const pages = [
    'home',
    'tos',
    'privacy',
    'registerProfile',
    'registerAnthem',
    'registerPlaylist',
    'registerGenres',
    'registerConnected',
    'registerLookingFor',
    'registerBio',
    'registerImages',
    'browse',
    'chatBrowse',
    'chatView',
  ];

  pages.forEach(page => {
    app.get(endpoints[page].url, function (req, res) {
      res.render(endpoints[page].page, {
        pageTitle: endpoints[page].title,
        endpoints: endpoints,
        bodyclassName: endpoints[page].bodyclassName,
      });
    });
  });
};