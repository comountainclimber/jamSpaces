angular.module('jamSpaces')
	.controller('HomeCtrl', ['$scope', '$http','$routeParams', '$location', '$rootScope', function($scope, $http, $routeParams, $location, $rootScope){
	var socket = io()

	$scope.login = function() {
		$location.url('/jamSpace/' + $scope.user.destination)		
	}

}])