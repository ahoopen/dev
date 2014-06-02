var angularTest = angular.module('angularTest', []);

function mainController($scope, $http) {

	$http.get('/api/users')
		.success( function(data) {
			$scope.todos = data;
			console.log("success: ", data );
		})
		.error( function(data) {
			console.log("error: ", data);
		});
}