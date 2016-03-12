var $ = require('jquery');
var scroll = require('perfect-scrollbar');

angular.module('ib.layout', [])
	.directive('ibLayout', ['$window', 'permissions', ibLayoutDirective])
	.directive('ibSidebarToggle', ['$timeout', '$window', ibSidebarToggleDirective])
	.directive('ibSidebar', ['$window', 'session', ibSidebarDirective])
	.directive('ibNavbar', ['session', 'authentication', ibNavbarDirective])
	.directive('ibTreeview', ibTreeviewDirective)
	.directive('ibUserPanel', ['session', ibUserPanelDirective]);

var TOGGLE_CLASS = 'sidebar-collapse',
	OPEN_CLASS = 'sidebar-open',
	HOVER_CLASS = 'sidebar-expanded-on-hover',

	SCREEN_SIZES = {
		xs: 480,
		sm: 768,
		md: 992,
		lg: 1200
	};


function ibLayoutDirective($window, permissions) {
	var $win,
		$sidebar,
		$mainSidebar,
		userPanelHeight,
		searchFormHeight;

	return {
		restrict: 'A',
		require: 'ibLayout',
		controller: IbLayoutCtrl,
		link: postLink
	};

	function IbLayoutCtrl() {
		var self = this;
	}

	function postLink(scope, element, attrs, IbLayoutCtrl) {
		IbLayoutCtrl.$element = element;

		scope.ifGranted = permissions;

		$win = angular.element($window);
		$sidebar = angular.element('.sidebar-menu-wrapper');
		$mainSidebar = angular.element('.main-sidebar');
		userPanelHeight = angular.element('.user-panel').outerHeight();
		searchFormHeight = angular.element('.sidebar-form').outerHeight(true);

		scroll.initialize($sidebar[0]);

		$win.on('resize', function () {
			calculate();
			calculateSidebar();
		}).trigger('resize');
	}

	function calculate() {
		var windowHeight = $win.height();

		angular.element(".content-wrapper, .right-side")
			.css('min-height', windowHeight - angular.element('.main-footer').outerHeight());
	}

	function calculateSidebar() {
		var height = $mainSidebar.height() - userPanelHeight - searchFormHeight;

		$sidebar.height(height);

		scroll.update($sidebar[0]);
	}
}
function ibSidebarToggleDirective($timeout, $window) {
	return {
		restrict: 'A',
		link: postLink
	};

	function postLink(scope, element, attrs) {
		var $win = angular.element($window),
			$target = angular.element(attrs.ibSidebarToggle),
			map;

		element.on('click', function (e) {
			scope.isSidebarExpanded = !scope.isSidebarExpanded;


			//Enable sidebar push menu
			if ($win.width() > (SCREEN_SIZES.sm - 1)) {
				if ($target.hasClass(TOGGLE_CLASS)) {
					$target.removeClass(TOGGLE_CLASS);
				} else {
					$target.addClass(TOGGLE_CLASS);
				}
			}
			//Handle sidebar push menu for small screens
			else {
				if ($target.hasClass(OPEN_CLASS)) {
					$target.removeClass(OPEN_CLASS).removeClass(TOGGLE_CLASS);
				} else {
					$target.addClass(OPEN_CLASS);
				}
			}
		});

		angular.element('.content-wrapper').click(function () {
			if ($win.width() <= (SCREEN_SIZES.sm - 1) && $target.hasClass(OPEN_CLASS)) {
				$target.removeClass(OPEN_CLASS);
			}
		});
	}
}
function ibSidebarDirective($window, session) {
	return {
		restrict: 'A',
		link: postLink
	};

	function postLink(scope, element, attrs) {
		var $win = angular.element($window),
			$target = angular.element(attrs.ibSidebar);

		element.on('mouseenter', function () {
			if (scope.isSidebarExpanded && $win.width() > SCREEN_SIZES.sm - 1) {
				$target.removeClass(TOGGLE_CLASS);
				$target.addClass(HOVER_CLASS);
			}
		});
		element.on('mouseleave', function () {
			if (scope.isSidebarExpanded && $win.width() > SCREEN_SIZES.sm - 1) {
				$target.addClass(TOGGLE_CLASS);
				$target.removeClass(HOVER_CLASS);
			}
		});

		scope.userName = session.user.name;
	}
}
function ibNavbarDirective(session, authentication) {
	return {
		restrict: 'A',
		template: require('./templates/navbar.html'),
		link: postLink
	};

	function postLink(scope, element, attrs) {
		element.addClass('navbar navbar-static-top');

		scope.userName = session.user.name;
		scope.signout = authentication.logout;
	}
}
function ibTreeviewDirective() {
	return {
		restrict: 'A',
		link: postLink
	};

	function postLink(scope, element, attrs) {
		var animationSpeed = 300;

		angular.element('li a', element).on('click', function (e) {
			//Get the clicked link and the next element
			var $this = $(this),
				checkElement = $this.next();

			//Check if the next element is a menu and is visible
			if ((checkElement.is('.treeview-menu')) && (checkElement.is(':visible'))) {
				//Close the menu
				checkElement.slideUp(animationSpeed, function () {
					checkElement.removeClass('menu-open');
					//Fix the layout in case the sidebar stretches over the height of the window
					//_this.layout.fix();
				});
				checkElement.parent('li').removeClass('active');
			}
			//If the menu is not visible
			else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
				//Get the parent menu
				var parent = $this.parents('ul').first();
				//Close all open menus within the parent
				var ul = parent.find('ul:visible').slideUp(animationSpeed);
				//Remove the menu-open class from the parent
				ul.removeClass('menu-open');
				//Get the parent li
				var liParent = $this.parent('li');

				//Open the target menu and add the menu-open class
				checkElement.slideDown(animationSpeed, function () {
					//Add the class active to the parent li
					checkElement.addClass('menu-open');
					parent.find('li.active').removeClass('active');
					liParent.addClass('active');
					//Fix the layout in case the sidebar stretches over the height of the window
					//_this.layout.fix();
				});
			}
			//if this isn't a link, prevent the page from being redirected
			if (checkElement.is('.treeview-menu')) {
				e.preventDefault();
			}
		});
	}
}
function ibUserPanelDirective(session) {
	return {
		restrict: 'E',
		link: postLink,
		templateUrl: 'common/components/layout/user_panel.html'
	};

	function postLink(scope, element, attrs) {
		scope.info = session.info;
	}
}

