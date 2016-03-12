angular.module('dashboard', [])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('app.dashboard', {
					url: '/dashboard',
					views: {
                        main: {
                            controller: DashboardCtrl,
                            template: require('./templates/main.html')
                        },
                        title: {
                            template: require('./templates/title.html')
                        }
                    },
					data: {
                        access: {
							permission: permissions.DASHBOARD_READ
						}
                    }
				});
		}
	]);

function DashboardCtrl($scope) {
    console.log('DASHBOARD CTRL');
}