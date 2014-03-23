/**
 * Created by khabbabsultra on 3/22/14.
 */

var mongoose = require('mongoose');
var User = require('user.js');

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
    }

});


module.exports = mongoose.model('Level', levelSchema)