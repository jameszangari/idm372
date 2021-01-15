const endpoints = require('../config/endpoints.json');
module.exports = function(req, res) {
  const spotifyObjectString = req.cookies ? req.cookies['spotify'] : null;
  // TODO: Redirect user if they're logged in
  // if (spotifyObjectString) {
  //   var pageTitle = endpoints.home.title;
  //   res.render(endpoints.home.page, {
  //       pageTitle: pageTitle,
  //       endpoints: endpoints
  //   });
  // } else {
  //   return res.redirect(endpoints.login.url);
  // }
  return res.redirect(endpoints.login.url);
}