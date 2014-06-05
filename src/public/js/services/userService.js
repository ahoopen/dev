angular.module('userService', [])
	
	/**
	* Elke functie geeft een promise object terug
	**/
	.factory('User', function($http) {
		return {
			get : function() {
				return $http.get('/api/user/get');
			},
			create : function(data) {
				return $http.post('/api/user/create', data);
			},
			delete : function(id) {
				return $http.delete('/api/user/delete/' + id);
			}
		};
	});