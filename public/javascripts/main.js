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


		
}])



