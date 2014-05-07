/**
 * Created by khabbabsultra on 3/22/14.
 */

var mongoose = require('mongoose');


var levelSchema = new mongoose.Schema({

    title: { type: String, required: true},

    description: {
        type: String, required: true
    },

    difficulty: {
        type: String,
        required: true,
        unique: false
    },

    author_id : {
      type: String,
      required: true
    },

    level_str :{
      type: String,
      required: true
    },

    created: {
        type: Date,
        default: Date.now()
    },

    playCount: {
      type: String
    }


});

// this will be used in scoreboard to reference its level
levelSchema.virtual('levelId').get(function(){
   return this._id;
});

module.exports = mongoose.model('Level', levelSchema);