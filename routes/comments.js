// ========================
// Comments Routes
// ========================

var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middleware");

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err || !campground) {
            req.flash("error", "Campground Not Found");
            res.redirect("back");
        } else {
            res.render("comments/new.ejs", {campground: campground});
        }
    })
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res) {
    console.log(req.user);
    Campground.findById(req.params.id, function(err, campground) {
        if(err || !campground) {
            req.flash("error", "Campground Not Found");
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err || !comment) {
                    req.flash("error", "Something Went Wrong");
                    res.redirect("back");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added successfully");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            })
        }
    })
});


router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err || !foundCampground) {
            req.flash("error", "Campground Not Found");
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err || !foundComment) {
                    req.flash("err", "Comment Not Found");
                    res.redirect("back");
                } else {
                    res.render("../views/comments/edit.ejs", {campground_id: req.params.id, comment: foundComment});
                }
            })
        }
    })
    
    
    
})

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err || !updatedComment) {
            req.flash("error", "Something Went Wrong!")
            res.redirect("back");
        } else {
            req.flash("success", "Successfully updated the comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})



module.exports = router;