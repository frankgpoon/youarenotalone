const functions = require('firebase-functions');
var admin = require("firebase-admin");
var bodyParser = require("body-parser");

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

function getHTML(topic, numberOfPosts) {
    var head = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>You Are Not Alone - #` + topic + `</title>
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto">
        <link rel="stylesheet" type="text/css" href="https://not-alone-183705.firebaseapp.com/style.css">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script>
        function submitForm(){
            var headers = {
                topic: '` + topic + `',
                text: document.getElementById('storyForm').elements['story'].value
            }
            if (headers.text !== null && headers.topic !== null) {
              jQuery.post('/add', headers);
            }
        }
        </script>
    </head>
    `;

    return head + getHTMLBody(topic, numberOfPosts);
}

function getHTMLBody(topic, numberOfPosts) {
    var subtitle = 'There are currently ' + numberOfPosts + ' posts in this topic.';
    if (numberOfPosts === 1) {
        subtitle = 'There is currently 1 post in this topic.'
    }

    var heading = `
    <body>
        <div>
            <h1>You Are Not Alone - #` + topic + `</h1>
            <small>` + subtitle + `</small>
        </div>
        <div>
            <form method="post" id='storyForm'>
                <p>Submit Your Story:</p>
                <textarea form ="storyForm" id="story" rows= "5" cols="100"></textarea><br>
                <button onclick='submitForm()'>Share</button><br>
            </form>
        </div>
    `;

    var footer = `
    </body>
    </html>
    `;

    var main = '';

    var topicRef = topicsRef.child(topic);
    topicRef.on("value", (snapshot) => {
        var topic = snapshot.val();
        var ids = Object.keys(topic);
        console.log(topic);
        console.log(ids);
        for (var i in ids) {
            // i is an int, ids[i] is an object key, topics[ids[i]] is the object value
            if (ids[i] !== 'created') {
                main = `<div class="postBox"><p>` + topic[ids[i]].text + `</p>
                <small>Posted at ` + new Date(parseInt(topic[ids[i]].timestamp, 10)).toString() + `</small><br></div>` + main;
            }
        }

        return heading + main + footer;
    })
    return heading + main + footer;
}

// Main Firebase functions

// Adds a post to the given topic in headers
exports.add = functions.https.onRequest((req, res) => {
    // finds topic and text from post request body
    var topic = req.body['topic'];
    var text = req.body['text'].replace(/\n/g, '<br>');

    if (text !== '') {// find timestamp
        var timestamp = Date.now();

        // add text and timestamp to entry under topic
        var topicRef = topicsRef.child(topic);

        // generate a unique id for this entry (hope it's ordered when displaying)
        topicRef.push({
            text: text,
            timestamp: timestamp
        });

        // send it back to old, refreshed page
        res.status(200).redirect('back');
    }
})


// Called every time any path that is not a file name is requested besides /add
exports.load = functions.https.onRequest((req, res) => {
    // take path name
    var topic = req.url.substring(1);
    if (topic.charAt(topic.length - 1) === '/') {
        topic = topic.substring(0, topic.length - 1);
    }

    // check for file extension and don't create topic if file exists
    if (topic.indexOf('.') < 0 && topic !== 'add') {
        topicsRef.on("value", (snapshot) => {
            // import topics async
            var topics = snapshot.val();
            // check if topic exists
            if (!topics.hasOwnProperty(topic)) {
                // create new topic and set created flag so it's not null
                topicsRef.child(topic).set({created: true});
            }

            var topicRef = topicsRef.child(topic);
            // use getHTML function to load entries
            var numberOfPosts = 0;
            if (typeof topics[topic] !== undefined) {
                numberOfPosts = Object.keys(topics[topic]).length - 1;
            }

            // req.url has the path in "/path" form, so need to substring by 1
            if (topic !== 'add') {
                res.status(200).send(
                    getHTML(topic, numberOfPosts)
                );
            }
        }, (errorObject) => {
            console.log("The read failed: " + errorObject.code);
        });

    }

})
