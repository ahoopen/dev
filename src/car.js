define(function() {

	var Car = function(config) {
	    this.name = config.name;
	    this.engineSize = config.engineSize;
	    this.wheels = 4;
	    this.fuel = 100;
	};

	Car.prototype.getEngineSize = function() {
		var test = {};
		test.lala = 2;
	    return this.engineSize;
	};

	Car.prototype.getWheels = function() {
		return this.wheels;
	};
	Car.prototype.getColour = function() {
		return 'blauw23';
	};

	Car.prototype.start = function() {
		if(this.fuel == 0 ) {
			return false;
		}

		return true;
	};

	return Car;
});