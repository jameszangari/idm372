module.exports = function (req, res) {
    const firebase = require('../firebase'),
        imageDataURI = require('image-data-uri'),
        fs = require('fs'),
        data = req.body;

    const
        docRef = firebase.db().collection('users').doc(data.uuid),
        photos = data.values.photos;

    // Push data to FireStore
    if (photos) {
        const dbObj = data.values.dbObj;

        updateUser(dbObj, false);

        let i = 0;
        Object.keys(photos).forEach(key => {
            i++;

            const
                URI = photos[key],
                ext = URI.split('data:image/').pop().split(';')[0],
                fileName = data.uuid + '-' + key + '.' + ext;

            const filePath = `public/images/temp/${fileName}`;

            imageDataURI.outputFile(URI, filePath).then(() => {
                uploadFile(filePath, fileName, key);
            }).catch((error) => { console.log(error); res.send(false); });
        });

        const uploadFile = async (filePath, fileName, key) => {
            const { Storage } = require('@google-cloud/storage');
            const storage = new Storage();
            const bucketName = 'gs://shuffle-devtest.appspot.com/';
            await storage.bucket(bucketName).upload(filePath, {
                gzip: true,
                metadata: {
                    cacheControl: 'no-cache',
                }
            }).then((response) => {
                fs.unlinkSync(filePath);

                firebase.getStorageURL(fileName).then((URL) => {
                    addLinksToUser(key, URL[0]);
                }).catch((error) => { console.log(error); res.send(false); });

            }).catch((error) => { console.log(error); res.send(false); });
        }

        let i2 = 0;
        function addLinksToUser(key, URL) {
            // Adds links to the user doc
            docRef.update({ [key]: URL }).then(() => {
                i2++
                i2 == Object.keys(photos).length && res.send(true);
            }).catch(function (error) { console.error(error); res.send(false); });
        }
    } else {
        updateUser(data.values, true);
    }

    function updateUser(dataObj, sendMode) {
        docRef.update(dataObj).then(() => {
            sendMode && res.send(true);
        }).catch(function (error) { console.error(error); res.send(false); });
    }
}