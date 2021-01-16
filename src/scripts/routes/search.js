const request = require('request');

module.exports = function (req, res) {
    const data = req.query,
        criteria = data.query,
        token = data.access_token,
        searchcategory = data.searchcategory;

    search(criteria, token, (error, response, body) => {
        if (error) {
            console.error(error);
            return;
        } else if (response.statusCode != 200) {
            console.error('A Server Error Occurred: Error #' + response.statusCode);
            return;
        } else if (response.statusCode === 401) {
            console.log('Error 401: The user access token expired, try re-logging in.');
            return;
        } else {
            obj = JSON.parse(body);
            items = obj[searchcategory + 's'].items; // Makes the obj items an array

            let tracks = [];
            let i = -1;
            if (searchcategory === 'track') {
                items.forEach(item => { // Loop thru each result and push the info we want into the tracks array
                    i++;
                    tracks.push(i, {
                        'id': item.id,
                        'title': item.name,
                        'artist': item.artists[0].name,
                        'thumb': item.album.images[2].url,
                        'album': item.album.name
                    });
                });
            } else if (searchcategory === 'album') {
                items.forEach(item => { // Loop thru each result and push the info we want into the tracks array
                    i++;
                    tracks.push(i, {
                        'id': item.id,
                        'title': item.name,
                        'artist': item.artists[0].name,
                        'thumb': item.images[2].url,
                        'album': false
                    });
                });
            }
            else if (searchcategory === 'playlist') {
                items.forEach(item => { // Loop thru each result and push the info we want into the tracks array
                    i++;
                    tracks.push(i, {
                        'id': item.id,
                        'title': item.name,
                        'artist': item.owner.display_name,
                        'thumb': item.images[0].url,
                        'album': false
                    });
                });
            }
            res.send(tracks);
        }
    });
    /**
     * return the results from spotify api for search
     */
    function search(criteria, token, callback) {
        let query = criteria;
        let bearerstring = 'Bearer ' + token;
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearerstring
        };
        let options = {
            url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${searchcategory}&limit=10`,
            headers: headers
        };
        request(options, callback);
    }
}