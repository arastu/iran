(function (argument) {
	'use strict'
	var app = angular.module('iranDemo', ['ngMaterial', 'ngAnimate', 'ngAria', 'iran']);
	app.controller('DefaultCtrl', function ($scope) {
		$scope.test = 'test';
	})
})()