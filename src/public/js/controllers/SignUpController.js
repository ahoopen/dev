var app = angular.module('signupApp', ['userService'])

	//
	.controller('signupValidation', ['$scope', '$http', 'User', function($scope, $http, User) {

		$scope.user = {};
		/**
		* 
		**/
		$scope.createUser = function() {
			$scope.submitted = false;

			if ( $scope.signupForm.$valid ) {
				$scope.submitted = true;

				var formData = {
					username : $scope.user.name,
					email	 : $scope.user.email,
					password : $scope.user.password
				};

				// maak een gebruiker aan
				User.create(formData)
					.succes(function(data) {
						$scope.formData = {};
						console.log('succes!', data);
					})
					.error(function(err) {
						// fout opgetreden
					});
			}
		};

		$scope.dirtyAndInvalid = function(field) {
			if(field.$pristine) {
				return true;
			}
			return field.$dirty && field.$invalid;
		};

	}])

	.directive('ngFocus', [function() {
		var FOCUS_CLASS = "ng-focused";

		return {
			restict: 'A',
			require: '^ngModel',
			link : function(scope, element, attrs, ctrl) {
				ctrl.$focused = false;
				element.bind('focus', function(event) {
					element.addClass(FOCUS_CLASS);
					scope.$apply( function() {
						ctrl.$focused = true;
					});
				}).bind('blur', function(event) {
					element.removeClass(FOCUS_CLASS);
						scope.$apply(function() { ctrl.$focused = false; 
					});
				});
			}
		};
	}])

	.directive('passwordMatch', [function() {
		return {
			restict: 'A',
			scope: true,
			require: 'ngModel',
			link : function(scope, element, attrs, ctrl) {
				var checker = function() {
					var e1 = scope.$eval(attrs.ngModel);
					var e2 = scope.$eval(attrs.passwordMatch);
					return e1 === e2;
				};
				scope.$watch(checker, function(n) {
					ctrl.$setValidity("unique", n);
				});
			}
		};
	}])

	.directive('checkField', ['$http', '$timeout', function($http, $timeout) {
		var checking = null;
		return {
			require: '^ngModel',
			link: function(scope, ele, attrs, c) {
				
				ele.bind('blur', function(event) {

					$http({
						method: 'POST',
						url: '/api/user/check/' + attrs.checkField,
						data: {'field': $(ele).val() }
					}).success(function(response, status, headers, cfg) {
						c.$setValidity('unique', response.data.isUnique);
						checking = null;
					}).error(function(data, status, headers, cfg) {
						checking = null;
					});

				});
			}
		};
	}]);