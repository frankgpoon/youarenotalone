const functions = require('firebase-functions');
var admin = require("firebase-admin");
var bodyParser = require("body-parser");

admin.initializeApp({
    credential: admin.credential.cert({
     projectId: "not-alone-183705",
     clientEmail: "firebase-adminsdk-uakwe@not-alone-183705.iam.gserviceaccount.com",
     privateKey: `/*redacted*/`
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
        <main>
        <div>
            <h1><a href="https://not-alone-183705.firebaseapp.com">You Are Not Alone</a> - #` + topic + `</h1>
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
    </main>
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
