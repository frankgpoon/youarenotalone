const functions = require('firebase-functions');

<<<<<<< HEAD
exports.bigben = functions.https.onRequest((req, res) => {
  const hours = (new Date().getHours() % 12) + 1 // london is UTC + 1hr;
  res.status(200).send(`<!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
      ${'BONG '.repeat(hours)}
    </body>
  </html>`);
});

exports.add = functions.https.onRequest((req, res) => {
  // POST request to DB -- parse req





  // redirect back to front page
  res.status(200).send(



  	);
});

