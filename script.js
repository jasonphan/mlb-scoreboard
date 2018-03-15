var app = angular.module("mlbScoreboard", []);

app.controller("mainCtrl", function($scope, $http) {

	// Hides view button if the list game has status preview.
	$scope.isPreview = function(status) {
		return (status === "Preview") ? true : false;
	}


	// Toggle between home and away view in detail view.
	$scope.toggleTeam = function() {
		$scope.isHomeView = !$scope.isHomeView;
	};


	// Back functionality from detail view to list view.
	$scope.back = function() {
		$scope.isDetailView = !$scope.isDetailView;
		$scope.isHomeView = true;
	};


	// Determines if the home team is the winning team.
	$scope.isHomeWin = function(homeScore, awayScore) {
		return parseInt(homeScore) > parseInt(awayScore);
	};


	// Get list view information when the date changes.
	$scope.dateChange = function() {
		let day, month, year;

		$scope.day = $scope.date.getDate();
		$scope.month = $scope.date.getMonth() + 1;
		$scope.year = $scope.date.getFullYear();

		day = $scope.day.toString();
		month = $scope.month.toString();
		year = $scope.year.toString();

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

			// Reverts back to list view when date is changed.
			if ($scope.isDetailView) $scope.isDetailView = !$scope.isDetailView;

			$scope.isHomeView = true;

		}, function errorCallback(response) {
			$scope.error = response.statusText;
		});

	};


	// Get detailed information for detailed view.
	$scope.getDetailedView = function(game) {
		// JSON get request for detailed data.
		$http({
			method: "GET",
			url: "http://gd2.mlb.com" + game.game_data_directory + "/boxscore.json"

		}).then(function successCallback(response) {
			$scope.detailedData = response.data;
			$scope.isDetailView = !$scope.isDetailView;

		}, function errorCallback(response) {
			$scope.error = response.statusText;
		});

	};

	$scope.date = new Date();
	$scope.dateChange();
	$scope.isDetailView = false;
	$scope.isHomeView = true;

});