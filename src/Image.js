define( [""], function(app) {
	
	var $image = function() {

	};


	$image.prototype = {

		init : function() {
			//
		},

		create : function(src, options) {

		},

		resize : ['$entity', '$router', function($entity, $router) {

		}],

		/**
		* Behoudt de aspect ratio van het orgineel. Handig bij het verkleinen/vergroten
		* van een afbeeldingen om ze passend te maken voor een bepaald gebied.
		*
		* @param {Number} srcWidth Source area width
		* @param {Number} srcHeight Source area height
		* @param {Number} maxWidth Fittable area maximum available width
		* @param {Number} maxHeight Fittable area maximum available height
		* @return {Object} { width, heigth }
		*
		*/
		calculateAspectRatioFit : function(srcWidth, srcHeight, maxWidth, maxHeight) {
			var ratio = [maxWidth / srcWidth, maxHeight / srcHeight ];
			ratio = Math.min(ratio[0],ratio[1]);

			return { width : srcWidth*ratio, height : srcHeight*ratio };
		}
	};

	app.module('$image', $image);
});