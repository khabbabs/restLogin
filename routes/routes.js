/**
 * Created by khabbabsultra on 3/11/14.
 */


var api = require('../config/api');

module.exports = function(app, passport){





    // app.use(function (req, res, next) {

    // console.log("loading header");
    // // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true); 

    // // Pass to next layer of middleware
    // next();
    // });


    app.get('/', function(req, res){
        res.render('index.ejs', {title: 'test-Automaton'});
    });

    app.get('/redirLogin', function(req, res){
        console.log('/ in login');
        msg = req.flash('loginMessage');
        res.send(msg[0]);
    });

    app.post('/login', passport.authenticate('local-login', {
       successRedirect: '/redirLogin',
       failureRedirect: '/redirLogin'
    }));

    app.post('/signup', passport.authenticate('local-signup', {

    }));


//========================routes for the api========================================


    app.get('/api/redirPostLevel', function(req, res){
        console.log('/ post level');
        msg = req.flash('loginMessage');
        console.log(msg)
        res.json({'status' :msg[0]});
    });

//    app.post('/api/postLevel', passport.authenticate('api-postLevel', {
//        successRedirect: '/api/redirPostLevel',
//        failureRedirect: '/api/redirPostLevel'
//    }));


    app.post('/api/postLevel', function(req, res){
        return api.postLevel(req,res);
    });

    app.post('/api/postsignup', function(req,res){
        console.log('postSignup');
        return api.postSignUp(req,res);
    });
    
    app.put('/api/score/:id', function(req,res){        
        return api.putScore(req,res);
    });


    // app.options('/api/levels/user/:id', function(req, res){

    //     console.log("setting the header");

    //     res.header("Access-Control-Allow-Origin","*")
    //     res.end('');
    // });

    app.get('/api/levels/user/:id', function(req, res){
        console.log("getting by id");
        return api.listByUser(req,res);
    });

    app.get('/api/levels/diff/:Difftype', function(req, res){
        return api.listByDiffType(req,res);
    });



}