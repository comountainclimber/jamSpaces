angular.module('App', ['ngRoute'])

// ngRoute gives us access to a few components
// 1. ngView - directive that defines where our templates are rendered
// 2. $routeProvider - used in defining and configuring routes
//						* what template to use
//						* what controller to use
// 3. $routeParams - Analogous to req.params -> shows us the values of our url parameters
// 4. $route - Does a lot of work under the hood (rendering templates, etc).  Watches the URL and decides which route should be handled
//

// Define our routes
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
		
		// $scope.armMidi = function() {
		// 	console.log("success!")
		// 	Wad.midiInstrument = new Wad({source : 'sawtooth'});
		// }
		
		// console.log(Wad.midiInputs[0])

		if (Wad.midiInputs[0]) {
			Wad.midiInputs[0].onmidimessage = function(event){
				console.log(event.data)
				socket.emit('midiData', {midiData:event.data, destination:$routeParams.jamDestination})	
		}
		}

		// socket.on()


		var hat = document.getElementById('highHat')
		var kick = document.getElementById('kick')
		var snare = document.getElementById('snare')

		$scope.notePlayed = function(event){
			$scope.inputs = event.which

			if (event.which === 116){
				hat.play()
			}

			if (event.which === 114){
				kick.play()
			}

			if (event.which === 121){
				snare.play()
			}


			socket.emit('notebeingplayed', { notes: $scope.inputs, destination: $routeParams.jamDestination})
		}


		$scope.destination = $routeParams.jamDestination

		var socket = io()
		socket.emit('destination', $routeParams.jamDestination)

		socket.on('alertMessage', function(data){
			console.log("user connected to " + data + " jamSpace")
		})

		socket.on('music', function(data){
			console.log(data.notes)
			if (data.notes === 116){
			hat.play()
			}

			if (data.notes === 114){
				kick.play()
			}

			if (data.notes === 121){
				snare.play()
			}
		})

		socket.on('midi', function(data){
			console.log(data[1])

			if ( data[0] === 144 ) {
				console.log("success!")
				// Wad.midiInstrument = new Wad({source : 'sawtooth'})

			 if ( data[2] === 0 ) { // noteOn velocity of 0 means this is actually a noteOff message
                console.log('|| stopping note: ', Wad.pitchesArray[data[1]-12]);
                Wad.midiInstrument.stop(Wad.pitchesArray[data[1]-12]);
            }

			else if ( data[1] > 0 ) {
			Wad.midiInstrument = new Wad({source : 'sawtooth'})
            console.log('> playing note: ', Wad.pitchesArray[data[1]-12]);
            Wad.midiInstrument.play({pitch : Wad.pitchesArray[data[1]-12], label : Wad.pitchesArray[data[1]-12], callback : function(that){
            }})

            
        }




				// Wad.midiInstrument.play()
			}
		})


		
}])



