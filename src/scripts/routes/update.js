const firebase = require('../firebase'); // FireBase Functions

module.exports = function (req, res) {
    // quickRefs
    const data = req.query;
    // Push data to FireStore
    firebase.db().collection('users').doc(data.uuid).update(data.values).then(() => {
        res.send(true);
    }).catch(function (error) {
        console.error(error);
        res.send(error);
    });
}