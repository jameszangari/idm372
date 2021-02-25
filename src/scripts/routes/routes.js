const express = require("express");
const firebase = require('../firebase'); // FireBase Functions

module.exports = function (app) {
  const endpoints = require('../config/endpoints.json');

  firebase.init();
  app.use(express.json());

  const routes = [
    "authorize",
    "callback",
    "connected",
    "home",
    "login",
    "refreshToken",
    "search",
    "update",
    "users",
    "connected",
    "chat",
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
    "registerPlaylist",
    "registerImages",
    "registerBio",
    "registerLookingFor",
    "browse",
    "chatBrowse",
    "chatView",
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