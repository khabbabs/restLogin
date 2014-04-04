/**
 * Created by khabbabsultra on 3/23/14.
 */


var Level = require('../models/level');
var User = require('../models/user');




module.exports.listByUser = function(req, res){
    console.log('in listByUser');
    console.log(req.params.id);


    User.findOne({'local.username': req.params.id}, function(err, user){
        if(err){
            console.log("user findOne error");
            return res.send(err);
        }
        else if(!user){
            console.log("can't find user "+req.params.id);
            return res.json(JSON.stringify({'status': req.params.id+' does not exist'}));
        }else{
                Level.find({author_id: req.params.id},function (err, level){
                if (err){
                    console.log('in error level find')
                    return res.send(err);
                }else{
                   return res.json(level);
                }
            });
        }
    });
}

module.exports.listByDiffType = function(req, res){
    console.log('here in diff type')
    Level.find({difficulty: req.params.Difftype},function (err, level){
        if (err){
            console.log('error diff type')
            res.send(err);
        }else{
            res.json(level);
        }
    });
}

module.exports.postLevel = function(req, res){


    User.findOne({ 'local.username' :  req.body.username }, function(err, user) {
        // if there are any errors, return the error before anything else
        console.log(req)
        // console.log(req.body);
        if (err){
            return res.send("error in api.postLevel");
        }
        // if no user is found, return the message
        if (!user)
            return res.json(JSON.stringify({'status': req.body.username+' does not exist'}));; // req.flash is the way to set flashdata using connect-flash

        // if the user is found but the password is wrong
        if (!user.validPassword(req.body.password))
            //return res.send("wrong password"); // create the loginMessage and save it to session as flashdata
            return res.json(JSON.stringify({'status': 'Wrong Password'}));
        // all is well, return successful user
        if (user){
            console.log("post level")
            var newlevel = Level({
                title: req.body.title,
                description: req.body.description,
                difficulty: req.body.difficulty,
                author_id: req.body.username,
                level_str: req.body.level_str
            });

            newlevel.save(function(err){
                if (!err){
                    //return res.send("level saved");
                    return res.json(JSON.stringify({'status': 'level saved'}));
                }else{
                    return res.send(err);
                }
            });
        //return done(null, user,req.flash('loginMessage','logged in succesfully as: '+user.local.username+" status: "+retMsg));
        }
        //return done(null, user,req.flash('loginMessage','logged in succesfully as: '+user.local.username));
    });
}