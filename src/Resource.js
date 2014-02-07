define(["Application"], function(app) {
	
	var $resource = function() {
		this.$element = null;
	};

	$resource.prototype = {

		/**
		* Maakt een afbeelding.
		*
		* @name $resource.image
		* @function
		* @param {string} src image src
		* @returns {boolean} true wanneer 'value' undefined is
		**/
		image : function(src, options) {

			//
			forEach(options, function(option) {
				if( this.$element.isObject(option) ) {
					
				} else if( this.$element.isFunction(option) ) {

				}
			});
		}
	};
});