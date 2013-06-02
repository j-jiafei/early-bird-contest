/**
 * Module dependencies.
 */

///
/// FIXME: The value of COOKIE_SECRET should not be set in the source code.
var cookieSecret = 'zaq12wsxcde34rfvbgt5';

var routeConstants = require('./helpers/constants');

var express = require('express')
  , db = require('./models/db')
  , routes = require('./routes')
  , contest = require('./routes/contest')
  , user = require('./routes/user')
  , about = require('./routes/about')
  , http = require('http')
  , path = require('path');
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserialize(function (email, done) {
  findByEmail(email, function (err, user) {
    done(err, user);
  });
});

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser(cookieSecret));
  app.use(express.cookieSession());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/home', routes.home);
app.get('/public-activity', routes.publicActivity);
app.get('/management', routes.management);
app.get('/explore', routes.explore);
app.get('/features', routes.features);
app.get('/blog', routes.blog);
app.get('/help', routes.help);
app.get('/contests', contest.list);
app.get('/contest/new', contest.new);
app.post('/contest/new-submit', contest.newSubmit);
app.get('/contest/view', contest.view);
app.get('/contest/edit', contest.edit);
app.get('/contest/delete', contest.delete);
app.get('/about', about.about);
app.get('/login', user.login);
app.post('/login-submit', user.loginSubmit);
app.get('/logout', user.logout);
app.get('/signup', user.signup);
app.post('/signup-submit', user.signupSubmit);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
