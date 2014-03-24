/**
 * Created by khabbabsultra on 3/23/14.
 */


var Level = require('../models/level');




module.exports.listByUser = function(req, res){
    console.log('here1')
    Level.find({author_id: req.params.id},function (err, level){
        if (err){
            console.log('in error')
            res.send(err);
        }else{
            res.json(level);
        }
    })

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
    })

}