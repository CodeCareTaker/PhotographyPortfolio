var mongoose = require("mongoose");

//SCHEMA SETUP
var photoSchema = new mongoose.Schema({
    title: String,
    image: String,
    camera: String,
    fStop: String,
    exposure: String,
    isoSpeed: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Photo", photoSchema);