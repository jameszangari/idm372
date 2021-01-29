const express = require("express");
const firebase = require('../firebase'); // FireBase Functions

module.exports = function (app) {
  const endpoints = require('../config/endpoints.json');

  firebase.init();
  app.use(express.json());

  const routes = [
    "home",
    "login",
    "authorize",
    "callback",
    "search",
    "update",
    "list",
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
  ];

  pages.forEach(page => {
    app.get(endpoints[page].url, function (req, res) {
      res.render(endpoints[page].page, {
        pageTitle: endpoints[page].title,
        endpoints: endpoints,
      });
    });
  });
};