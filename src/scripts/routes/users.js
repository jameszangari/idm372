const firebase = require('../firebase'); // FireBase Functions

module.exports = async function (req, res) {
    // quickRefs
    const data = req.query;
    const users = [];

    // Queries
    if (data.queryCategory == 'all-users') {
        const snapshot = await firebase.db().collection('users')
            .where('new_user', '==', false) // Only include complete profiles
            .get();
        snapshot.forEach((doc) => {
            if (doc.id != data.uuid) { // Don't include the user performing the query
                users.push({
                    uuid: doc.id,
                    data: doc.data()
                });
            }
        });
        res.send(users);
    } else if (data.queryCategory == 'single-user') {
        const snapshot = await firebase.db().collection('users').doc(data.target).get();
        res.send({
            uuid: snapshot.id,
            data: snapshot.data()
        });
    }
}