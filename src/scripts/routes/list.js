const firebase = require('../firebase'); // FireBase Functions

module.exports = async function (req, res) {
    // quickRefs
    const data = req.query;
    const users = [];

    const snapshot = await firebase.db().collection('users')
        .where('new_user', '==', false) // Only include complete profiles
        .get();
    snapshot.forEach((doc) => {
        if (doc.id != data.uuid) { // Don't include the user performing the query
            users.push(doc.data());
            console.log(doc.id);
        }
    });
    res.send(users);
}