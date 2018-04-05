angular
	.module('mlbApp')
	.controller('detailViewCtrl', detailViewCtrl);

detailViewCtrl.$inject = ['$scope', '$http', 'viewFactory'];


function detailViewCtrl($scope, $http, viewFactory) {

	// Toggle between home and away view in detail view.
	$scope.toggleTeam = function() {
		$scope.isHomeView = !$scope.isHomeView;
	};


	// Back functionality from detail view to list view.
	$scope.back = function() {
		viewFactory.changeView();
	};

	// Get detailed information for detailed view.
	$scope.getDetailedView = function(game) {
		// JSON get request for detailed data.
		$http({
			method: "GET",
			url: "http://gd2.mlb.com" + game.game_data_directory + "/boxscore.json"

		}).then(function successCallback(response) {
			$scope.detailedData = response.data;
			$scope.isHomeView = true;
			$scope.runsHeadings = $scope.generateHeadings();

		}, function errorCallback(response) {
			$scope.error = response.statusText;
		});

	};


	// Generate the headings for runs.
	$scope.generateHeadings = function() {
		let lineScore = $scope.detailedData.data.boxscore.linescore.inning_line_score;
		let runsHeadings = [''];

		lineScore.forEach(function(elt, ind) {
			runsHeadings.push((ind + 1).toString());
		});

		return runsHeadings.concat(['R', 'H', 'E']);
	};


	$scope.batterHeadings = ['Name', 'AB', 'R', 'H', 'RBI', 'BB', 'SO', 'AVG'];

	$scope.$watch(function() { return viewFactory.isDetailView(); }, function(newValue, oldValue) {
		if (newValue !== oldValue) {
			$scope.isDetailView = viewFactory.isDetailView();
			$scope.getDetailedView(viewFactory.getGame());
		}
	});

	

}
