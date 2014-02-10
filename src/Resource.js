define(["Element"], function($element) {
	
	
	var $resource = function(Element) {
		
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
			var img = $(src);

			//if(img) {
			//	src = options.src || img.src;
			//} else {
				img = document.createElement('img');
				src = src || options.src;
			//}

			if (!src) {
				return null;
			}

			img = this.setImageProperties(img, options);

			var prop = this.$element.isUndefined(img.naturalWidth) ? 'width' : 'naturalWidth';
			img.src = src;

		    // Loaded?
		    if (img.complete) {
		        if (img[prop]) {
		            if ( this.$element.isFunction(options.success) ) {
		                options.success.call(img);
		            }
		        } else {
		            if ( this.$element.isFunction(options.failure) ) {
		                options.failure.call(img);
		            }
		        }
		    } else {
		        if ( this.$element.isFunction(options.success) ) {
		            img.onload = options.success;
		        }
		        if ( this.$element.isFunction(options.failure) ) {
		            img.onerror = options.failure;
		        }
		    }

		    return img;
		},

		/**
		* zet de afbeelding properties.
		*
		* @name $resource.setImageProperties
		* @function
		* @param {Object} img image object
		* @param {Array} properties array met afbeelding eigenschappen.
		* @returns {Object} image object
		**/
		setImageProperties : function(img, properties) {
			var attributes = ['align', 'alt', 'border', 'height', 'name', 'src', 'width', 'longDesc', 'id', 'class'],
				self = this;

			this.$element.forEach( properties, function(property) {
				var attribute = self.$element.contains(attributes, property);
				if ( attribute ) {
					img[attribute] = property;
				}
			});

			return img;
		},

		imageComplete : function() {

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

	return $resource;
});