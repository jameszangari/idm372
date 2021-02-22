const request = require('request');

module.exports = function (req, res) {
    const data = req.query,
        token = data.access_token,
        type = data.type;

    search(token, type, (error, response, body) => {
        if (error) { // General Error
            console.error(error);
            res.send(false);
            return;
        } else if (response.statusCode != 200) { // Error Codes
            const errCode = response.statusCode;
            errCode === 401 && res.sendStatus(errCode); // Token expired, re-log in from start
            return;
        } else { // Success
            obj = JSON.parse(body); //the response from spotify
            const items = obj.items; //response as array
            let thumb;
            let artists = [];
            let tracks = [];
            let data = {
                artists: artists,
                tracks: tracks,
            };
            
            items.forEach(item => { //make your package for frontend
                if (type == 'artists') { //artists and tracks have thumbnail stored different
                    thumb = item.images[0].url;
                } else if (type == 'tracks') {
                    thumb = item.album.images[0].url;
                }
                data[type].push({
                    'id': item.id,
                    'title': item.name,
                    'thumb': thumb,
                    'href': item.external_urls.spotify,
                });
            });
            res.send(data); //send info back to frontend
        }
    });

    // Return the results from spotify api for search
    function search(token, type, callback) {
        let bearerstring = 'Bearer ' + token;
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': bearerstring
        };
        let options = {
            url: `https://api.spotify.com/v1/me/top/${type}?limit=6`,
            headers: headers
        }; //currently hardcoded top 3 responses back, but can get more if needed by changing limit in url
        request(options, callback);
    }
}