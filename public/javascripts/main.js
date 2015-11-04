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
			// console.log("user connected to " + data + " jamSpace")
		})


$scope.waveTypes = [
	{type: "sine",
	 selected: false
	},
	{type: "triangle",
	 selected: true
	},
	{type: "square",
	selected: false
	},
	{type: "sawtooth",
	selected: false
	}
]

$scope.midiParams = {
	delay: .8,
	volume: .7,
	filterFrequency: 900
}


//midi output handler and emmission-----------------------

	$scope.selectedWaveType = $scope.waveTypes[1].type

$scope.selectWave = function(event){
	// $scope.waveTypes[event].selected = true
	// console.log($scope.waveTypes[event])
	for (var i = 0; i<$scope.waveTypes.length ; i++) {
		$scope.waveTypes[i].selected = false
	};

	$scope.waveTypes[event].selected = true

	// console.log($scope.waveTypes[event].type)
	$scope.selectedWaveType = $scope.waveTypes[event].type
	// console.log($scope.selectedWaveType)
	Wad.midiInstrument.source = $scope.selectedWaveType
}
							
			
// console.log(Wad.midiInputs)
$scope.changeVolume = function() {
	console.log("Changing volume")
	Wad.midiInstrument.defaultVolume = parseFloat($scope.midiParams.volume)
	// console.log(Wad.midiInstrument.defaultvolume)
}


$scope.changeDelay = function() {
	Wad.midiInstrument.delay.delayTime = $scope.midiParams.delay
}

$scope.changeFilterFrequency = function() {
	Wad.midiInstrument.filter[0].frequency = parseInt($scope.midiParams.filterFrequency)
	// console.log(Wad.midiInstrument.filter[0].frequency)
}




if (Wad.midiInputs[0]) {
	$scope.revealMidiController = true
}

	$scope.revealParams = false
	$scope.armMidi = function(){
		$scope.revealParams = !$scope.revealParams
		$scope.connectedMidiDevices = Wad.midiInputs




		console.log(Wad.midiInputs[1])
		// Wad.midiInstrument = new Wad({source : 'triangle'})
		// console.log("armMidi")
			if (Wad.midiInputs[1]) {
				Wad.midiInputs[1].onmidimessage = function(event){
					// console.log(event.data)
					socket.emit('midiData', {  midiData: event.data, 
											destination:$routeParams.jamDestination,
											waveForm   : $scope.selectedWaveType,
											volume: parseFloat($scope.midiParams.volume),
											filterFrequency: parseInt($scope.midiParams.filterFrequency),
											delay: $scope.midiParams.delay,
											})	
				}
			}
	}




// midi input (from server) handler and emmission-----------------------
		socket.on('midi', function(data){
			// console.log(data)


			Wad.midiInstrument.source = data.waveForm
			// $scope.selectedWaveType = data.waveForm


			Wad.midiInstrument.defaultVolume = data.volume

			Wad.midiInstrument.filter[0].frequency = data.filterFrequency

			Wad.midiInstrument.delay.delayTime = data.delay

			// $scope.$apply(function(){ $scope.selectedWaveType = data.waveForm })
			// console.log($scope.selectedWaveType)

			   	// Wad.midiInstrument = new Wad({source : data.waveForm,
							// filter  : {frequency : 900},
    			// 			delay   : {delayTime : .8}
							// })

        // console.log(event.receivedTime, event.data);
	        if ( data.midiData[0] === 144 ) { // 144 means the midi message has note data
	            // console.log('note')
	            if ( data.midiData[2] === 0 ) { // noteOn velocity of 0 means this is actually a noteOff message
	                // console.log('|| stopping note: ', Wad.pitchesArray[data[1]-12]);
	                Wad.midiInstrument.stop(Wad.pitchesArray[data.midiData[1]-12]);
	            }
	            else if ( data.midiData[2] > 0 ) {
	                // console.log('> playing note: ', Wad.pitchesArray[data[1]-12]);
	                Wad.midiInstrument.play({pitch : Wad.pitchesArray[data.midiData[1]-12],
	                						label : Wad.pitchesArray[data.midiData[1]-12], callback : function(that){
	                						}})
	            }
        	}

     
        })


  Wad.midiInstrument = new Wad({
  								source : $scope.selectedWaveType,
							   filter  : {frequency : $scope.midiParams.filterFrequency},
    						   delay   : {delayTime : $scope.midiParams.delay},
    						   volume  : $scope.midiParams.volume,
							})

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
		// console.log(x)
		// console.log($scope.drumSets[x].kit)
		$scope.currentKit = $scope.drumSets[x].kit
	
	 hat = new Wad({source : '/drums/' + $scope.currentKit + '/1.wav'})
	kick = new Wad({source : '/drums/' + $scope.currentKit + '/2.wav'})
	snare = new Wad({source : '/drums/' + $scope.currentKit + '/3.wav'})
	aux = new Wad({source : '/drums/' + $scope.currentKit + '/4.wav'})
	pad5 = new Wad({source : '/drums/' + $scope.currentKit + '/5.wav'})
	pad6 = new Wad({source : '/drums/' + $scope.currentKit + '/6.wav'})
	pad7 = new Wad({source : '/drums/' + $scope.currentKit + '/7.wav'})
	pad8 = new Wad({source : '/drums/' + $scope.currentKit + '/8.wav'})
	
	// console.log(hat)
	// console.log(kick)
	// console.log(aux)
	}

	$scope.changeKitDown = function (){
		(x--)
	$scope.currentKit = $scope.drumSets[x].kit
	
	hat = new Wad({source : '/drums/' + $scope.currentKit + '/1.wav'})
	kick = new Wad({source : '/drums/' + $scope.currentKit + '/2.wav'})
	snare = new Wad({source : '/drums/' + $scope.currentKit + '/3.wav'})
	aux = new Wad({source : '/drums/' + $scope.currentKit + '/4.wav'})
	pad5 = new Wad({source : '/drums/' + $scope.currentKit + '/5.wav'})
	pad6 = new Wad({source : '/drums/' + $scope.currentKit + '/6.wav'})
	pad7 = new Wad({source : '/drums/' + $scope.currentKit + '/7.wav'})
	pad8 = new Wad({source : '/drums/' + $scope.currentKit + '/8.wav'})
	
	}

// this function sets the pads back to default styling on key release
	$scope.releaseKeyStroke = function () {
		$scope.pad1BeingPlayed = false
		$scope.pad2BeingPlayed = false
		$scope.pad3BeingPlayed = false
		$scope.pad4BeingPlayed = false
		$scope.pad5BeingPlayed = false
		$scope.pad6BeingPlayed = false
		$scope.pad7BeingPlayed = false
		$scope.pad8BeingPlayed = false
	}

		$scope.releasePad = function (){
		// $scope.clickedPad1= false
		// console.log($scope.clickedPad1)
		$scope.pad1BeingPlayed = false
		$scope.pad2BeingPlayed = false
		$scope.pad3BeingPlayed = false
		$scope.pad4BeingPlayed = false
		$scope.pad5BeingPlayed = false
		$scope.pad6BeingPlayed = false
		$scope.pad7BeingPlayed = false
		$scope.pad8BeingPlayed = false

		// console.log($scope.pad1BeingPlayed)
	}

	// $scope.padFunctions = [
	// 	{drum: "kick.play()"},
	// 	{drum: "hat.play()"},
	// 	{drum: "snare.play()"},
	// 	{drum: "aux.play()"},
	// 	{drum: "pad5.play()"},
	// 	{drum: "pad6.play()"},
	// 	{drum: "pad7.play()"},
	// 	{drum: "pad8.play()"}
	// ]

//for smart phone and click integration ------------------------------------------
	$scope.clickPad1 = function(){
		$scope.clickedPad1 = true
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
		if ($scope.clickedPad4===true){
				$scope.pad4BeingPlayed = true
				aux.play()
			}
		socket.emit('notebeingtouched', { 	note		: 4, 
											destination : $routeParams.jamDestination, 
											drum        : $scope.currentKit
						})
	}
	$scope.clickPad5 = function(){
		$scope.clickedPad5 = true
		if ($scope.clickedPad5===true){
				$scope.pad5BeingPlayed = true
				pad5.play()
			}
		socket.emit('notebeingtouched', { 	note		: 5, 
											destination : $routeParams.jamDestination, 
											drum        : $scope.currentKit
						})
	}
	$scope.clickPad6 = function(){
		$scope.clickedPad6 = true
		if ($scope.clickedPad6===true){
				$scope.pad6BeingPlayed = true
				pad6.play()
			}
		socket.emit('notebeingtouched', { 	note		: 6, 
											destination : $routeParams.jamDestination, 
											drum        : $scope.currentKit
						})
	}
	$scope.clickPad7 = function(){
		$scope.clickedPad7 = true
		if ($scope.clickedPad7===true){
				$scope.pad7BeingPlayed = true
				pad7.play()
			}
		socket.emit('notebeingtouched', { 	note		: 7, 
											destination : $routeParams.jamDestination, 
											drum        : $scope.currentKit
						})
	}
	$scope.clickPad8 = function(){
		$scope.clickedPad8 = true
		if ($scope.clickedPad8===true){
				$scope.pad8BeingPlayed = true
				pad8.play()
			}
		socket.emit('notebeingtouched', { 	note		: 8, 
											destination : $routeParams.jamDestination, 
											drum        : $scope.currentKit
						})
	}

//Note being pressed on the keyboard ------------------------------------------

		$scope.notePlayed = function(event){
			// console.log(event.which)
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
			if (event.which === 102){
				$scope.pad5BeingPlayed = true
				pad5.play()
			}
			if (event.which === 103){
				$scope.pad6BeingPlayed = true
				pad6.play()
			}
			if (event.which === 104){
				$scope.pad7BeingPlayed = true
				pad7.play()
			}
			if (event.which === 106){
				$scope.pad8BeingPlayed = true
				pad8.play()
			}

		socket.emit('keyPress', { 	notes		: $scope.inputs, 
									destination : $routeParams.jamDestination, 
									drum        : $scope.currentKit
								})
		}
//globally defining the pads ------------------------------------------
	var hat = new Wad({source : '/drums/' + $scope.currentKit + '/1.wav'})
	var kick = new Wad({source : '/drums/' + $scope.currentKit + '/2.wav'})
	var snare = new Wad({source : '/drums/' + $scope.currentKit + '/3.wav'})
	var aux = new Wad({source : '/drums/' + $scope.currentKit + '/4.wav'})
	var pad5 = new Wad({source : '/drums/' + $scope.currentKit + '/5.wav'})
	var pad6 = new Wad({source : '/drums/' + $scope.currentKit + '/6.wav'})
	var pad7 = new Wad({source : '/drums/' + $scope.currentKit + '/7.wav'})
	var pad8 = new Wad({source : '/drums/' + $scope.currentKit + '/8.wav'})

	// console.log(hat)
	// console.log(kick)
	// console.log(aux)
	// console.log('/drums/' + $scope.drumSets[x].kit + '/3.wav')

	
	
//handling incoming drum machine "notes"------------------------------------
		socket.on('keyPressEmission', function(data){
			// console.log(data)
			// console.log(data.notes)
			// console.log(data.drum)
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
			if (data.notes === 102){
				var epad5 = new Wad({source : '/drums/' + data.drum + '/5.wav'})
				epad5.play()
			}
			if (data.notes === 103){
				var epad6 = new Wad({source : '/drums/' + data.drum + '/6.wav'})
				epad6.play()
			}
			if (data.notes === 104){
				var epad7 = new Wad({source : '/drums/' + data.drum+ '/7.wav'})
				epad7.play()
			}
			if (data.notes === 106){
				var epad8 = new Wad({source : '/drums/' + data.drum + '/8.wav'})
				epad8.play()
			}
		})

//these are coming in off of the server on clicks and smartphone touches
		socket.on('touchedNotes', function(data){
			// console.log(data)
			// console.log(data.notes)
			// console.log(data.drum)
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
			if (data.note === 5){
				var epad5 = new Wad({source : '/drums/' + data.drum + '/5.wav'})
				epad5.play()
			}
			if (data.note === 6){
				var epad6 = new new Wad({source : '/drums/' + data.drum + '/6.wav'})
				epad6.play()
			}
			if (data.note === 7){
				var epad7 = new Wad({source : '/drums/' + data.drum + '/7.wav'})
				epad7.play()
			}
			if (data.note === 8){
				var epad8 = new Wad({source : '/drums/' + data.drum + '/8.wav'})
				epad8.play()
			}
		})

//handling incoming clicks on the keyboard-------------------------------
		// socket.on('clickedNote', function(data){
		// 	Wad.midiInstrument.play({pitch : data})
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



