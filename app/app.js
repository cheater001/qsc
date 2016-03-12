'use strict';

// Stylesheet entrypoint
require('_stylesheets/app.sass');

require('_modules/layout');
require('_modules/auth');
//require('_modules/components/table');

require('_modules/dashboard');
require('_modules/profile');

angular.module('app', [
		'ngMessages',

		'ui.router',
		'restangular',

		'ib.auth',
		'ib.layout',

		require('_modules/pay'),
		'cards',
		'dashboard',
		'profile'
	])
	.run(['$rootScope', '$state', '$stateParams', 'session',
		function ($rootScope, $state, $stateParams, session) {
			var $body = angular.element('body');

			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;

			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
				var access = toState.data.access;

				if (/^auth/.test(toState.name)) {
					$body.removeClass('skin-blue sidebar-mini fixed');
					$body.addClass('login-page');
				} else {
					$body.removeClass('login-page');
					$body.addClass('skin-blue sidebar-mini fixed');
				}

				if (access.isPublic) {
					return;
				}

				if (session.isAuth()) {
					if (access.permission && !session.isGranted(access.permission)) {
						event.preventDefault();
						$state.go(session.getStateByCode('403'));
					}
				} else {
					event.preventDefault();
					session.state = toState.name;
					session.params = toParams;
					$state.go('auth.init');
				}
			});
		}
	])
	.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider',
		function ($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider) {
			$locationProvider.html5Mode({
				enabled: true,
				requireBase: false
			});

			$urlRouterProvider
				.otherwise('/dashboard');

			$stateProvider
				.state('app', {
					abstract: true,
					controller: 'AppCtrl',
					template: require('./index.html'),
					data: {
						access: {}
					}
				});

			RestangularProvider.setBaseUrl('/api');
		}
	])
	.controller('AppCtrl', function () {
	});

$(document).ready(function () {
	require('_data/permissions.json');
	var dPermissions = $.ajax('/data/permissions.json')
		.then(function (response) {
			window.permissions = response;
		});

	require('_data/roles.json');
	var dRoles = $.ajax('/data/roles.json')
		.then(function (response) {
			window.roles = response;
		});

	$.when(dPermissions, dRoles).done(function (v1, v2) {
		angular.bootstrap(document, ['app']);
	});
});