angular.module('jamSpaces', ['ngRoute', 'ngTouch',])

angular.module('jamSpaces')
	.config(['$routeProvider', function($routeProvider){
		
		$routeProvider
			.when('/', {
				templateUrl : '/html/home.html',
				controller : 'HomeCtrl'
			})
			
			.when('/jamSpace/:jamDestination', {
				templateUrl : '/html/jamming.html',
				controller : 'JamCtrl'
			})
	}])



