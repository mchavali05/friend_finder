var express = require('express');
var app = express();
//var friends = require('./friends');
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
//.env - for db connection
//require("dotenv").config();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
	extended: true
}));

//localhost db connection
// var connection = mysql.createConnection({
// 	  host: "localhost",

// 	  // Your port; if not 3306
// 	  port: 3306,

// 	  // Your username
// 	  user: "root",

// 	  // Your password
// 	  password: "",
// 	  database: "friends_db"
// });

//heroku db connection
var connection = mysql.createConnection(process.env.JAWSDB_URL);
//friend route
// app.get('/friends', function(req, res) {
// 	connection.query('SELECT * FROM users;', function(error, results){
// 		res.send(results);
// 	});
// })

//post route
app.post('/friends', function(req, res) {
	
	// console.log(myValues);
	// res.send(myValues);
	//get values from db, then convert scores into array.
	//use myValues to compare against users in the db
	//determine which friend is scores similar to mine
	//then send back one friend through res.send(myChosenFriend)
	var friends = [];
	connection.query('SELECT * FROM users;', function(error, results){
		for(var i=0; i<results.length; i++){
			var newObject = {
				id: results[i].id,
				name: results[i].name,
				photo: results[i].photo,
				scores: [results[i].score1, results[i].score2, results[i].score3,results[i].score4, results[i].score5, results[i].score6, results[i].score7, results[i].score8, results[i].score9, results[i].score10]
			}
			friends.push(newObject);
		}

		 // We will use this object to hold the "best match". We will constantly update it as we
    // loop through all of the options
    var bestMatch = {
      name: "",
      photo: "",
      friendDifference: Infinity
    };

    // Here we take the result of the user"s survey POST and parse it.
    // var userData = req.body;
    // var userScores = userData.scores;
    var userScores = req.body.data;
    // This variable will calculate the difference between the user"s scores and the scores of
    // each user in the database
    var totalDifference;

    // Here we loop through all the friend possibilities in the database.
    for (var i = 0; i < friends.length; i++) {
      var currentFriend = friends[i];
      totalDifference = 0;

      console.log(currentFriend.name);

      // We then loop through all the scores of each friend
      for (var j = 0; j < currentFriend.scores.length; j++) {
        var currentFriendScore = currentFriend.scores[j];
        var currentUserScore = userScores[j];

        // We calculate the difference between the scores and sum them into the totalDifference
        totalDifference += Math.abs(parseInt(currentUserScore) - parseInt(currentFriendScore));
      }

      // If the sum of differences is less then the differences of the current "best match"
      if (totalDifference <= bestMatch.friendDifference) {
        // Reset the bestMatch to be the new friend.
        bestMatch.name = currentFriend.name;
        bestMatch.photo = currentFriend.photo;
        bestMatch.friendDifference = totalDifference;
      }
    }

    // Finally save the user's data to the database (this has to happen AFTER the check. otherwise,
    // the database will always return that the user is the user's best friend).
    //friends.push(userData);

    // Return a JSON with the user's bestMatch. This will be used by the HTML in the next page
    res.json(bestMatch);
	//res.send(newArray);
	});
})

//home route
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname,'./public/index.html'));
});

//survey route
app.get('/survey', function(req, res) {
	res.sendFile(path.join(__dirname,'./public/survey.html'));
});

app.listen(port);



