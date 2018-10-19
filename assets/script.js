  // Initialize Firebase
var config = {
    apiKey: "AIzaSyBA9DJPk6nPXV00foi71cva9ADvpWx1vY4",
    authDomain: "train-scheduler-c2c2d.firebaseapp.com",
    databaseURL: "https://train-scheduler-c2c2d.firebaseio.com",
    projectId: "train-scheduler-c2c2d",
    storageBucket: "train-scheduler-c2c2d.appspot.com",
    messagingSenderId: "334508516717"
};

firebase.initializeApp(config);

var trainData = firebase.database();

$("#add-train-btn").on("click", function() {

// Grabs user input
var trainName = $("#train-name-input").val().trim();
var destination = $("#destination-input").val().trim();
var firstTrain = $("#first-train-input").val().trim();
var frequency = $("#frequency-input").val().trim();

// Creates local "temporary" object for holding train data
var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
};

// Uploads train data to the database
trainData.ref().push(newTrain);

// Logs everything to console
console.log(newTrain.name);
console.log(newTrain.destination);
console.log(newTrain.firstTrain);
console.log(newTrain.frequency);

alert("Train successfully added");

// Clears all of the text-boxes
$("#train-name-input").val("");
$("#destination-input").val("");
$("#first-train-input").val("");
$("#frequency-input").val("");

// Determine when the next train arrives.
return false;
});

// adding trains to the database and a row in the html when a user adds an entry
trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {

console.log(childSnapshot.val());

var tName = childSnapshot.val().name;
var tDestination = childSnapshot.val().destination;
var tFrequency = childSnapshot.val().frequency;
var tFirstTrain = childSnapshot.val().firstTrain;

var timeArr = tFirstTrain.split(":");
var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
var maxMoment = moment.max(moment(), trainTime);
var tMinutes;
var tArrival;

if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");

} else {
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFrequency - tRemainder;
    
    tArrival = moment().add(tMinutes, "m").format("hh:mm A");

}
console.log("tMinutes:", tMinutes);
console.log("tArrival:", tArrival);

$("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
        tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
});
  