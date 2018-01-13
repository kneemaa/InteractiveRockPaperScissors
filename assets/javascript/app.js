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

db.ref("players").on("value", function(snapshot){
	const playerOneExists = snapshot.child('one').exists();
	const playerTwoExists = snapshot.child('two').exists();

	if (!playerOneExists) {
		db.ref("/one").update({
			name: localPlayerName,
			wins: 0,
			losses: 0
		})
	}

	if (!playerTwoExists) {
		db.ref("/two").update({
			name: localPlayerName,
			wins: 0,
			losses: 0
		})
	}
}, function(errorObject){
	console.log("Error reading snapshot" + errorObject);
});

$("#submitName").on("click",function(event){
	event.preventDefault();


	localPlayerName = $("#name").val().trim();

	db.ref("/players").update({
		one: {
			name: localPlayerName,
			wins: 0,
			losses: 0,
			choice: ''
		},
	}),function(errorObject){
		console.log("Error reading snapshot" + errorObject);
	};

	checkName(localPlayerName);

})


//I Replace the name input field with the player's name
function checkName(nameToCheck){
	if (nameToCheck) {
		$(".nameInput").html("Hello " + nameToCheck +"! You're Player 1.");
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
