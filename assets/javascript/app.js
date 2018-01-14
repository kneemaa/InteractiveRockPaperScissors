// Initialize Firebase
var config = {
	apiKey: "AIzaSyAfwsVbLmqdek-JpQcfYzk0p7WPA0PRdk0",
	authDomain: "online-rock-paper-scissors.firebaseapp.com",
	databaseURL: "https://online-rock-paper-scissors.firebaseio.com",
	projectId: "online-rock-paper-scissors",
	storageBucket: "online-rock-paper-scissors.appspot.com",
	messagingSenderId: "964926270807"
	};
firebase.initializeApp(config);
var db = firebase.database();
var localPlayerName;

var playerOne = {};
var playerTwo = {};

var thisPlayerNumber = "";
var quickPath;

db.ref("players").on("value", function(snapshot){
	var playerOneExists = snapshot.child("One").exists();
	var playerTwoExists = snapshot.child("Two").exists();

	var playerOneChoice = snapshot.child("One/choice").exists();
	var playerTwoChoice = snapshot.child("Two/choice").exists();
	
	var playerOnePick = snapshot.child("One/choice").val();
	var playerTwoPick = snapshot.child("Two/choice").val();

	if (playerOneExists){
		playerOne = snapshot.child("One").val();
	}

	if (playerTwoExists){
		playerTwo = snapshot.child("Two").val();

	}

	if (thisPlayerNumber === "One"){
		console.log(!playerTwo.name);
		if (!playerTwo.name) {
			$(".player2").html("Waiting on Player 2");
		} else {
			$(".player2").html("Waiting on " + playerTwo.name);
		}	
		$(".player1").html(playerOne.name + "<span id='winLoss'></br>Wins: " + playerOne.wins + " | Losses: " + playerOne.losses + "</span>");
		var buildOptions = buildChoices(thisPlayerNumber);
		$(".player1").append(buildOptions);

	} else if (thisPlayerNumber === "Two"){
		if (!playerOne.name) {
			$(".player2").html("Waiting on Player 1");
		} else {
			$(".player2").html("Waiting on " + playerOne.name);
		}	
		$(".player2").html(playerTwo.name + "<span id='winLoss'></br>Wins: " + playerTwo.wins + " | Losses: " + playerTwo.losses + "</span>");
		var buildOptions = buildChoices(thisPlayerNumber);
		$(".player2").append(buildOptions);

	}

	if (!playerOneChoice && thisPlayerNumber === "One"){
		var playerClass = ".player"+thisPlayerNumber;
		var playerId = "#player"+thisPlayerNumber;
		$(".pickZone").on("click", playerClass, function(){
			var theChoiceOne = $(this).attr("attr");
			console.log(theChoiceOne);
			db.ref("players/"+thisPlayerNumber).update({
				choice: theChoiceOne
			})
			$(playerClass).empty();
			$(playerId).empty();
			$(playerId).append("<div class='playerSelection' id='display'>"+theChoiceOne+"</div>");
		})
	} else if (!playerTwoChoice && thisPlayerNumber === "Two"){
		var playerClass = ".player"+thisPlayerNumber;
		var playerId = "#player"+thisPlayerNumber;
		$(".pickZone").on("click", playerClass, function(){
			var theChoiceTwo = $(this).attr("attr");
			console.log(theChoiceTwo);
			db.ref("players/"+thisPlayerNumber).update({
				choice: theChoiceTwo
			})
			$(playerClass).empty();
			$(playerId).empty();
			$(playerId).append("<div class='playerSelection' id='display'>"+theChoiceTwo+"</div>");
		})
	}




	if (playerOneChoice && playerTwoChoice) {
		console.log("repeat");

		db.ref("players/One").child("choice").remove();
		db.ref("players/Two").child("choice").remove();
		//var p1Pick = snapshot.child("One/choice").val();
		//var p2Pick = snapshot.child("Two/choice").val();
		
		if (playerOnePick === playerTwoPick){
			tie();
		} else if (playerOnePick === "Scissors" && playerTwoPick === "Paper"){
			playerOneWin();
		} else if (playerOnePick === "Rock" && playerTwoPick === "Scissors" ) {
			playerOneWin();
		} else if (playerOnePick === "Paper" && playerTwoPick === "Rock"){
			playerOneWin();
		} else if (playerTwoPick === "scissors" && playerOnePick === "Paper"){
			playerTwoWin();
		} else if (playerTwoPick === "Rock" && playerOnePick === "Scissors" ) {
			playerTwoWin();
		} else if (playerTwoPick === "Paper" && playerOnePick === "Rock"){
			playerTwoWin();
		}

	}

	function tie(){
		var p1Pick = snapshot.child("One/choice").val();
		$(".prompt").html(" Tie!<br>You Both Chose "+ p1Pick);
		setTimeout(makeAPick, 1000 * 2);
	}

	function playerOneWin() {
		playerOne.wins++;
		var p1Pick = snapshot.child("One/choice").val();
		var p2Pick = snapshot.child("Two/choice").val();
		$(".prompt").html(playerOne.name + " Wins!<br>"+ p1Pick +" beats " + p2Pick);
		setTimeout(makeAPick, 1000 * 2);
		var pp = snapshot.val();
		if (playerOne.wins !== pp.One.wins){
			db.ref("players/One").update(playerOne);
		}

		playerTwoLoss();
	};
	function playerTwoLoss(){
		playerTwo.losses++;

		var pp = snapshot.val();
		if (playerTwo.losses !== pp.Two.losses){
			db.ref("players/Two").update(playerTwo);
		}
	};

	function playerTwoWin(){
		playerTwo.wins++;
		var p1Pick = snapshot.child("One/choice").val();
		var p2Pick = snapshot.child("Two/choice").val();
		$(".prompt").html(playerTwo.name + " Wins!<br>"+ p2Pick +" beats " + p1Pick);
		setTimeout(makeAPick, 1000 * 2);
		var pp = snapshot.val();
		if (playerTwo.wins !== pp.Two.wins) {
			db.ref("players/Two").update(playerTwo);	
		}
		playerOneLoss();
	};

	function playerOneLoss(){
		playerOne.losses++;
		var pp = snapshot.val();
		if (playerOne.losses !== pp.One.losses) {
			db.ref("players/One").update(playerOne);
		}
	};
	

}, function(errorObject){
	console.log("Error reading snapshot" + errorObject);
});


//display options
function buildChoices(playerNumber){
	var rock = "<div class=player"+playerNumber+" attr='Rock'>Rock</div>";
	var paper = "<div class=player"+playerNumber+" attr='Paper'>Paper</div>";
	var scissors = "<div class=player"+playerNumber+" attr='Scissors'>Scissors</div>";

	var output = rock + paper + scissors;
	return output;
};

function makeAPick(){
	$(".prompt").html("Make a Pick.");
};

$("#submitName").on("click",function(event){
	event.preventDefault();

	localPlayerName = $("#name").val().trim();
	if (!playerOne.name) {
		makeAPick();
		thisPlayerNumber = "One";
		db.ref("players").update({
			One: {
				name: localPlayerName,
				wins: 0,
				losses: 0
			}
		})
	} else if (!playerTwo.name && playerOne.name) {
		thisPlayerNumber = "Two";
		makeAPick();
		db.ref("players").update({
			Two: {
				name: localPlayerName,
				wins: 0,
				losses: 0
			}
		})
	}

	quickPath = db.ref("players/"+thisPlayerNumber);

	quickPath.onDisconnect().remove();
	checkName(localPlayerName);
})


function checkName(nameToCheck){
	if (nameToCheck) {
		$(".nameInput").html("Hello " + nameToCheck +"! You're Player "+thisPlayerNumber+".");
	}

};

