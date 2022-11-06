var express = require('express'); //express handles routes
var http = require('http'); 
var app = express(); //starting express
app.set('port', process.env.PORT || 3000); 
//
app.use(express.urlencoded());
app.use(express.json());
app.get('/', verificationHandler);

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