var express = require('express'); //express handles routes
var http = require('http'); 
var app = express(); //starting express
app.set('port', process.env.PORT || 3000); 
//
app.use(express.urlencoded());
app.use(express.json());
app.get('/', verificationHandler);

app.post('/',handleMessage);

function handleMessage(req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      console.log(text);
    }
  }
  res.end('received!');
}

function verificationHandler(req, res) {
  console.log(req);
  if (req.query['hub.verify_token'] === 'verifycode') {
  res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token!');
}

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});