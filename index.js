var express = require('express')
var bodyParser = require('body-parser')

var jwt = require('jsonwebtoken')

var db = require('./db')

var secretKey = 'generatedSecretKey'

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(function(req, res, next) {

  	var token = req.body.token || req.query.token || req.headers['x-access-token'];

  	if (token) {
    	jwt.verify(token, secretKey, function(err, decoded) {
	      	if (err) {
	        	return res.json({ success: false, message: 'Failed to authenticate token.' });
	      	} else {
	      		req.user_id = decoded.id;
	        	req.role = decoded.user_role;
	        	next();
	      	}
		});
	} else {
		// no token
		next();
	}
})

app.get('/', function(req, res){
	res.send('Server is up and running')
})


app.post('/login', function(req, res){
	var username = req.body.username;
	var password = req.body.password;

	db.findUser(username, function(err, user){
		if(err) return res.status(500).send('database error');

		if(user){
			if(user.password === password){
				var token = jwt.sign(user, secretKey, { expiresIn: 60 * 60 }) // 1 hr
				res.json({token: token})
			} else {
				res.send('wrong username or password')
			}
		} else {
			res.send('User not found');
		}
	})
})

app.get('/restaurant', function(req, res){
	if(req.role){
		db.listRestaurant(function(err, restaurants){
			if(err) return res.status(500).send('db error')
			res.json(restaurants);
		})
		//res.send('list of restaurant')
	} else {
		res.send("Unauthorized")
	}
})

app.post('/restaurant', function(req, res){
	if(req.role && req.role === 'admin'){
		var restaurant = {
			name: req.body.name,
			address: req.body.address
		}

		db.saveRestaurant(restaurant, function(err, result){
			if(err) return res.status(500).send('db error')
			res.send("restaurant created successfully");
		});
	} else {
		res.send('Unauthorized')
	}

})

app.get('/menu/', function(req, res){
	if(req.role){
		db.getMenuOfDay(new Date().toISOString(), function(err, result){
			if(err) return res.status(500).send('db error')
			res.send(result)
		})
	} else {
		res.send('Unauthorized')
	}
})

app.get('/menu/:res_id', function(req, res){
	if(req.role){
		var res_id = req.params.res_id

		db.getMenuOfDayWithResId(res_id, new Date().toISOString(), function(err, result){
			if(err) return res.status(500).send('db error')
			res.send(result)
		})
	} else {
		res.send("Unauthorized")
	}
})

app.post('/menu/:res_id', function(req, res){
	if(req.role && req.role === 'admin'){
		var menu = {
			res_id: req.params.res_id,
			menu_date: new Date().toISOString(),
			menu: req.body.menu
		};
		db.saveMenuOfDay(menu, function(err, result){
			if(err) return res.status(500).send('db error');
			res.send("Menu of Day saved successfully");
		})
	} else {
		res.send('Unauthorized');
	}

})

app.post('/vote', function(req, res){
	if(req.role){
		var vote = {
			res_id: req.body.res_id,
			user_id: req.user_id,
			vote_date: new Date().toISOString()
		};
		db.saveVote(vote, function(err, result){
			if(err) return res.status(500).send('db error')
			res.send('Vote saved')
		})
	} else {
		res.send('Unauthorized')
	}
})

app.get('/vote', function(req, res){
	if(req.role){
		db.getVoteResult(new Date().toISOString(), function(err, result){
			if(err) return res.status(500).send('db error')
			res.send(result);
		})
	} else {
		res.send('Unauthorized')
	}
})


app.listen(3000, function(){
	console.log('app started and listening on port 3000');
});