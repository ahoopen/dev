/**
var host = document.location.host;
var socket = io.connect(host);

socket.on('connect', function(data) {

	// remote is connected
	socket.emit('remote');

	onGesture();
});


// Installeer de remote gestures
function onGesture() {
	var gestures = ['swipeLeft', 'swipeRight', 'swipeUp', 
					'swipeDown', 'tap'];

	gestures.forEach( function(type) {
		$$('.controle').on( type, function(event) {
			event.preventDefault();

			switch(type) {
				case 'swipeLeft':
					onSwipeLeft();
					break;
				case 'swipeRight':
					onSwipeRight();
					break;
				case 'swipeUp':
					onSwipeUp();
					break;
				case 'swipeDown':
					onSwipeDown();
					break;
				case 'tap':
					onTap();
					break;
			}
		});
	});
};

function onSwipeLeft() {
	socket.emit('controll',{ action:"swipeLeft" }); 
}

function onSwipeRight() {
	socket.emit('controll',{ action:"swipeRight"}); 
}

function onSwipeUp() {
	socket.emit('controll',{ action:"swipeUp"}); 
}

function onSwipeDown() {
	socket.emit('controll',{ action:"swipeDown"}); 	
}

function onTap() {
	socket.emit('controll',{ action:"tap"}); 
}
*/