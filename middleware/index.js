const Campground = require("../models/campground.js"),
	  Comment = require("../models/comment.js");


const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login First!");
	res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, campground) => {
			if(err || !campground) {
				req.flash("error", "Campground not found");
				res.redirect("/campgrounds");
			} else if (campground.author.id.equals(req.user._id)){
				next();
			} else {
				req.flash("error", "You do not have the proper permissions to do that.");
				res.redirect("back");
			 }
		});
	} else {
		req.flash("error", "You must be logged in to do that.");
		res.redirect("back");
	}
}


middlewareObj.checkCommentOwnership = (req, res, next) => {
	if(req.isAuthenticated()){
		Comment.findById(req.params.commentId, (err, comment) => {
			if(err || !comment) {
				req.flash("error", "Comment not found");
				res.redirect("/campgrounds");
			} else if (comment.author.id.equals(req.user._id)){
				next();
			} else {
				req.flash("error", "You do not have the proper permissions to do that.");
				res.redirect("back");
			 }
		});
	} else {
		req.flash("error", "You must be logged in to do that.");
		res.redirect("back");
	}
}


module.exports = middlewareObj;