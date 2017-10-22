const functions = require('firebase-functions');
var admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert({
     projectId: "not-alone-183705",
     clientEmail: "firebase-adminsdk-uakwe@not-alone-183705.iam.gserviceaccount.com",
     privateKey: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCVW6eh9Xo8fB6F\n14XFLpalIDDLnS4f39yERtQMeBQOxw8IYfNLGzKpdmay1Av4o5IowX7V3wNNIqDl\nLhrzS56q4KwM6xAHEyW8ZQtXzQRqz5httiR6mqsTOqEPavmKLdSZezhnFnIQURPI\nUC0KVjWewqpjyup1wcixDRcxE7pVzZmzdwgjXEvLwJkK0LRKH/8FHqyjcfByjaV7\nFhDuLAsFfuC4hAxUojBWgWbFegxgQBqiVdwU9lcdakx+8mQUArgYQID/FCU7XXW6\nEZUHYgjtvFzdLc8HpQ2ExNwJLwKZeS0eUJhR9FJ3Ev7EKpZ1IN8VYf+ANPp6Y2iS\nJMVn588XAgMBAAECggEADRTV/c1uQ1XrpnVV9gs6joPfQjYmEAyfV8aMU/tAZnrw\nyh8qG+3p5gXEwOzpj4FkD8XCwiCiPWNHDEuZeK2q2/SJnSgJY1U9/N4svCfstx4v\nj4xgbYyWZzy/VoZcDMou0LKGIiFJJDy1qtm62Cjs0VbjbZIcLuwmE7u9yEKeE12o\nSPzTGpjuP0kjJJnyQTK00lIrxSO+VnEsMDUapOFrSYOXGVK9/AC8ywYEShCgZfgk\nn9lO81Of+r4sMWL5FJAuuw/asf/0S1ykf7/f52ydo4NfBY2YGuchGzUPwEgCmKDI\nTz4QDl+d6Ar+UMyNx/72rM0A9MNM+VnVRw5JY7W+wQKBgQDNiRzI9TBVdMAwvnll\nXyUMyKzZIIs5ysPvrkx5K1UvuLbaxSROtTNOOn0Ue1vejQBzKq6Z6Rwc2janxDZj\nIzPdbJFN90DT/ie/0u/1qYuRTcegtPaSyj5hNla643cTHlAjXdqWz7wk2d8zbx7c\n/coOP9ZVOF6NoOxN6Q+NIOK9TwKBgQC6B4P816XFF7KyQWkFRyszqX2B1g5XSzi7\n+3hLfzlTDVJuoQz+yzKMqvdUP4016mqIP4zoxBa8NV6BmtanOkBYpxvxeeGqSjDm\naM837WyhXTC95lwW7sMVGYcmy9EjuReDauckGSh3fFZMUplBvLPR6kEEStvgx1Jq\nXUiUEByvuQKBgBDtCq7N6kYPUEhzVyHu/OkZmYpj8LM4rHwPeYK8+83rQzuu4neM\n2oXFsUk/g2hHalMRn8FS/hquKbQVJ3lwi7PfXfPyuab7liBo6ZPse27i3d6xKGEc\nQJjW1bucQdEUPPs8nmSvBMpwGr5slzkRuVMFFMx90OOO7gbYe4xeue1nAoGAYuxQ\nMYnzKsWZTtUdpaLcxFIi3YIYii8D8mKc63ix4Qo6hX26zVr8fHUFpJVO4BbRo7Y3\nlid/94FhygWuk6qUQRBL+bLYX5eoPT4KwzDMDVri6nivC7rXnka+6dCEXDy21jlo\nxHdkX3WM5nUd7ikMblnlTQUJu5QCrXEBgUq4FnECgYEAhY4qtohtwxQKKkz0KAVO\n0/HWH2W4kfucC4lkpu0eQLWGlgC9TIYlT3XMgiW7EDVU5axcdziUUM/JU6b8dsVb\nEecqgl9oJicW8tF7RLtBswk9C++WB2kYL3w27Ba3DzThaQ9j64G7DQkZwic2LN81\nQ8jd+IEu2dJnBSjxWKvfyz0=\n-----END PRIVATE KEY-----\n`
   }),
  databaseURL: "https://not-alone-183705.firebaseio.com"
});

var db = admin.database();
var topicsRef = db.ref().child("topics");

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
    var displayText;
    console.log(typeof topics);
    if (topicsRef.child(topic) === null) {
        displayText = 'The current topic, ' + topic + ' is empty. There are no posts.';
    } else {
        displayText = 'There are currently posts in ' + topic + '.';
    }
    var body = `
    <body>
        <h1>` + displayText + `</h1>
    </body>
    </html>
    `;
    return head + body;
}

exports.load = functions.https.onRequest((req, res) => {
    // check if topic exists in database
    // if not then create topic
    var topic = req.url.substring(1);
    console.log(topic + ' first call of topic');

    topicsRef.on("value", function(snapshot) {
        var topics = snapshot.val();
        console.log(topic + ' second call of topic');
        if (!topics.hasOwnProperty(topic)) {
            console.log('Creating topic ' + topic);
            topicsRef.child(topic).set({});
        } else {
            console.log('Topic ' + topic + ' already exists');
        }

        var topicRef = topicsRef.child(topic);

        console.log(topic + ' third call of topic');
        // use getHTML function to load entries

        // req.url has the path in "/path" form, so need to substring by 1
        if (topic !== 'add') {
            res.status(200).send(
                getHTML(topic)
            );
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

<<<<<<< HEAD
})
=======
    var topicRef = topicsRef.child(topic);

    // use getHTML function to load entries

    // req.url has the path in "/path" form, so need to substring by 1
    if (topic !== 'add') {
        res.status(200).send(
            getHTML(topic)
        );
    }
}
>>>>>>> 3f527751d1c49774678098e57ecc425f88ebac2f
