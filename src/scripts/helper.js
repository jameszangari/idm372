module.exports = {
    init: function() {
      
      this.generateRandomString();
      this.getCookie();
      this.getAge();
      this.rm_events();
      this.truncateString();

    },

    /** Generates a random string containing numbers and letters
      * @param  {number} length // The length of the string
      * @return {string} // The generated string
    */
    generateRandomString: function (length) {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    },

    getCookie: function (cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },

    getAge: function (dob) { // dob param should be date-input.value (do not format it)
      var year = Number(dob.substr(0, 4));
      var month = Number(dob.substr(4, 2)) - 1;
      var day = Number(dob.substr(6, 2));
      var today = new Date();
      var age = today.getFullYear() - year;
      today.getMonth() < month || (today.getMonth() == month && today.getDate() < day) && age--
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
    }
}