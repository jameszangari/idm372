const endpoints = require('../config/endpoints.json');

module.exports = function(req, res) {
  var pageTitle = endpoints.login.title;
  res.render(endpoints.login.page, {
      pageTitle: pageTitle,
      endpoints: endpoints
  });
}