var request = require('request')

function testLogin(){
	request.post("http://localhost:3000/login",
		{form: {username: "Lin", password: "secret"}},
		function(err, resp, body){
			console.log(body);
		})
}

var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkxpbiIsInBhc3N3b3JkIjoic2VjcmV0IiwidXNlcl9yb2xlIjoiYWRtaW4iLCJpYXQiOjE0ODE0ODM1OTUsImV4cCI6MTQ4MTQ4NzE5NX0.s8xPbVz-2Wycr-YQb6B-HaDUl8kwxUnmBXgP8olen14"

function testViewRestaurant(){
	request.get("http://localhost:3000/restaurant",
		{qs: {token: token}},
		function(err, resp, body){
			console.log(body);
		})
}

function testCreateRestaurant(){
	request.post("http://localhost:3000/restaurant",
		{form: {token: token, name: "Res B", address: "Address of Res"}},
		function(err, resp, body){
			console.log(body);
		})
}

function testSaveMenuOfDay(){
	request.post("http://localhost:3000/menu/1",
		{form: { token: token, menu: "Special Menu"}},
		function(err, resp, body){
			console.log(body);
		});
}

function testGetMenuOfDayWithResId(){
	request.get("http://localhost:3000/menu/1"
		, {qs: {token: token }},
		function(err, resp, body){
			console.log(body)
		})
}

function testGetMenuOfDay(){
	request.get("http://localhost:3000/menu",
		{qs: {token: token}},
		function(err, resp, body){
			console.log(body)
		})
}

function testSaveVote(){
	request.post("http://localhost:3000/vote",
		{form: {token: token, res_id: 1}},
		function(err, resp, body){
			console.log(body)
		})
}

function testGetVoteResult(){
	request.get("http://localhost:3000/vote",
		{qs: {token: token}},
		function(err, resp, body){
			console.log(body)
		})
}
