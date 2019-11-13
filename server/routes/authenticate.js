var mongoose = require('mongoose');                         //add for Mongo support
mongoose.connect('mongodb://localhost:27017/main'); 
// mongoose.connect('mongodb+srv://srinjayk:srinjayk@cluster0-kykds.mongodb.net/test?retryWrites=true&w=majority');
var express = require('express');
var router = express.Router();
var User = mongoose.model('User');
module.exports = function(passport){

	//sends successful login state back to angular
	router.get('/success', function(req, res){
		res.send({state: 'success', user: req.user? req.user : null});
	});
	router.get('/success/:username', function(req, res){
		User.findOne({username : req.params.username}, function(err,obj) { res.send({state: 'success', user: obj.username, id : obj._id}); })
		.catch(err => console.log(err));
	});
	router.get('/idtousername/:id', function(req, res){
		// if(req.params.id === 'undefined') res.send({state: 'failed', user: '', id : ''});
		User.findOne({_id : req.params.id}, function(err,obj) {
			try{
			 res.send({state: 'success', user: obj.username, id : obj._id});
			}
			catch(err){
				console.log(err.message);
			}
		})
		.catch(err => console.log(err.message));
	});
	//sends failure login state back to angular
	router.get('/failure', function(req, res){
		res.send({state: 'failure', user: null, message: "Invalid username or password"});
	});

	//log in
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//sign up
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//log out
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;

}
