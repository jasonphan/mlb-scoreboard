angular
	.module('mlbApp')
	.factory('viewFactory', viewFactory);

function viewFactory() {

	var data = {
		isDetailView: false,
		game: null
	};

	return {
		isDetailView: function() {
			return data.isDetailView;
		},

		changeView: function() {
			data.isDetailView = !data.isDetailView;
		},

		setGame: function(game) {
			data.game = game;
		}, 

		getGame: function() {
			return data.game;
		}
	};

}