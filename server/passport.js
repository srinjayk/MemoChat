var mongoose = require('mongoose');   
var User = mongoose.model('User');
var LocalStrategy   = require('passport-local').Strategy;
var encrypt = require('bcrypt-nodejs');

module.exports = function(passport){


	passport.use('signup', new LocalStrategy({
			passReqToCallback : true 
		},
		function(req, username, password, done) {

			User.findOne({ 'username' :  username }, function(err, user) {
				if (err){
					console.log('Error in SignUp: '+err);
					// alert('Error in SignUp: '+err);
					return done(err);
				}
				if (user) {
					console.log('User already exists with username: '+username);
					// alert('User already exists with username: '+username);
					return done(null, false);
				} else {
					var newuser = new User();

					newuser.username = username;
					newuser.password = encryptPassword(password);
					newuser.email = username + "@iitk.ac.in";

					newuser.save(function(err) {
						if (err){
							console.log('Error in Saving user: '+err);  
							throw err;  
						}
						console.log('Registration succesful for ' + newuser.username);
						// alert('Registration succesful for ' + newuser.username);    
						return done(null, newuser);
					});
				}
			});
		})
	);

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			User.findOne({ 'username' :  username }, 
				function(err, user) {
					if (err)
						return done(err);
					if (!user){
						console.log('User Not Found with username '+username);
						// alert('User Not Found with username '+username);
						return done(null, false);                 
					}
					if (!checkValidity(user, password)){
						console.log('Invalid Password');
						// alert('Invalid Password');
						return done(null, false); 
					}
					return done(null, user);
				}
			);
		}
	));

	
	
	var checkValidity = function(user, password){
		return encrypt.compareSync(password, user.password);
	};

	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user.username);
		done(null, user._id);
	});

	var encryptPassword = function(password){
		return encrypt.hashSync(password, encrypt.genSaltSync(10), null);
	};


	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			console.log('deserializing user:',user.username);
			done(err, user);
		});
	});

	
};