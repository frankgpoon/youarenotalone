const functions = require('firebase-functions');
var admin = require("firebase-admin");

var serviceAccount = require("serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://not-alone-183705.firebaseio.com"
});

// Helper Functions

function getHTML(topic) {
    var head = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>You Are Not Alone - #` + topic + `</title>
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    `;
    var body = `
    <body>
        <h1>The current topic shown is ` + topic + `. If it is the same as the path, your code is working correctly.</h1>
    </body>
    </html>
    `;
    return head + body;
}

exports.load = functions.https.onRequest((req, res) => {
    // check if topic exists in database
    // if not then create topic


    // use getHTML function to load entries

    // req.url has the path in "/path" form, so need to substring by 1
    var topic = req.url.substring(1);
    if (topic !== 'add') {
        res.status(200).send(
            getHTML(topic)
        );
    }
})
