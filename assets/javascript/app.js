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
var playerObj = {
	name: "",
	wins: 0,
	losses: 0
};


var rpsOptions = [
	"Rock",
	"Paper",
	"Scissors"
	];

var playerOne = {};
var playerTwo = {};

var thisPlayerNumber = "";
var quickPath;

db.ref("players").on("value", function(snapshot){
	const playerOneExists = snapshot.child("One").exists();
	const playerTwoExists = snapshot.child("Two").exists();

	const playerOneChoice = snapshot.child("One/choice").exists();
	const playerTwoChoice = snapshot.child("Two/choice").exists();
	

	if (playerOneExists){
		playerOne = snapshot.child("One").val();
	}

	if (playerTwoExists){
		playerTwo = snapshot.child("Two").val();
		console.log(playerTwo);
	}

	if (thisPlayerNumber === "One"){

		$(".player2").html("Waiting on Player 2");
		$(".player1").html(playerOne.name);
		var buildOptions = buildChoices(thisPlayerNumber);
		$(".player1").append(buildOptions);

	} else if (thisPlayerNumber === "Two"){

		$(".player1").html("Waiting on Player 1");
		$(".player2").html(playerTwo.name);
		var buildOptions = buildChoices(thisPlayerNumber);
		$(".player2").append(buildOptions);

	}
	
	if (!playerOneChoice && thisPlayerNumber === "One"){
		var playerClass = ".player"+thisPlayerNumber;
		var playerId = "#player"+thisPlayerNumber;
			$(".pickZone").on("click", playerClass, function(){
				var theChoice = $(this).attr("attr");
				console.log(theChoice);
				db.ref("players/"+thisPlayerNumber).update({
					choice: theChoice
				})
				$(playerClass).empty();
				$(playerId).append("<div class=playerSelection>You chose "+ theChoice);
			})
	} else if (!playerTwoChoice && thisPlayerNumber === "Two"){
		var playerClass = ".player"+thisPlayerNumber;
		var playerId = "#player"+thisPlayerNumber;
			$(".pickZone").on("click", playerClass, function(){
				var theChoice = $(this).attr("attr");
				console.log(theChoice);
				db.ref("players/"+thisPlayerNumber).update({
					choice: theChoice
				})
				$(playerClass).empty();
				$(playerId).append("<div class=playerSelection>You chose "+ theChoice);
			})
	}
	
	

}, function(errorObject){
	console.log("Error reading snapshot" + errorObject);
});


//display options
function buildChoices(playerNumber){
	var rock = "<div class=player"+playerNumber+" attr='rock'>Rock</div>";
	var paper = "<div class=player"+playerNumber+" attr='paper'>paper</div>";
	var scissors = "<div class=player"+playerNumber+" attr='scissors'>scissors</div>";

	var output = rock + paper + scissors;
	return output;
}



$("#submitName").on("click",function(event){
	event.preventDefault();

	localPlayerName = $("#name").val().trim();
	if (!playerOne.name) {
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
		db.ref("players").update({
			Two: {
				name: localPlayerName,
				wins: 0,
				losses: 0
			}
		})
	}
	console.log(playerTwo.name);
	quickPath = db.ref("players/"+thisPlayerNumber);

	quickPath.onDisconnect().remove();
	checkName(localPlayerName);

})


//I Replace the name input field with the player's name
function checkName(nameToCheck){
	if (nameToCheck) {
		$(".nameInput").html("Hello " + nameToCheck +"! You're Player "+thisPlayerNumber+".");
	}

}

/*db.ref().on("value"), function(snapshot) {
	

}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
}*/


/*function displayRPS(){
	$(".player1").empty();

}*/

checkName(localPlayerName);
