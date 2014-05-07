/**
 * Created by khabbabsultra on 3/26/14.
 */

var mongoose = require('mongoose');


var scoreSchema = new mongoose.Schema({

    levelName: { type: String, required: true},

    author_id : {
        type: String,
        required: true
    },

    created: {
        type: Date,
        default: Date.now()
    },

    levelId:{ 
        type: String,
        required: true
    },

    autoCount:[{ _id:false, name: String , score: String}],
    instruCount:[{ _id:false, name: String , score: String}],
    cellCount:[{ _id:false, name: String , score: String}],
    tickCount:[{ _id:false, name: String , score: String}]



});

// this will be used in scoreboard to reference its level
module.exports = mongoose.model('Score', scoreSchema);