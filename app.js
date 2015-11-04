// Requires \\
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');


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

app.post('/userinfo', function(req, res){
	console.log(req.body)
})


app.server = app.listen(8080)

var io = require("socket.io")
var socketServer = io(app.server)
// socket stuff //
// var io = socketio.listen(http);

socketServer.on('connection', function(socket) {
	// console.log('a user has connected to jamSpace')
	// console.log(socket.id, socketServer)
	socket.on('destination', function(data){
		var destination = data
		// console.log("user has entered " + data + " jamSpace")
		socket.join(data)

		socketServer.to(destination).emit('alertMessage', destination)
	})

	socket.on('keyPress', function(data){
		// console.log(data)
		socket.broadcast.to(data.destination).emit('keyPressEmission', data)
	})

	socket.on('notebeingtouched', function(data){
		// console.log(data)
		socket.broadcast.to(data.destination).emit('touchedNotes', data)
	})

	socket.on('midiData', function(data){
		console.log(data)
		socket.broadcast.to(data.destination).emit('midi', data)
	})

	socket.on('noteBeingClicked', function(data){
		// console.log(data.note)
		socket.broadcast.to(data.destination).emit('clickedNote', data.note)

	})


})


// Creating Server and Listening for Connections \\
