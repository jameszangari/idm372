const firebase = require('../firebase'); // FireBase Functions

module.exports = function (req, res) {
    // quickRefs
    const data = req.query;
    const docRef = firebase.db().collection('users').doc(data.uuid);
    // Push data to FireStore
    docRef.update(data.values).then(() => {
        res.send(true);
    }).catch(function (error) {
        console.error(error);
        res.send(false);
    });
}