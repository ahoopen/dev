var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
	console.log('connectie open :)');



	var silence = new Kitten({ name: 'Silence' })
	console.log(silence.name) // 'Silence'

});

	var kittySchema = mongoose.Schema({
    	name: String
	});

	var Kitten = mongoose.model('Kitten', kittySchema);

mongoose.connect('mongodb://localhost/test');