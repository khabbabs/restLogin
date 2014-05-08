/**
 * Created by khabbabsultra on 3/23/14.
 */


var Level = require('../models/level');
var User = require('../models/user');
var Score = require('../models/score');



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
            return res.json({'status': req.params.id+' does not exist'});
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

module.exports.postSignUp = function(req,res){

    
    User.findOne({ 'local.username' : req.body.username },function(err,user){
                
        if(err){
            console.log('error in post sign up:');
            console.log(err);
            return res.json({'status': 'error in api.postSignUp'});
        }
        if(user){

            return res.json({'status': req.body.username+' already exist'});

        }
        else{

            console.log('created new user: '+req.body.username);
                        var newUser            = new User();

                        // set the user's local credentials
                        newUser.local.username = req.body.username;
                        newUser.local.password = newUser.generateHash(req.body.password);
                        // console.log('new user '+req.body.username+'created');
                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                return res.json({'status': 'error in saving username'});      
                            }
                            else{
                                return res.json({'status': req.body.username+' created'});
                            }
                        });
        }

    });

}

module.exports.upDatePlayCount = function(req,res){
    
    Level.findById(req.params.id, function(err, level){
        if(err){
            return res.json({'status': 'error updating play count: '+err});
        }
        else{

            level.playCount = (parseInt(level.playCount)+1).toString()
            // return res.json(level)ArrayBuffer();

            level.save(function(err){
                if(err){
                    return res.json({'status': 'error saving level, updating play count: '+err});
                }else{
                  return res.json({'status': 'updated play count: '});  
                }
            });
        }

    });
}




module.exports.getScore = function(req,res){    
    Score.findOne({'levelId': req.params.id}, function(err, score){
        if(err){
            return res.json({'status': 'error getting score: '+err});
        }
        else{
            console.log('in post score');
            if (score == null){
                return res.json({'status': 'no such level '});       
            }else{
                return res.json({"autoCount":score.autoCount,"instruCount":score.instruCount
                                ,"cellCount":score.cellCount,"tickCount":score.tickCount})
            }
            // return res.json({"autoCount":score.autoCount,"instruCount":score.instruCount
                                // ,"cellCount":score.cellCount,"tickCount":score.tickCount})
            // return res.json(score)
        }
    });
    
}

module.exports.putScore = function(req,res){
    // Level.findById(req.params.id, function(err, level){
    //     if(err){
    //         return res.json({'status' : 'error in put score'})
    //     }
    //     console.log('Update Score');
    //     return res.json({'status' : level })

    // });

    Score.findOne({'levelId': req.params.id}, function(err, score){

        if(err){
            return res.json({'status': 'error getting score: '+err});
        }
        else{

            if(score != null){
            console.log('in post score');
            console.log(req.body);
            score.autoCount.push({name:req.body.name, score: req.body.autoCount});
            score.instruCount.push({name:req.body.name,score: req.body.instruCount});
            score.cellCount.push({name:req.body.name, score:req.body.cellCount});
            score.tickCount.push({name:req.body.name, score:req.body.tickCount});

            score.save(function(err){
                if(err){
                    return res.json({'status':'score Update error: '+err})
                }else{  
                    return res.json({'status':'score update success'}) 
                }
                });
            }
            else{
                return res.json({'status': 'no such score '});
            }

            // return res.json(score)
        }
    });
    
}

module.exports.postLevel = function(req, res){

    User.findOne({ 'local.username' :  req.body.username }, function(err, user) {
        // if there are any errors, return the error before anything else
        // console.log(req)
        // console.log(req.body);
        if (err){
            return res.send("error in api.postLevel");
        }
        // if no user is found, return the message
        if (!user)
            return res.json({'status': req.body.username+' does not exist'}); // req.flash is the way to set flashdata using connect-flash

        // if the user is found but the password is wrong
        if (!user.validPassword(req.body.password))
            //return res.send("wrong password"); // create the loginMessage and save it to session as flashdata
            return res.json({'status': 'Wrong Password'});
        // all is well, return successful user
        if (user){
            console.log("saving level")
            var newlevel = Level({
                title: req.body.title,
                description: req.body.description,
                difficulty: req.body.difficulty,
                author_id: req.body.username,
                level_str: req.body.level_str,
                playCount: "0"
            });

            newlevel.save(function(err){
                if (!err){
                    //return res.send("level saved");
                    
                
                    var newScore = Score({
                        author_id: req.body.username,
                        levelId: newlevel.levelId,
                        levelName: req.body.title

                    });

                    newScore.save(function(err){
                        if(!err){
                            return res.json({'status': 'level saved'});
                        }
                        else{
                            return res.json({'status': 'error while saving level' + err});
                        }
                    });

                }else{
                    return res.send(err);
                }
            });


        //return done(null, user,req.flash('loginMessage','logged in succesfully as: '+user.local.username+" status: "+retMsg));
        }
        //return done(null, user,req.flash('loginMessage','logged in succesfully as: '+user.local.username));
    });
}