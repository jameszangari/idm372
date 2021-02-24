const firebase = require('../firebase'); // FireBase Functions

module.exports = async function (req, res) {
    // quickRefs
    const data = req.query;
    const users = [];

    // Queries
    if (data.query == 'all-users') {
        const snapshot = await firebase.db().collection('users')
            .where('new_user', '==', false) // Only include completed profiles
            .get();
        snapshot.forEach((doc) => {
            if (doc.id != data.uuid) { // Don't include the user performing the query
                // Truncate sensitive data, don't want this stuff going to clients
                const data = doc.data();
                delete data.country;
                delete data.email;
                delete data.new_user;
                data.pronouns == 'a' && delete data.pronouns;
                // Add to array
                users.push({
                    uuid: doc.id,
                    data: data
                });
            }
        });
        res.send(users);
    } else if (data.query == 'single-user') {
        const snapshot = await firebase.db().collection('users').doc(data.target).get();
        res.send({
            uuid: snapshot.id,
            data: snapshot.data()
        });
    }
}