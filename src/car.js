function Car(config) {
    this.name = config.name;
    this.engineSize = config.engineSize;
    this.wheels = 4;
}
Car.prototype.getEngineSize = function() {
    return this.engineSize;
};

Car.prototype.getWheels = function() {
	return this.wheels;
};
Car.prototype.getColour = function() {
	return 'blauw23';
};


module.exports = Car;