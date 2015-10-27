// Requires \\
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var socketio = require('socket.io')
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');



// Create Express App Object \\
var app = express();


// Application Configuration \\
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
// app.use(cookieParser());
// app.use(morgan('dev'));


// Routes \\
app.get('/', function(req, res){
  res.sendFile('index.html', { root: './public/html' })
});

app.post('/login', function(req, res){
	// var jamDestination = req.body.destination
	console.log(req.body)
	res.redirect('/jamSpace/' + req.body.destination)
})

app.get('/jamSpace/:jamDestination', function(req, res){
	res.sendFile('jamming.html')
})

//Create the server
var server = http.createServer(app)

//Start the web socket server
var io = socketio.listen(server);

// Creating Server and Listening for Connections \\
var port = 3000
app.listen(port, function(){
  console.log('Its all going down on port ' + port);

})