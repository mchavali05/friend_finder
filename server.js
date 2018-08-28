var express = require('express');
var app = express();
//var friends = require('./friends');
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
	extended: true
}));

var connection = mysql.createConnection({
	  host: "localhost",

	  // Your port; if not 3306
	  port: 3306,

	  // Your username
	  user: "root",

	  // Your password
	  password: "",
	  database: "friends_db"
});

//friend route
app.get('/friends', function(req, res) {
	connection.query('SELECT * FROM users;', function(error, results){
		res.send(results);
	});
})

//post route
app.post('/friends', function(req, res) {
	var myValues = req.body.data;
	console.log(myValues);
	res.send(myValues);
	//get values from db, then convert scores into array.
	//use myValues to compare against users in the db
	//determine which friend is scores similar to mine
	//then send back one friend through res.send(myChosenFriend)
	
	// connection.query('SELECT * FROM users;', function(error, results){
	// 	res.send(results);
	// });
})

//home route
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname,'./public/index.html'));
});

//survey route
app.get('/survey', function(req, res) {
	res.sendFile(path.join(__dirname,'./public/survey.html'));
});

app.listen(3000)

