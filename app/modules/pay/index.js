require('./index.sass');

angular.module('pay', [])
	.config(['$stateProvider',
		function($stateProvider) {
			$stateProvider
				.state('app.pay', {
					url: '/pay',
					views: {
                        main: {
                            controller: PayCtrl,
                            template: require('./templates/main.html')
                        },
                        title: {
                            template: require('./templates/title.html')
                        }
                    },
					data: {
                        access: {}
                    }
				});
		}
	]);

PayCtrl.$inject = ['$scope'];
function PayCtrl($scope) {
}

module.exports = 'pay';