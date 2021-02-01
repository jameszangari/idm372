const express = require("express");
const firebase = require('../firebase'); // FireBase Functions

module.exports = function (app) {
  const endpoints = require('../config/endpoints.json');

  firebase.init();
  app.use(express.json());
<<<<<<< Updated upstream
=======
  app.get(endpoints.home.url, require("./home"));
  app.get(endpoints.login.url, require("./login"));
  app.get(endpoints.authorize.url, require('./authorize'));
  app.get(endpoints.callback.url, require('./callback'));
  app.get(endpoints.search.url, require('./search'));
  app.get(endpoints.update.url, require('./update'));
  app.get(endpoints.connected.url, require('./connected'));

  // Connected Page
  app.get(endpoints.registerConnected.url, function (req, res) {
    // console.log(req, res);
    res.render(endpoints.registerConnected.page, {
      pageTitle: endpoints.registerConnected.title,
      endpoints: endpoints,
    });
  });

  // Profile Page
  app.get(endpoints.registerProfile.url, function (req, res) {
    res.render(endpoints.registerProfile.page, {
      pageTitle: endpoints.registerProfile.title,
      endpoints: endpoints,
    });
  });

  // Song Page
  app.get(endpoints.registerSong.url, function (req, res) {
    res.render(endpoints.registerSong.page, {
      pageTitle: endpoints.registerSong.title,
      endpoints: endpoints,
    });
  });

  // Album Page
  app.get(endpoints.registerAlbum.url, function (req, res) {
    res.render(endpoints.registerAlbum.page, {
      pageTitle: endpoints.registerAlbum.title,
      endpoints: endpoints,
    });
  });
>>>>>>> Stashed changes

  const routes = [
    "home",
    "login",
    "authorize",
    "callback",
    "search",
    "update",
    "users",
  ];

  routes.forEach(route => {
    app.get(endpoints[route].url, require('./' + route));
  });

  const pages = [
    "tos",
    "privacy",
    "registerConnected",
    "registerProfile",
    "registerSong",
    "registerAlbum",
    "registerPlaylist",
    "registerImages",
    "registerBio",
    "registerActivities",
    "registerLookingFor",
    "browse",
    "profile",
  ];

  pages.forEach(page => {
    app.get(endpoints[page].url, function (req, res) {
      res.render(endpoints[page].page, {
        pageTitle: endpoints[page].title,
        endpoints: endpoints,
      });
    });
  });
<<<<<<< Updated upstream
=======

  // Images Page
  app.get(endpoints.registerImages.url, function (req, res) {
    res.render(endpoints.registerImages.page, {
      pageTitle: endpoints.registerImages.title,
      endpoints: endpoints,
    });
  });

  // Bio Page
  app.get(endpoints.registerBio.url, function (req, res) {
    res.render(endpoints.registerBio.page, {
      pageTitle: endpoints.registerBio.title,
      endpoints: endpoints,
    });
  });

  // Activities Page
  app.get(endpoints.registerActivities.url, function (req, res) {
    res.render(endpoints.registerActivities.page, {
      pageTitle: endpoints.registerActivities.title,
      endpoints: endpoints,
    });
  });

  // Looking For Page
  app.get(endpoints.registerLookingFor.url, function (req, res) {
    res.render(endpoints.registerLookingFor.page, {
      pageTitle: endpoints.registerLookingFor.title,
      endpoints: endpoints,
    });
  });
>>>>>>> Stashed changes
};