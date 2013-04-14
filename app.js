/**
 * Module dependencies.
 */

///
/// FIXME: The value of COOKIE_SECRET should not be set in the source code.
var cookieSecret = 'zaq12wsxcde34rfvbgt5';

var routeConstants = require('./routes/constants');

var express = require('express')
  , db = require('./models/db')
  , routes = require('./routes')
  , race = require('./routes/race')
  , user = require('./routes/user')
  , about = require('./routes/about')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser(cookieSecret));
//   app.use(express.cookieSession());
  app.use(express.cookieSession());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  // change secret later, and secret should not be in the source code
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/races', race.list);
app.get('/racecreate', race.create);
app.post('/racesubmit', race.submit);
app.get('/raceview', race.view);
app.get('/raceedit', race.edit);
app.get('/racedelete', race.delete);
app.get('/about', about.about);
app.get('/login', user.login);
app.post('/login-submit', user.login_submit);
app.get('/logout', user.logout);
app.get('/signup', user.signup);
app.post('/signup-submit', user.signup_submit);
app.get('/race-subscribe', race.subscribe);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
