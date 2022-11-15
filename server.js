var express = require('express'); //express handles routes
var request = require('request'); // for managing request -> use axios latter
var http = require('http'); 
var app = express(); //starting express
app.set('port', process.env.PORT || 3000);
const dotenv = require("dotenv")
dotenv.config() 

// URL formating
app.use(express.urlencoded());
app.use(express.json());

// GET
app.get('/', verificationHandler);

// POST
app.post('/',handleMessage);

// Display message send on the server from messenger
function handleMessage(req, res) {
  console.log("[server.js][handleMessage] ========= STARTING")
  let body = req.body; // Parse the request body from the POST

  // Check the webhook event is from a Page subscription (webhook event is setup on dev.fb.com/apps)
  if (body.object === 'page') {
    console.log("[server.js][handleMessage] page subscription")
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Get the webhook event. entry.messaging is an array, but 
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log("[server.js][handleMessage] webhook_event", webhook_event);
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    console.log("[server.js][handleMessage] other subscription, not supported")
    res.sendStatus(404); // Return a '404 Not Found' if event is not from a page subscription
  }
  console.log("[server.js][handleMessage]  ========= ENDED")
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
    // console.log("[server.js][sendHelp][request send] response", response)
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