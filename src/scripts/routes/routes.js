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
    "users",
    "connected",
  ];

  routes.forEach(route => {
    app.get(endpoints[route].url, require('./' + route));
  });

  const pages = [
    "tos",
    "privacy",
    "registerConnected",
    "registerProfile",
    "registerAnthem",
    "registerArtist",
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
        bodyclassName: endpoints[page].bodyclassName,
      });
    });
  });
};