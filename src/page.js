define(["car"], function(app) {
	
	var page = function() {
		// dependencies die gebruikt worden
		this.$dispatcher = null;
		this.$view = null;
		this.$entity = null;
	};

	page.prototype = {

		init : function() {

		},

		isLoaded : function() {
			return true;
		}
	};

});