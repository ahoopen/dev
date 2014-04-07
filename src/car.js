define(function() {

	var Car = function(config) {
	    this.name = config.name;
	    this.engineSize = config.engineSize;
	    this.wheels = 3;
	    this.fuel = 100;
	};

	Car.prototype.getEngineSize = function() {
		var test = {};
		test.lala = 7;
	    return this.engineSize;
	};

	Car.prototype.getWheels = function() {
		return this.wheels;
	};
	Car.prototype.getColour = function() {
		return 'blauw23';
	};

	Car.prototype.start = function() {
		if(this.fuel === 0 ) {
			return false;
		}

		this.isRunning = true;
		return true;
	};

	Car.prototype.break = function() {
		if( this.isRunning ) {
			this.isRunning = false;
		}
	};

	return Car;
});