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
				controller : 'mainController'
			})
	}])


angular.module('App')
	.controller('mainController', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams){
		// console.log($routeParams)

		
		var jamDestination = $routeParams.jamDestination

		// console.log(jamSpace)
		$scope.login = function() {
			console.log($scope.user)
			$http.post('/login', $scope.user)
			.then(function(returnData){
				// var jamSpace = returnData.data
				// console.log(jamSpace)
			})
		}


}])