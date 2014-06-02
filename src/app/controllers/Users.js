
exports.signup = function(request, response) {
	response.sendfile( app.get('rootPath') + '/public/index.html');
};