
function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

module.exports = {
  init: function () {
    this.generateRandomString();
    this.getCookie();
    this.getAge();
    this.rm_events();
    this.truncateString();
    this.getUrlParam();
    this.getThread();
  },

  /** Generates a random string containing numbers and letters
   * @param  {number} length // The length of the string
   * @return {string} // The generated string
   */
  generateRandomString: function (length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },

  getCookie: getCookie,

  shuffleCookie: function () {
    const
      endpoints = require('./config/endpoints.json'),
      // Get the Cookie

      cookieString = getCookie('shuffle') || null,
      cookieObj = JSON.parse(cookieString) || null,

      noCookieNeededPages = [
        endpoints.pages.login.url,
        endpoints.pages.tos.url,
        endpoints.pages.privacy.url,
      ];

    if (!cookieString && !noCookieNeededPages.includes(window.location.pathname)) {
      // Redirect to login if there's no spotify cookie AND you are on a page that needs it
      window.location.href = endpoints.pages.login.url + '?noCookieFound=true';
    } else {
      // Return the Cookie
      return cookieObj;
    }
  },

  encodeCookie: function (cname, cstring) {
    let encodedString = encodeURIComponent(cstring);
    let encodedCookie = cname + '=' + encodedString;
    return cstring;
  },

  getAge: function (dob) { // dob param should be date-input.value (do not format it)
    const Bday = new Date(dob);
    const age = Math.floor((Date.now() - Bday) / (31557600000));
    return age;
  },

  rm_events: function (object, hard_rm) {
    // hard_rm param should be false for JQuery events, true for Vanilla JS events
    // Always try using false first, if event duplicates, try a JQuery event, if still duping, try true
    $(object).off('click');
    $(object).unbind('click');
    $(object).unbind('change');
    if (hard_rm) { // If hard_rm === true
      // This physically replaces the object to force remove all events
      const old_e = docQ(object);
      const new_e = old_e.cloneNode(true);
      old_e.parentNode.replaceChild(new_e, old_e);
    }
  },

  truncateString: function (str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  },

  getUrlParam: function (param) { // Param should be a string
    const
      location = window.location.href,
      url = new URL(location);
    return url.searchParams.get(param);
  },

  getThread: function (uuid1, uuid2) {
    // Determines what the thread_id will be based on the two uuid's supplied
    let thread_id;
    uuid1 > uuid2 ? thread_id = uuid1 + '-' + uuid2 : thread_id = uuid2 + '-' + uuid1;
    return 'thread-' + thread_id;
  },

  millisToMinutesAndSeconds: function (millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  },

  unixToFromNow: function (unix) {
    const moment = require('moment');
    return moment.unix(unix).fromNow();
  }
}