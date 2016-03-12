angular.module('profile', [])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('app.profile', {
					url: '/profile',
					views: {
                        main: {
                            controller: ProfileCtrl,
                            template: require('./templates/main.html')
                        },
                        title: {
                            template: require('./templates/title.html')
                        }
                    },
					data: {
                        access: {
							permission: permissions.PROFILE_READ
						}
                    }
				});
		}
	]);

function ProfileCtrl($scope) {}