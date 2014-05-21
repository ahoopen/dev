define(["Application"], function(app) {
	
	var cache = {};

	var $resource = function(src) {
		this.src = src;
		cache[ src ] = this;
	};

	$resource.prototype = {

		check : function() {
			if( this.isChecked ) {
				return;
			}

			var img = new Image();

			img.src = this.src;
			this.isChecked = true;
		},

		onload : function() {

		},

		onerror : function() {

		},

		/**
		* Maakt een afbeelding.
		*
		* @name $resource.image
		* @function
		* @param {string} src image src
		* @returns {boolean} true wanneer 'value' undefined is
		**/
		image : function(src, options) {
			/*
			if( !image.cache ) image.cache = {};
			if( image.cache[src] != null ) {
				return image.cache[src];
			}

			var img = new Image();

			if( img.complete && img.naturalWidth !== undefined ) {
				//
			}

			if(img) {
				return img;
			}

			//
			
			forEach(options, function(option) {
				if( this.$element.isObject(option) ) {

				} else if( this.$element.isFunction(option) ) {

				}
			});
			*/
		}
	};
});