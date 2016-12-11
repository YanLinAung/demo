var knex = require('knex')

var config = {
		host: '127.0.0.1',
		user: 'postgres',
		password: 'admin',
		database: 'challenge'
};

var db = knex({
	client: 'pg',
	connection: config
})

exports.listRestaurant = function(callback){
	db('restaurant').asCallback(callback);
}

exports.saveRestaurant = function(restaurant, callback){
	db('restaurant').insert(restaurant).asCallback(callback);
}

exports.saveMenuOfDay = function(menuOfDay, callback){
	db('menu_of_day').insert(menuOfDay).asCallback(callback);
}

exports.getMenuOfDayWithResId = function(res_id, date, callback){
	db('menu_of_day').where({res_id: res_id, menu_date: date})
		.asCallback(callback)
}

exports.getMenuOfDay = function(date, callback){
	db('menu_of_day').where({menu_date: date})
		.asCallback(callback)
}

exports.saveUser = function(user, callback){
	db('users').insert(user).asCallback(callback);
}

exports.saveVote = function(vote, callback){
	db('votes').insert(vote).asCallback(callback);
}

exports.getVoteResult = function(date, callback){
	var query = "select name, count(*) from votes, restaurant where res_id = id and vote_date = ? group by user_id, name;"
	db.raw(query, [date]).asCallback(function(err, result){
		if(err) return callback(err)
		callback(null, result.rows)
	})
}

exports.findUser = function(username, callback){
	db('users').where({name: username})
	.limit(1)
	.asCallback(function(err, res){
		if(err) return callback(err);
		callback(null, res[0]);
	});
}

