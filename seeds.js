var mongoose = require("mongoose")
var Photo = require("./models/photo")
var Comment    = require("./models/comment")

var data = [
            {
                title: "Rotting Wood", 
                image: "https://i.imgur.com/T4MpEFl.jpg",
                camera: "Canon EOS REBEL T3i",
                fStop: "f/9",
                exposure: "1/200sec",
                isoSpeed: "ISO-100"
            },
            {
                title: "Shipment", 
                image: "https://i.imgur.com/ii7MPAg.jpg",
                camera: "Canon EOS REBEL T3i",
                fStop: "f/9",
                exposure: "1/200sec",
                isoSpeed: "ISO-100"
            },
            {
                title: "Incoming!", 
                image: "https://i.imgur.com/7O6LFOP.jpg",
                camera: "Canon EOS REBEL T3i",
                fStop: "f/5.6",
                exposure: "1/160sec",
                isoSpeed: "ISO-100"
            },
            // {
            //     title: "Ice Storm After Effects 1", 
            //     image: "https://i.imgur.com/tCJKr9Z.jpg",
            //     camera: "Canon EOS REBEL T3i",
            //     fStop: "f/5.6",
            //     exposure: "1/60sec",
            //     isoSpeed: "ISO-100"
            // },
            // {
            //     title: "Ice Storm After Effects 2", 
            //     image: "https://i.imgur.com/N53R9Lv.jpg",
            //     camera: "Canon EOS REBEL T3i",
            //     fStop: "f/5.6",
            //     exposure: "1/60sec",
            //     isoSpeed: "ISO-100"
            // },
            // {
            //     title: "Ice Storm After Effects 3", 
            //     image: "https://i.imgur.com/PjJOb69.jpg",
            //     camera: Canon EOS REBEL T3i,
            //     fStop: f/5.6,
            //     exposure: "1/60sec",
            //     isoSpeed: "ISO-100"
            // },
            // {
            //     title: "Ice Storm After Effects 4", 
            //     image: "https://i.imgur.com/0eklKbu.jpg",
            //     camera: "Canon EOS REBEL T3i",
            //     fStop: "f/6.3",
            //     exposure: "1/125sec",
            //     isoSpeed: "ISO-400"
            // },
            // {
            //     title: "A Day at the Races", 
            //     image: "https://i.imgur.com/Pr8jRYO.jpg",
            //     description: "camera: "Canon EOS REBEL T3i", fStop: "f/16", exposure: "1/60sec", isoSpeed: "ISO-160"
            // },
            // {
            //     title: "Broken Dreams", 
            //     image: "https://i.imgur.com/lTWIdjS.jpg",
            //     camera: "Canon EOS REBEL T3i",
            //     fStop: "f/16",
            //     exposure: "1/60sec",
            //     isoSpeed: "ISO-800"
            // }
];
    
   
function seedDB(){
    //Remove all photos
    // Photo.remove({}, function(err){
    //     if(err){
    //         console.log(err)
    //     }
    //     console.log("removed photos!");
    //     //Add a few photos
        data.forEach(function(seed){
            Photo.create(seed, function(err, photo) {
                if(err){
                    console.log(err);
                } else {
                console.log("added a photo");
                //Create a comment
                // Comment.create(
                //     {
                //         text: "Why isn't it moving?",
                //         author: "Homer"
                //     }, function(err, comment){
                //         if(err){
                //             console.log(err);
                //         } else {
                //             photo.comments.push(comment);
                //             photo.save();
                //             console.log("Created new comment")
                //         }
                //     });
                    
                 }
            //});
        });
    });
}

module.exports = seedDB;


