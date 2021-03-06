module.exports = function (req, res) {
    const
        request = require('request'),
        config = require('../../../secret/config'),
        data = req.query,
        criteria = data.query,
        access_token = data.access_token,
        refresh_token = data.refresh_token,
        searchcategory = data.searchcategory;

    search(criteria, access_token, refresh_token, (error, response, body) => {
        if (error) { // General Error
            console.error(error);
            return res.send(false);
        } else if (response.statusCode != 200) { // Error Codes
            const errCode = response.statusCode;
            newRefreshToken();
            errCode === 401 && res.sendStatus(errCode); // Token expired, re-log in from start
            return;
        } else { // Success
            const
                obj = JSON.parse(body),
                items = obj[searchcategory + 's'].items; // Makes the obj items an array

            let
                tracks = [],
                i = -1;
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
            } else if (searchcategory === 'playlist') {
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
    function search(query, access_token, refresh_token, callback) {
        const options = {
            url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${searchcategory}&limit=10`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            }
        };
        request(options, callback);
    }

    function newRefreshToken() {
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': 'Basic ' + (Buffer.from(config.client_id + ':' + config.client_secret).toString('base64')) },
            form: {
                grant_type: 'refresh_token',
                refresh_token: req.query.refresh_token
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                res.send({ access_token: body.access_token });
            } else {
                console.error('Error while getting new access token: ' + response.statusCode, error);
            }
        });
    };
}