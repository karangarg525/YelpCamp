// ============ Routes ==============

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var middleware = require("../middleware");

router.get("/", function(req, res) {
    res.render("landing.ejs");
})

router.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log("There is an Error");
            console.log(err);
        } else {
            res.render("campgrounds/campgrounds.ejs", {campgrounds: allCampgrounds});
        }
    })
})


router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
    //This is the POST route
    var name = req.body.name;
    var url = req.body.url;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: url, description: description, author: author};
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log("There is an error")
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    })
    
    
})

router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new.ejs")
})


router.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "Campground Not Found");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show.ejs", {campground: foundCampground});
        }
    })
})


router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("Campground Not Found");
            res.redirect("/campgrounds");
        } else {
            res.render("../views/campgrounds/edit.ejs", {campground: foundCampground});   
        }
    })
});

router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            console.log(err || !updatedCampground);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    })
});


module.exports = router;