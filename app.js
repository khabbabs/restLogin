
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');



var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {

    console.log("loading header");
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true); 

    // Pass to next layer of middleware
    next();
 });



app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
// ============================ loading routes =======================

require('./routes/routes.js')(app,passport);
require('./config/passport.js')(passport);

http.createServer(app).listen(app.get('port'),"0.0.0.0", function(){
  console.log('Express server listening on port ' + app.get('port'));
});

