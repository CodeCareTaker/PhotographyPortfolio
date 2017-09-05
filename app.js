var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    Photo                 = require("./models/photo"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user"),
    methodOverride        = require("method-override"),
    flash                 = require("connect-flash"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")
    //seedDB                = require("./seeds")

var url = process.env.DATABASEURL || "mongodb://localhost/hr_photo_v2";
mongoose.connect(url);

var app = express();
mongoose.Promise = global.Promise;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Take me away",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//seedDB();

app.get("/", function(req, res){
    res.render("landing");
});

// ===================
// PHOTO ROUTES
// ===================

//INDEX - show all photos in ascending(oldest) order. Default option
app.get("/photos", function(req, res){
    //Get all photos from DB
    Photo.find().sort({created: 1}).exec(function(err, allPhotos){
        if(err){
            console.log(err);
        } else {
            res.render("photos/index",{photos: allPhotos}); 
        }
    });
});

//INDEX - show all photos in descending(latest) order
app.get("/photosDesc", function(req, res){
    //Get all photos from DB in descending(latest) order
    Photo.find().sort({created: -1}).exec(function(err, allPhotos){
        if(err){
            console.log(err);
        } else {
            res.render("photos/index",{photos: allPhotos}); 
        }
    });
});

//INDEX - show all photos in alphabetical order
app.get("/photosAlpha", function(req, res){
    //Get all photos from DB and sort by A-Z
    Photo.find().sort({title: 1}).exec(function(err, allPhotos){
        if(err){
            console.log(err);
        } else {
            res.render("photos/index",{photos: allPhotos}); 
        }
    });
});

//INDEX - show all photos in reverse-alphabetical order
app.get("/photosAlphaDesc", function(req, res){
    //Get all photos from DB and sort by Z-A
    Photo.find().sort({title: -1}).exec(function(err, allPhotos){
        if(err){
            console.log(err);
        } else {
            res.render("photos/index",{photos: allPhotos}); 
        }
    });
});

//CREATE - Add new photo to database
app.post("/photos", function(req, res){
    // get data from form and add to photos array
    var title = req.body.title;
    var image = req.body.image;
    var camera = req.body.camera;
    var fStop = req.body.fstop;
    var exposure = req.body.exposure;
    var isoSpeed = req.body.isospeed;
    var newPhoto = {title: title, image: image, camera: camera, fStop: fStop, exposure: exposure, isoSpeed: isoSpeed};
    // Create a new photo and save to DB
    Photo.create(newPhoto, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to photos page
            req.flash("success", newPhoto.title + " has been posted");
            res.redirect("/photos");
        }
    });
});

//NEW - show form to create new photo
app.get("/photos/new", isAdmin, function(req, res){
   res.render("photos/new"); 
});

//SHOW - Show info about one photo
app.get("/photos/:id", function(req, res) {
    //find the photo with provided ID
    Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhoto){
        if(err){
            console.log(err);
        } else {
            console.log(foundPhoto);
            //render show template with that photo
            res.render("photos/show", {photo: foundPhoto});
        }
    });
});

//EDIT ROUTE
app.get("/photos/:id/edit", isAdmin, function(req, res){
    Photo.findById(req.params.id, function(err, editPhoto) {
        if(err){
            res.render("/photos");
        } else {
            res.render("photos/edit", {photo: editPhoto});
        }
    });
});

//UPDATE ROUTE
app.put("/photos/:id", isAdmin, function(req, res){
    //update photo information
    Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatePhoto){
        if(err) {
            res.redirect("/photos");
        } else {
            req.flash("success", "Photo has been updated");
            res.redirect("/photos/" + req.params.id);
        }
    });
});

//Delete Route
app.delete("/photos/:id", isAdmin, function(req, res) {
    //remove photo from the website
    Photo.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/photos");
        } else {
            req.flash("error", "Photo has been deleted");
            res.redirect("/photos");
        }
    });
});

// ===================
// AUTH ROUTES
// ===================

//show sign-up form
app.get("/register", function(req, res){
    res.render("register");
});

//handling user sign up
app.post("/register", function(req, res){
    req.body.username;
    req.body.password;
    //object captures info user entered to create account
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to the site, " + user.username);
            res.redirect("photos");
        });
    });
});

// ===================
// COMMENT ROUTES
// ===================

//Lets user type a new comment
app.get("/photos/:id/comments/new", isLoggedIn, function(req, res){
    Photo.findById(req.params.id, function(err, photo){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {photo: photo});
        }
    });
});

//Posts created comment
app.post("/photos/:id/comments", isLoggedIn, function(req, res){
    //lookup photo using ID
    Photo.findById(req.params.id, function(err, photo){
        if(err){
            console.log(err);
            //req.flash("error", err.message);
            res.redirect("/photos");
        } else {
         Comment.create(req.body.comment, function(err, comment){
             if(err){
                 req.flash("error", err.message);
             } else {
                 //add username and id to comment
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 //save comment
                 comment.save();
                 photo.comments.push(comment);
                 photo.save();
                 console.log(comment);
                 req.flash("success", "Your comment has been posted");
                 res.redirect("/photos/" + photo._id);
             }
         })
            console.log(req.body.comment);
        }
    })
});

//Comment Edit
app.get("/photos/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {photo_id: req.params.id, comment: foundComment});
        }
    });
});

//Comment Update
app.put("/photos/:id/comments/:comment_id", checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.render("back");
        } else {
            req.flash("success", "Comment successfully updated");
            res.redirect("/photos/" + req.params.id);
        }
    })
})

//Comment Destroy Route
app.delete("/photos/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("error", "Comment successfully deleted");
            res.redirect("/photos/" + req.params.id);
        }
    });
});


//Login Routes
//render login form
app.get("/login", function(req, res){
    res.render("login");
});


app.post("/login",passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
}), function(req, res) {
     
});

//Logout Route
app.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logout successful");
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

function isAdmin(req, res, next){
    if(req.user && req.user.isAdmin == true){
        return next();
    } 
    res.redirect("/login");
}

//Checks to see if user has permission to edit selected comment
function checkCommentOwnership (req, res, next){
    if(req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err){
                    req.flash("error", "Comment not found");
                    res.render("/blog");
                } else {
                    // did the user post the comment?
                  if(foundComment.author.id.equals(req.user._id)) {
                    next();
                  //if that fails, checks if the user is an admin
                  } else if(req.user && req.user.isAdmin == true){
                    return next();
                  //if both checks fail then user is denied access
                  } else {
                    req.flash("error", "You are not authorized to edit this comment");
                    res.redirect("back");
                  }
                }
            });
    } else {
        req.flash("error", "You must login to edit a comment");
        res.redirect("back");
    }
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Server Has Started!");
});




