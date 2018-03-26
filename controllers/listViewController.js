angular
	.module('mlbApp')
	.controller('listViewCtrl', listViewCtrl);

listViewCtrl.$inject = ['$scope', '$http', 'viewFactory'];


function listViewCtrl($scope, $http, viewFactory) {

	// Get list view information when the date changes.
	$scope.dateChange = function() {
		let day, month, year;

		day = ($scope.date.getDate()).toString();
		month = ($scope.date.getMonth() + 1).toString();
		year = ($scope.date.getFullYear()).toString();

		if (day.length === 1) day = "0" + day;
		if (month.length === 1) month = "0" + month;

		// JSON get request for list data.
		$http({
			method: "GET",
			url: "http://gd2.mlb.com/components/game/mlb/year_" +
				year + "/month_" + month + "/day_" + day +
				"/master_scoreboard.json"

		}).then(function successCallback(response) {
			$scope.data = response.data;

			// No games today
			if ($scope.data.data.games.game === undefined) {
				$scope.noGames = true;
			} else {
				$scope.noGames = false;
			}

		}, function errorCallback(response) {
			$scope.error = response.statusText;
		});
	};


	// Changes view from list view to detailed.
	$scope.getDetailedView = function(game) {
		viewFactory.setGame(game);
		viewFactory.changeView();
	};


	// Determines if the home team is the winning team.
	$scope.isHomeWin = function(homeScore, awayScore) {
		return parseInt(homeScore) > parseInt(awayScore);
	};


	// Hides view button if the list game has status preview.
	$scope.isPreview = function(status) {
		return (status === "Preview") ? true : false;
	}

	$scope.date = new Date();
	$scope.dateChange();

	$scope.$watch(function() { return viewFactory.isDetailView(); }, function(newValue, oldValue) {
		if (newValue !== oldValue) {
			$scope.isDetailView = viewFactory.isDetailView();
		}
	});
}
