define( ["Application", "Resource"], function(app, Resource) {
	
	var $image = function(img) {
		this.img = img;
	};


	$image.prototype = {

		init : function() {
			//
		},

		check : function() {
			/*
			var resource = cache[ this.img.src ] || new Resource(this.img.src);
			if( resource.isConfirmed ) {
				// cache gebruikt
				return;
			}

			//
			if( this.img.complete && this.img.naturalWidth !== undefined ) {

				return;
			}
			*/


		},

		create : function(src, options) {

		},

		resize : ['$entity', '$router', function($entity, $router) {

		}],

		progress : function() {

		},

		complete : function() {

		},

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