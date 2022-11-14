var express = require('express'); //express handles routes
var request = require('request'); // for managing request -> use axios latter
var http = require('http'); 
var app = express(); //starting express
app.set('port', process.env.PORT || 3000); 

// URL formating
app.use(express.urlencoded());
app.use(express.json());

// GET
app.get('/', verificationHandler);

// POST
app.post('/',handleMessage);

// Display message send on the server from messenger
function handleMessage(req, res) {
  let messaging_events = req.body.entry[0].messaging;
  console.log("[server.js][handleMessage] ========= STARTING")
  console.log("[server.js][handleMessage] messaging event", messaging_events)
  for (i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i];
    let sender = event.sender.id;
    if (event.message && event.message.text) {
      console.log("[server.js][handleMessage] text existing")
      text = event.message.text;
      sendHelp(sender);
    }
  }
  console.log("[server.js][handleMessage]  ========= ENDED")
  res.end('received!');
}

// Verification for checking if webhook exist
function verificationHandler(req, res) {
  console.log(req);
  // token verification
  if (req.query['hub.verify_token'] === 'verifycode') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token!');
}


// Try to send response
var url = `https://graph.facebook.com/v15/me/messages?access_token=${process.env.PAGE_TOKEN}`
function sendHelp(id) {
  console.log("[server.js][sendHelp] ========= STARTING")
  var options = {
    uri: url,
    method: 'POST',
    json: {
      "recipient": {
        "id": id
      },
      "message": {
        "text": "Send wiki space 'Your query' to search wikipedia"
      }
    }
  }
  console.log("[server.js][sendHelp] options request", options)

  request(options, function(error, response, body) {
    console.log("[server.js][sendHelp][request send] response", response)
    if (error) {
      console.log(error.message);
    }
  });
  console.log("[server.js][sendHelp] ========= ENDED")
};

// Launch the server
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});