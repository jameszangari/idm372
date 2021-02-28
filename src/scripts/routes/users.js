const firebase = require('../firebase'); // FireBase Functions

module.exports = async function (req, res) {
    // quickRefs
    const data = req.query;
    const users = [];

    // Queries
    if (data.query == 'all-users') {
        async function queryAll() {
            const
                query1 = firebase.db().collection('users')
                    .where('new_user', '==', false) // Only include completed profiles
                    .get(),
                query2 = firebase.db().collection('users')
                    .where('new_user', '==', 'false') // Only include completed profiles
                    .get(),

                [
                    query1Snapshot,
                    query2Snapshot
                ] = await Promise.all([query1, query2]);

            const query1Array = query1Snapshot.docs;
            const query2Array = query2Snapshot.docs;

            return query1Array.concat(query2Array);
        }

        queryAll().then(results => {
            for (i = 0; i < results.length; i++) {
                // console.log(results[i].data());
                console.log(i, results.length);
                if (results[i].id != data.uuid) { // Don't include the user performing the query
                    // Truncate sensitive data, don't want this stuff going to clients
                    const data = results[i].data();
                    delete data.country;
                    delete data.email;
                    delete data.new_user;
                    data.pronouns == 'a' && delete data.pronouns;
                    // Add to array
                    users.push({
                        uuid: results[i].id,
                        data: data
                    });
                }
                i == results.length - 1 && res.send(users); // When done
            }
        });
    } else if (data.query == 'single-user') {
        const snapshot = await firebase.db().collection('users').doc(data.target).get();
        res.send({
            uuid: snapshot.id,
            data: snapshot.data()
        });
    }
}