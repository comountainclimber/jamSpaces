// Requires \\
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');

var app = express();


// Application Configuration \\
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

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

socketServer.on('connection', function(socket) {
	socket.on('destination', function(data){
		var destination = data
		socket.join(data)
		socketServer.to(destination).emit('alertMessage', destination)
	})

	socket.on('keyPress', function(data){
		socket.broadcast.to(data.destination).emit('keyPressEmission', data)
	})

	socket.on('notebeingtouched', function(data){
		socket.broadcast.to(data.destination).emit('touchedNotes', data)
	})

	socket.on('midiData', function(data){
		socketServer.to(data.destination).emit('midi', data)
		socket.broadcast.to(data.destination).emit('midi', data)
	})

	socket.on('noteBeingClicked', function(data){
		socket.broadcast.to(data.destination).emit('clickedNote', data.note)
	})

})