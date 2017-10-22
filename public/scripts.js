function sendRequest(story) {
	const https = require('https');
	var options = {
		path: '/add'
	};
callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    console.log(str);
  });
}
	https.request(options, callback).end;
}