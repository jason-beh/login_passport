// App initialization
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

// Requirements
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var mongodb =  require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);

// Set mongo route and connect it mongoose
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

// Middleware Setup
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(session({
  secret: 'anystringoftext',
  saveUninitialized: true,
  resave: true,
  store: new MongoStore(
    { mongooseConnection : mongoose.connection,
      ttl : 2 * 24 * 60* 60 })}));

// Require configuration declared in passport.js
require('./config/passport')(passport);
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());

// Use connect-flash for flash messages stored in session
app.use(flash());

// Set View Engine
app.set('view engine', 'jade');
// Set static path
app.use(express.static(path.join(__dirname, 'public')));



// Authorize paths
var auth = express.Router();
require('./routes/auth.js')(auth, passport);
app.use('/auth', auth);

// logged in path
var secure = express.Router();
require('./routes/secure.js')(secure, passport);
app.use('/', secure);

app.listen(port);
console.log('Server running on port: ' + port);