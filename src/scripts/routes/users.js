const firebase = require('../firebase'); // FireBase Functions
const endpoints = require('../config/endpoints');

function logout(res) {
    res.clearCookie('shuffle');
    res.redirect(endpoints.pages.login.url);
}

module.exports = async function (req, res) {
    // quickRefs
    const data = req.query;
    const users = [];
    const shuffleCookie = JSON.parse(req.cookies.spotify);

    // Queries
    if (data.query == 'all-users') {
        async function queryAll() {
            const
                query1 = firebase.db().collection('users')
                    .where('profileComplete', '==', true) // Only include completed profiles
                    .get(),
                query2 = firebase.db().collection('users')
                    .where('profileComplete', '==', 'true') // Only include completed profiles
                    .get(),

                [query1Snapshot, query2Snapshot] = await Promise.all([query1, query2]);

            const query1Array = query1Snapshot.docs;
            const query2Array = query2Snapshot.docs;

            return query1Array.concat(query2Array);
        }

        queryAll().then(results => {
            for (let i = 0; i < results.length; i++) {
                if (results[i].id != data.uuid) { // Don't include the user performing the query
                    // Truncate sensitive data, don't want this stuff going to clients
                    const data = results[i].data();
                    delete data.email;
                    delete data.profileComplete;
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
    } else if (data.query == 'delete-user') {
        if (shuffleCookie.uuid == data.target) {
            const docRef = firebase.db().collection('users').doc(data.target);
            docRef.delete().then(() => {
                console.log(`Deleted user: ${data.uuid}`);
                logout(res);
            }).catch((error) => {
                console.error('Error deleting user document: ', error);
                res.send(false);
            });
        }
    } else if (data.query == 'logout') {
        logout(res);
    } else if (data.query == 'check-user-validity') {
        firebase.isUserValid(shuffleCookie.uuid).then((validity) => {
            validity == true ? res.send(true) : res.send(false);
        }).catch((error) => { console.log(error); res.send(false); });
    }
}