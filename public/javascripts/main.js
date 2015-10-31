angular.module('App', ['ngRoute'])

angular.module('App')
	.config(['$routeProvider', function($routeProvider){
		// No need to define #, it is assumed
		$routeProvider
			.when('/', {
				templateUrl : '/html/home.html',
				controller : 'mainController'
			})
			.when('/login', {
				templateUrl : '/html/login.html',
				controller : 'mainController'
			})

			.when('/jamSpace/:jamDestination', {
				templateUrl : '/html/jamming.html',
				controller : 'jamController'
			})
	}])


angular.module('App')
	.controller('mainController', ['$scope', '$http','$routeParams', '$location', '$rootScope', function($scope, $http, $routeParams, $location, $rootScope){
	var socket = io()

	$scope.login = function() {
		$location.url('/jamSpace/' + $scope.user.destination)		
	}

}])

angular.module('App')
	.controller('jamController', ['$scope', '$http','$routeParams', '$location', '$rootScope', function($scope, $http, $routeParams, $location, $rootScope){
		
		$scope.destination = $routeParams.jamDestination

		var socket = io()
		socket.emit('destination', $routeParams.jamDestination)

		socket.on('alertMessage', function(data){
			console.log("user connected to " + data + " jamSpace")
		})


//midi output handler and emmission-----------------------
		if (Wad.midiInputs[0]) {
			Wad.midiInputs[0].onmidimessage = function(event){
				console.log(event.data)
				socket.emit('midiData', {midiData:event.data, destination:$routeParams.jamDestination})	
		}
		}

//the drum machine------------------------------------

	$scope.drumSets = [
	{kit: "tonal"},
	{kit: "basic8bit"},
	{kit: "junk"},
	{kit: "kit1"},
	{kit: "kit2"}
	]


	
// the changing drum kit logic
	x = 0
	$scope.currentKit = $scope.drumSets[x].kit
	$scope.changeKitUp = function (){
		// console.log("changing the drumset")
		(x++)
		console.log(x)
		console.log($scope.drumSets[x].kit)
		$scope.currentKit = $scope.drumSets[x].kit
	
	 hat = new Wad({source : '/drums/' + $scope.currentKit + '/1.wav'})
	kick = new Wad({source : '/drums/' + $scope.currentKit + '/2.wav'})
	snare = new Wad({source : '/drums/' + $scope.currentKit + '/3.wav'})
	aux = new Wad({source : '/drums/' + $scope.currentKit + '/4.wav'})
	
	console.log(hat)
	console.log(kick)
	console.log(aux)
	}

	$scope.changeKitDown = function (){
		(x--)
	$scope.currentKit = $scope.drumSets[x].kit
	
	 hat = new Wad({source : '/drums/' + $scope.currentKit + '/1.wav'})
	kick = new Wad({source : '/drums/' + $scope.currentKit + '/2.wav'})
	snare = new Wad({source : '/drums/' + $scope.currentKit + '/3.wav'})
	aux = new Wad({source : '/drums/' + $scope.currentKit + '/4.wav'})
	
	}
	// $scope.touchedKick = false
	// $scope.touchKick = function (){
	// 	$scope.touchedKick = true
	// 	console.log("kick drum")
	// }

// this function sets the pads back to default styling on key release
	$scope.releaseKeyStroke = function () {
		$scope.pad1BeingPlayed = false
		$scope.pad2BeingPlayed = false
		$scope.pad3BeingPlayed = false
		$scope.pad4BeingPlayed = false
	}

		$scope.releasePad = function (){
		// $scope.clickedPad1= false
		// console.log($scope.clickedPad1)
		$scope.pad1BeingPlayed = false
		$scope.pad2BeingPlayed = false
		$scope.pad3BeingPlayed = false
		$scope.pad4BeingPlayed = false

		console.log($scope.pad1BeingPlayed)
	}

	$scope.clickPad1 = function(){
		$scope.clickedPad1 = true
		console.log("clicked pad 1")

		if ($scope.clickedPad1===true){
				$scope.pad1BeingPlayed = true
				kick.play()
			}

		socket.emit('notebeingtouched', { 	note		: 1, 
											destination : $routeParams.jamDestination, 
											drum        : $scope.currentKit
										})

	}

	$scope.clickPad2 = function(){
		$scope.clickedPad2 = true
		console.log("clicked pad 2")

		if ($scope.clickedPad2===true){
				$scope.pad2BeingPlayed = true
				hat.play()
			}

		socket.emit('notebeingtouched', { 	note		: 2, 
											destination : $routeParams.jamDestination, 
											drum        : $scope.currentKit
								})
	}
	$scope.clickPad3 = function(){
		$scope.clickedPad3 = true
		console.log("clicked pad 3")

		if ($scope.clickedPad3===true){
				$scope.pad3BeingPlayed = true
				snare.play()
			}
		socket.emit('notebeingtouched', { 	note		: 3, 
											destination : $routeParams.jamDestination, 
											drum        : $scope.currentKit
							})
	}
	$scope.clickPad4 = function(){
		$scope.clickedPad4 = true
		console.log("clicked pad 4")

		if ($scope.clickedPad4===true){
				$scope.pad4BeingPlayed = true
				aux.play()
			}
		socket.emit('notebeingtouched', { 	note		: 4, 
											destination : $routeParams.jamDestination, 
											drum        : $scope.currentKit
						})
	}



		$scope.notePlayed = function(event){
			console.log(event.which)
			$scope.inputs = event.which

			if (event.which === 114){
				$scope.pad1BeingPlayed = true
				kick.play()
			}

			if (event.which === 116){
				$scope.pad2BeingPlayed = true
				hat.play()
			}
			if (event.which === 121){
				$scope.pad3BeingPlayed = true
				snare.play()
			}
			if (event.which === 117){
				$scope.pad4BeingPlayed = true
				aux.play()
			}

		socket.emit('notebeingplayed', { 	notes		: $scope.inputs, 
											destination : $routeParams.jamDestination, 
											drum        : $scope.currentKit
										})
		}

	var hat = new Wad({source : '/drums/' + $scope.currentKit + '/1.wav'})
	var kick = new Wad({source : '/drums/' + $scope.currentKit + '/2.wav'})
	var snare = new Wad({source : '/drums/' + $scope.currentKit + '/3.wav'})
	var aux = new Wad({source : '/drums/' + $scope.currentKit + '/4.wav'})

	console.log(hat)
	console.log(kick)
	console.log(aux)
	// console.log('/drums/' + $scope.drumSets[x].kit + '/3.wav')

	
	
//handling incoming drum machine "notes"------------------------------------
		socket.on('music', function(data){
			console.log(data)
			console.log(data.notes)
			console.log(data.drum)
			if (data.notes === 116){
				var ehat = new Wad({source : '/drums/' + data.drum + '/1.wav'})
				ehat.play()
			}
			if (data.notes === 114){
				var ekick = new Wad({source : '/drums/' + data.drum + '/2.wav'})
				ekick.play()
			}
			if (data.notes === 121){
				var esnare = new Wad({source : '/drums/' + data.drum + '/3.wav'})
				esnare.play()
			}

			if (data.notes === 117){
				var eaux = new Wad({source : '/drums/' + data.drum + '/4.wav'})
				eaux.play()
			}
		})

		socket.on('touchedNotes', function(data){
			console.log(data)
			console.log(data.notes)
			console.log(data.drum)
			if (data.note === 1){
				var ehat = new Wad({source : '/drums/' + data.drum + '/1.wav'})
				ehat.play()
			}
			if (data.note === 2){
				var ekick = new Wad({source : '/drums/' + data.drum + '/2.wav'})
				ekick.play()
			}
			if (data.note === 3){
				var esnare = new Wad({source : '/drums/' + data.drum + '/3.wav'})
				esnare.play()
			}

			if (data.note === 4){
				var eaux = new Wad({source : '/drums/' + data.drum + '/4.wav'})
				eaux.play()
			}
		})

//handling incoming clicks on the keyboard-------------------------------
		// socket.on('clickedNote', function(data){
		// 	Wad.midiInstrument.play({pitch : data})
		// })


//midi input (from server) handler and emmission-----------------------
		// socket.on('midi', function(data){
		// 	console.log(data[1])
		// 	if ( data[0] === 144 ) {
		// 		console.log("success!")
		// 		// Wad.midiInstrument = new Wad({source : 'sawtooth'})
		// 	 if ( data[2] === 0 ) { // noteOn velocity of 0 means this is actually a noteOff message
  //               console.log('|| stopping note: ', Wad.pitchesArray[data[1]-12]);
  //               Wad.midiInstrument.stop(Wad.pitchesArray[data[1]-12]);
  //           }
		// 	else if ( data[1] > 0 ) {
		// 		Wad.midiInstrument = new Wad({
		// 			source : 'triangle',
		// 			volume  : .4
		// 	})
  //           console.log('> playing note: ', Wad.pitchesArray[data[1]-12]);
  //           Wad.midiInstrument.play({pitch : Wad.pitchesArray[data[1]-12], label : Wad.pitchesArray[data[1]-12], callback : function(that){
  //           }})
  //   		}}
		// })

//click handler for keyboard-----------------------
		// Wad.midiInstrument = new Wad({
		// 	source : 'triangle',
		// 	volume  : .4


		// })

		// $scope.release = false
		// $scope.keyboardClickRelease = function(event){
		// 	console.log(event)
		// 	$scope.release = true
		// }
		// $scope.keyboardClickRelease = function () {
		// 	Wad.midiInstrument.stop()
		// }

		// $scope.C3 = function (){
		// 	Wad.midiInstrument.play({pitch : "C4"})
		// 	$scope.C4 = "C4"
		// 	socket.emit("noteBeingClicked", { note: $scope.C4, destination: $routeParams.jamDestination})
		// }
		
		// $scope.Csharp3 = function (){
		// 	Wad.midiInstrument.play({pitch : "C#4"})
		// }
		// $scope.D3 = function (){
		// 	Wad.midiInstrument.play({pitch : "D4"})
		// }
		// $scope.Dsharp3 = function (){
		// 	Wad.midiInstrument.play({pitch : "D#4"})
		// }
		// $scope.E3 = function (){
		// 	Wad.midiInstrument.play({pitch : "E4"})
		// }
		// $scope.F3 = function (){
		// 	Wad.midiInstrument.play({pitch : "F4"})
		// }
		// $scope.Fsharp3 = function (){
		// 	Wad.midiInstrument.play({pitch : "F#4"})
		// }
		// $scope.G3 = function (){
		// 	Wad.midiInstrument.play({pitch : "G4"})
		// }
		// $scope.Gsharp3 = function (){
		// 	Wad.midiInstrument.play({pitch : "G#4"})
		// }
		// $scope.A3 = function (){
		// 	Wad.midiInstrument.play({pitch : "A4"})
		// }
		// $scope.Asharp3 = function (){
		// 	Wad.midiInstrument.play({pitch : "A#4"})
		// }
		// $scope.B3 = function (){
		// 	Wad.midiInstrument.play({pitch : "B4"})
		// }


// });
}])



