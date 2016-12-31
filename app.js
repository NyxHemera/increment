var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

// Routes
var homeRouter = require('./routes/index');

var app = express();

var uristring = 
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
process.env.MONGODB_URI ||
'mongodb://localhost/increment';

// Connect to DB
mongoose.connect(uristring, (err, res) => {
	if(err) {
		console.log('Error connecting to: ' + uristring + '. ' + err);
	}else {
		console.log('Succeeded in connecting to: ' + uristring);
	}
});

app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
// app.use(passport.initialize());
// app.use(passport.session());
// require('./config/passport/passport')(passport);

app.use((req, res, next) => {
	global.currentUser = req.user;
	next();
});

//app.use('/', homeRouter);

// Don't leak stacktrace to users
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
	app.use(function(err, req, res, next) {
	  res.status(err.status || 500);
	  res.render('error', {
	    message: err.message,
	    error: {}
	  });
	});
}

module.exports = app;