const express 	= require("express"),
	  router	= express.Router({mergeParams: true}), // mergeParams = true so we can access id route param on req.params
	  Campground = require("../../models/campground.js"),
	  Comment = require("../../models/comment.js"),
	  {checkCommentOwnership, isLoggedIn} = require("../../middleware"); //will pull in index.js automatically

//NEW - show form to create a new comment
router.get("/new", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if (err || !campground){
			req.flash("error", "Campground not found");
			res.redirect("/yelpcamp/campgrounds");
		} else {
			res.render("yelpcamp/comments/new", {campground});
		}
	});
});

//CREATE - create new comment and redirect
router.post("/", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {	
		if (err || !campground) {
			req.flash("error", "Campground not found");
			res.redirect("/yelpcamp/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err || !comment) {
					req.flash("error", "Comment not found");
					res.redirect("back");
				} else {
					//add username and id to comment
					// then save comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment Created");
					res.redirect(`/yelpcamp/campgrounds/${req.params.id}`);
				}
				
			});
			
		}
	});
});

//EDIT ROUTE
router.get("/:commentId/edit", (req, res) =>{
	Campground.findById(req.params.id, (err, campground) => {
		if (err || !campground){
			req.flash("error", "Campground not found");
			res.redirect("/yelpcamp/campgrounds");
		} else {
			Comment.findById(req.params.commentId, (err, comment) => {
				if(err || !comment){
					req.flash("error", "Comment not found");
					res.redirect("/yelpcamp/campgrounds");
				} else {
					res.render("yelpcamp/comments/edit", {campground, comment});
				}
				
			});
			
		}
	});
	
});

//UPDATE ROUTE

router.put("/:commentId", (req, res) => {
	Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, updatedComment) => {
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			req.flash("success", "Comment Updated");
			res.redirect(`/yelpcamp/campgrounds/${req.params.id}`);
		}
	});
});

//DESTROY ROUTE

router.delete("/:commentId", checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.commentId,  (err) => {
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			req.flash("success", "Comment Deleted");
			res.redirect(`/yelpcamp/campgrounds/${req.params.id}`);
		}
	});
});



module.exports = router;