
var JSONResponse = function() {
	this.response = {};
};


JSONResponse.prototype = {

	/**
	* Een JSONResponse kan verschillende statussen hebben.
	* - success : Alles ging goed, en ( meestal ) is er wat data terug gegeven.  
	* - fail	: Er heeft zich een probleem opgetreden met de data, of er is voldaan aan een van de pre-condities van de api call.
	* - error	: Een fout heeft opgetreden in het verwerken van het request, bijv een exceptie is gegooit.
	*
	**/
	setStatus : function(status) {
		var statusTypes = ['success','fail', 'error'];

		for( var i = 0, len = statusTypes.length; i < len; i++ ) {
			if( statusTypes[i] === status.toLowerCase() ) {
				this.response.status = status;
				return;
			}
		}

		throw Error;
	},

	/**
	* Data treedt op als de wrapper voor elke response die de api terug geeft. Als de call
	* geen data terug geeft, dan moet deze ingesteld worden op null.
	*
	**/
	setPayload : function(value) {
		this.response.data = value;
	},

	getResponse : function() {
		return this.response;
	}
};

exports.JSONResponse = JSONResponse;