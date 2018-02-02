var today = new Date();
var payload; // Information to display.
var singleGame; // Boolean whether game object is a single game or an array.
var detailPayload; // Detailed information to display.
var homeView; // True when home is showing, False when away is showing.


// Toggle between detail home and away view.
function toggleView() {

	// View is currently on the home team, switch to away team.
	if (homeView) {
		$("#detailHome").hide();
		$("#detailAway").show();

	// View is currently on the away team, switch to home team.
	} else {
		$("#detailAway").hide();
		$("#detailHome").show();
	}

	homeView = !homeView;
}


// Generate all the options for the select menus.
function generateOptions() {
	let year = today.getFullYear();
	let monthNames = ["January", "February", "March", "April", "May", 
					"June", "July", "August", "September", "October",
					"November", "December"];
	let teamNames = ["Angels", "Astros", "Athletics", "Blue Jays", 
					"Braves", "Brewers", "Cardinals", "Cubs", 
					"D-backs", "Dodgers", "Giants", "Indians", 
					"Mariners", "Marlins", "Mets", "Nationals", 
					"Orioles", "Padres", "Phillies", "Pirates", 
					"Rangers", "Rays", "Red Sox", "Reds", "Rockies", 
					"Royals", "Tigers", "Twins", "White Sox", "Yankees"];

	// Generate all the months.
	monthNames.forEach(function(month, index) {
		$("#month").append("<option value=" + index + ">" + month +
							"</option>");
	});

	// Generate all the days.
	let numDays = new Date(year, today.getMonth() + 1, 0).getDate();
	for (let d = 1; d <= numDays; d++) {
		$("#day").append("<option value=" + d + ">" + d + "</option>");
	}

	// Generate years from 2010 to current.
	for (let y = 2010; y <= year; y++) {
		$("#year").append("<option value=" + y + ">" + y + "</option>");
	}

	// Generate all the team names.
	for (let t of teamNames) {

		// By default Blue Jays is selected.
		if (t === "Blue Jays") {
			$("#team").append("<option value='" + t + "' selected='true'>" +
							 t + "</option>");
		} else {
			$("#team").append("<option value='" + t + "'>" + t + "</option>");
		}
	}
}


// Set the default values of the date select to be the current day.
function setDefaultDate() {
	let year = today.getFullYear();
	let month = today.getMonth();
	let dayOfMonth = today.getDate();

	$("#year").val(year);
	$("#month").val(month);
	$("#day").val(dayOfMonth);
}


// Updates the number of days for when a month changes.
function updateDaysOfMonth(numDays) {
	let tmpDay = $("#day").val();

	$("#day").empty();

	for (let d = 1; d <= numDays; d++) {
		$("#day").append("<option value=" + d + ">" + d + "</option>");
	}

	$("#day").val( (tmpDay > numDays) ? numDays : tmpDay );
}


// Get the data for list view.
function getData(year, month, day) {
	let padMonth = month;
	let padDay = day;

	if (month.length === 1) padMonth = "0" + month;
	if (day.length === 1) padDay = "0" + day;

	$.ajax({
		type: "GET",
		dataType: "json",
		url: "http://gd2.mlb.com/components/game/mlb/year_" +
			year + "/month_" + padMonth + "/day_" + padDay +
			"/master_scoreboard.json",

		success: function(data) {

			// No games no this day.
			if (data.data.games.game === undefined) {
				payload = null;

			// Game could be a single game or an array.
			} else {
				payload = data.data.games.game;
				singleGame = (payload.hasOwnProperty("home_team_name")) ? true : false;
			}

			// Display the data into list view.
			displayData();
		},

		error: function() {
			console.log("Failed to retrieve JSON data.");
		}
	});
}


// Get the detailed data for detail view.
function getDetailedData(index) {
	let url = (!singleGame) ? "http://gd2.mlb.com" + payload[index].game_data_directory + "/boxscore.json" :
								"http://gd2.mlb.com" + payload.game_data_directory + "/boxscore.json";

	$.ajax({
		type: "GET",
		dataType: "json",
		url: url,

		success: function(data) {
			detailPayload = data.data.boxscore;
			displayDetailData();
		},

		error: function() {
			console.log("Failed to retrieve JSON data.");
		}
	});
}


// Displays detailed data into the detail view.
function displayDetailData() {
	let inningScore = detailPayload.linescore.inning_line_score;

	$("#detailView").empty();

	// Display line scores for both home and away team.
	$("#detailView").append("<table><tr><th style='width:50px'></th><th>1</th><th>2</th>" +
    						"<th>3</th><th>4</th><th>5</th><th>6</th>" +
    						"<th>7</th><th>8</th><th>9</th><th>R</th>" +
    						"<th>H</th><th>E</th></tr>" +

    						"<tr><td style='width:50px; text-align:left'>" + detailPayload.home_team_code.toUpperCase() + "</td>" +
    						"<td>" + inningScore[0].home + "</td><td>" + inningScore[1].home + "</td>" +
    						"<td>" + inningScore[2].home + "</td><td>" + inningScore[3].home + "</td>" +
    						"<td>" + inningScore[4].home + "</td><td>" + inningScore[5].home + "</td>" +
    						"<td>" + inningScore[6].home + "</td><td>" + inningScore[7].home + "</td>" +
    						"<td>" + inningScore[8].home + "</td>" +
    						"<td style='width:15px'>" + detailPayload.linescore.home_team_runs + "</td>" +
    						"<td style='width:15px'>" + detailPayload.linescore.home_team_hits + "</td>" +
    						"<td style='width:15px'>" + detailPayload.linescore.home_team_errors + "</td></tr>" +

    						"<tr><td style='width:50px; text-align:left'>" + detailPayload.away_team_code.toUpperCase() + "</td>" +
    						"<td>" + inningScore[0].away + "</td><td>" + inningScore[1].away + "</td>" +
    						"<td>" + inningScore[2].away + "</td><td>" + inningScore[3].away + "</td>" +
    						"<td>" + inningScore[4].away + "</td><td>" + inningScore[5].away + "</td>" + 
    						"<td>" + inningScore[6].away + "</td><td>" + inningScore[7].away + "</td>" +
    						"<td>" + inningScore[8].away + "</td>" + 
    						"<td>" + detailPayload.linescore.away_team_runs + "</td>" +
    						"<td>" + detailPayload.linescore.away_team_hits + "</td>" + 
    						"<td>" + detailPayload.linescore.away_team_errors + "</td></tr>" +
    						"</table><br>");

	// Header for detail home team view.
	$("#detailView").append("<div id='detailHome'>" +
							"<label><strong>" + detailPayload.home_fname + "</strong>" +
							" | " + detailPayload.away_fname + "</label>" +
							"<br><br><table>" +
							"<tr><th style='width:100px; text-align:left'>Name</th><th>AB</th>" +
							"<th>R</th><th>H</th><th>RBI</th><th>BB</th>" +
							"<th>SO</th><th>AVG</th></tr></table></div>");

	// Display home team batter stats.
	for (let i = 0; i < detailPayload.batting[0].batter.length; i++) {
		$("#detailHome table").append("<tr>" +
								"<td style='width:100px; text-align:left'>" + detailPayload.batting[0].batter[i].name + "</td>" +
								"<td>" + detailPayload.batting[0].batter[i].ab + "</td>" +
								"<td>" + detailPayload.batting[0].batter[i].r + "</td>" +
								"<td>" + detailPayload.batting[0].batter[i].h + "</td>" +
								"<td>" + detailPayload.batting[0].batter[i].rbi + "</td>" +
								"<td>" + detailPayload.batting[0].batter[i].bb + "</td>" +
								"<td>" + detailPayload.batting[0].batter[i].so + "</td>" +
								"<td>" + detailPayload.batting[0].batter[i].avg + "</td>" +
								"</tr>");
	}

	// Display button to toggle between home and away.
	$("#detailHome").append("<br><button type='button' onclick='toggleView()'>Toggle Team</button><br><br>");


	// Header for detail away team view.
	$("#detailView").append("<div id='detailAway'>" +
							"<label>" + detailPayload.home_fname +
							" | " + "<strong>" + detailPayload.away_fname + "</strong></label>" +
							"<br><br><table>" +
							"<tr><th style='width:100px; text-align:left'>Name</th><th>AB</th>" +
							"<th>R</th><th>H</th><th>RBI</th><th>BB</th>" +
							"<th>SO</th><th>AVG</th></tr></table></div>");

	// Display away team batter stats.
	for (let i = 0; i < detailPayload.batting[1].batter.length; i++) {
		$("#detailAway table").append("<tr>" +
								"<td style='width:100px; text-align:left'>" + detailPayload.batting[1].batter[i].name + "</td>" +
								"<td>" + detailPayload.batting[1].batter[i].ab + "</td>" +
								"<td>" + detailPayload.batting[1].batter[i].r + "</td>" +
								"<td>" + detailPayload.batting[1].batter[i].h + "</td>" +
								"<td>" + detailPayload.batting[1].batter[i].rbi + "</td>" +
								"<td>" + detailPayload.batting[1].batter[i].bb + "</td>" +
								"<td>" + detailPayload.batting[1].batter[i].so + "</td>" +
								"<td>" + detailPayload.batting[1].batter[i].avg + "</td>" +
								"</tr>");
	}

	// Display button to toggle between home and away.
	$("#detailAway").append("<br><button type='button' onclick='toggleView()'>Toggle Team</button><br><br>");

	// Hide away team view.
	$("#detailAway").hide();

	// By default home view is showing.
	homeView = true;
}


// Displays data from payload into list view.
function displayData() {

	// Clear list view.
	$("#listView").empty();

	// No games on this day.
	if (payload === null) {
		$("#listView").append("<h1 style='text-align:center'>No games today</h1>");

	// There are games.
	} else {
		let homeName, awayName;
		let homeScore, awayScore;
		let status;

		// Single game.
		if (singleGame) {
			homeName = payload.home_team_name;
			awayName = payload.away_team_name;
			status = payload.status.status;

			// Game is not postponed.
			if (payload.hasOwnProperty("linescore")) {
				homeScore = parseInt(payload.linescore.r.home);
				awayScore = parseInt(payload.linescore.r.away);

			// Game is postponed.
			} else {
				homeScore = "";
				awayScore = "";
			}

			if (status === "Postponed" || status === "Cancelled" || status === "Preview") {
				$("#listView").append("<div id='game_0'><p>" + 
									homeName + "<br>" + awayName + "<br>" +
									status + "</p></div>");
			
			// Game is not cancelled or postponed.
			} else {
				let homeWin = (homeScore > awayScore) ? true : false;

				// Display the winning team and their score in bold.
				if (homeWin) {
					$("#listView").append("<div class='games' id='game_0'><p><strong>" + 
										homeName + "<span style='float:right'>" + 
										homeScore + "</span></strong>" + "<br>" +
										awayName + "<span style='float:right'>" +
										awayScore + "</span>" + "<br>" + status +
										"</p>");
				} else {
					$("#listView").append("<div class='games' id='game_0'><p>" + 
										homeName + "<span style='float:right'>" +
										homeScore + "</span>" + "<br><strong>" +
										awayName + "<span style='float:right'>" +
										awayScore + "</span></strong>" + "<br>" +
										status + "</p>");
				}
			}

			
		// There are multiple games.
		} else {
			let len = payload.length;
			let favIndex;
			let favTeam = $("#team").val();

			// Go through all games and get the index of the favourite team.
			for (let x = 0; x < len; x++) {
				if (payload[x].home_team_name === favTeam || payload[x].away_team_name === favTeam) {
					favIndex = x;
					break;
				}
			}

			// Remove the favourite team from payload and insert at front.
			let tmpTeam = payload.splice(favIndex, 1)[0];
			payload.unshift(tmpTeam);

			// Go through each game and display games into list view.
			for (let i = 0; i < len; i++) {
				homeName = payload[i].home_team_name;
				awayName = payload[i].away_team_name;
				status = payload[i].status.status;

				// Game is not postponed.
				if (payload[i].hasOwnProperty("linescore")) {
					homeScore = parseInt(payload[i].linescore.r.home);
					awayScore = parseInt(payload[i].linescore.r.away);

				// Game is postponed.
				} else {
					homeScore = "";
					awayScore = "";
				}

				if (status === "Postponed" || status === "Cancelled" || status === "Preview") {
					$("#listView").append("<div id='game_'" +
										i + "'><p>" + homeName + "<br>" +
										awayName + "<br>" + status + "</p></div>");

				// Game is not cancelled or postponed.	
				} else {
					let homeWin = (homeScore > awayScore) ? true : false;

					// Display the winning team and their score in bold.
					if (homeWin) {
						$("#listView").append("<div class='games' id='game_" +
											i + "'><p><strong>" + homeName + 
											"<span style='float:right'>" + homeScore +
											"</span></strong>" + "<br>" + awayName +
											"<span style='float:right'>" + awayScore +
											"</span>" + "<br>" + status + "</p></div>");
					} else {
						$("#listView").append("<div class='games' id='game_" + i + 
											"'><p>" + homeName + "<span style='float:right'>" +
											homeScore + "</span>" + "<br><strong>" + 
											awayName + "<span style='float:right'>" + 
											awayScore + "</span></strong>" +
											"<br>" + status + "</p></div>");
					}
				}
			}
		}
	}

	$("#detailView").hide();
	$("#listView").show();
	$("#back").hide();
}


$(document).ready(function(){

	generateOptions(); // Generate options for the date selection menu.
	setDefaultDate(); // Set the default date of the selection to be today.
	getData($("#year").val(), (parseInt($("#month").val()) + 1).toString(), $("#day").val()); // Load todays data.


	// Hide both detail view and button to go back from detail to list view.
	$("#back").hide();
	$("#detailView").hide();


	// Event handler to go from list view to detailed view.
	$("div").on("click", ".games", function() {
		let gameIndex = $(this).index();

		$("#listView").hide();
		$("#back").show();
		$("#detailView").show();

		// Get detailed data and display it into detail view.
		getDetailedData(gameIndex);
	});


	// Event handler for displaying list view when team changes.
	$("#team").change(function() {
		displayData();
	});


	// Event handler for modifying the number of days when given a month and year.
	$("#month, #year").each(function() {
		$(this).change(function() {
			updateDaysOfMonth(new Date($("#year").val(), parseInt($("#month").val()) + 1, 0).getDate());
			getData($("#year").val(), (parseInt($("#month").val()) + 1).toString(), $("#day").val());
		});
	});


	// Event handler for displaying list view when the day changes.
	$("#day").change(function() {
		getData($("#year").val(), (parseInt($("#month").val()) + 1).toString(), $("#day").val());
	});


	// Event handler for when prev button is clicked.
	$("#prev").click(function() {
		let day = $("#day").val();
		let year = $("#year").val();
		let month = $("#month").val();
		let numDays;

		// First day of the month.
		if (parseInt(day) === 1) {

			// If month is January, then previous month should be December.
			// The year also gets set back by 1.
			if (parseInt(month) === 0) { 
				numDays = new Date(year, 11 + 1, 0).getDate();

				updateDaysOfMonth(numDays);

				// Update month and year option.
				$("#month").val(11);
				$("#year").val(parseInt(year) - 1);

			// Decrement month by 1.
			} else {
				// Get the number of days for the previous month.
				numDays = new Date(year, month, 0).getDate();

				updateDaysOfMonth(numDays);

				$("#month").val(parseInt(month) - 1);
			}

			// Update the day option to correspond with the new month and year.
			$("#day").val(numDays);

		// Update the day to be the day before.
		} else {
			$("#day").val(parseInt(day) - 1);
		}

		getData($("#year").val(), (parseInt($("#month").val()) + 1).toString(), $("#day").val());
	});


	// Event handler for when next button is clicked.
	$("#next").click(function() {
		let day = $("#day").val();
		let month = $("#month").val();
		let year = $("#year").val();
		let numDays = new Date(year, parseInt(month) + 1, 0).getDate();

		// End of month. Set month to next month and day to 1.
		if (parseInt(day) === numDays) { 

			updateDaysOfMonth(new Date(year, parseInt(month) + 2, 0).getDate());

			// If month is December, set month to January and year to the next.
			if (parseInt(month) === 11) {

				updateDaysOfMonth(31); 

				$("#month").val(0);
				$("#year").val(parseInt(year) + 1);

			} else {
				$("#month").val(parseInt(month) + 1);
			}

			// Update the day to be first day of the month.
			$("#day").val(1);

		// Update day to be the next day.
		} else {
			$("#day").val(parseInt(day) + 1);
		}

		getData($("#year").val(), (parseInt($("#month").val()) + 1).toString(), $("#day").val());
	});


	// Event handler for when back button is clicked.
	$("#back").click(function() {
		$("#listView").show();
		$("#detailView").hide();
		$(this).hide();
	});

});