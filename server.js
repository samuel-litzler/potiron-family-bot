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
  console.log()
  for (i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i];
    let sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      sendHelp(sender);
    }
  }
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
  request(options, function(error, response, body) {
    if (error) {
      console.log(error.message);
    }
  });
};

// Launch the server
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});