/**
 * Created by khabbabsultra on 3/11/14.
 */

module.exports = function(app, passport){

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
        res.send(msg[0]);
    });

    app.post('/api/postLevel', passport.authenticate('api-postLevel', {
        successRedirect: '/api/redirPostLevel',
        failureRedirect: '/api/redirPostLevel'
    }));



}