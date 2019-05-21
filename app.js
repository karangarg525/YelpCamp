var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");
var methodOverride = require("method-override");
var Campground = require("./models/campground.js")
var seedDB = require("./seeds.js");
var User = require("./models/user.js");
var Comment = require("./models/comment.js");

var campgroundRoutes = require("./routes/campgrounds.js");
var commentRoutes    = require("./routes/comments.js");
var authRoutes       = require("./routes/auth.js");

// seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });


// ======== App uses ==========

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "This is secret line",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.use(methodOverride("_method"));

app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(authRoutes);

// ============================

// ========== Passport Uses ==========

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ====================================




app.listen(process.env.PORT, process.env.IP, function() {
    console.log("App has Started");;
})

