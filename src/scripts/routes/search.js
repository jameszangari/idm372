const request = require('request');

module.exports = function (req, res) {
    const data = req.query,
        criteria = data.query,
        token = data.access_token,
        searchcategory = data.searchcategory;

    search(criteria, token, (error, response, body) => {
        if (error) { // General Error
            console.error(error);
            res.send(false);
            return;
        } else if (response.statusCode != 200) { // Error Codes
            const errCode = response.statusCode;
            errCode === 401 && res.sendStatus(errCode); // Token expired, re-log in from start
            return;
        } else { // Success
            obj = JSON.parse(body);
            items = obj[searchcategory + 's'].items; // Makes the obj items an array

            let tracks = [];
            let i = -1;
            if (searchcategory === 'track') {
                items.forEach(item => { // Loop thru each result and push the info we want into the tracks array
                    if (!item.id || !item.name || !item.artists[0] || !item.album.images[0] || !item.album.name) { return }
                    i++;
                    tracks.push(i, {
                        'id': item.id,
                        'title': item.name,
                        'artist': item.artists[0].name,
                        'thumb': item.album.images[0].url,
                        'album': item.album.name
                    });
                });
            } else if (searchcategory === 'artist') {
                items.forEach(item => { // Loop thru each result and push the info we want into the tracks array
                    if (!item.images[0] || !item.id || !item.name) { return }
                    i++;
                    tracks.push(i, {
                        'id': item.id,
                        'title': item.name,
                        'thumb': item.images[0].url,
                        'album': false
                    });
                });
            }
            else if (searchcategory === 'playlist') {
                items.forEach(item => { // Loop thru each result and push the info we want into the tracks array
                    if (!item.id || !item.name || !item.owner.display_name || !item.images[0]) { return }
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

    // Return the results from spotify api for search
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