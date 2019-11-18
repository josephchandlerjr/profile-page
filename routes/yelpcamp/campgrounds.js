const express 		= require("express"),
	  router		= express.Router(),
	  Campground	= require("../../models/campground.js"),
	  Comment		= require("../../models/comment.js"),
	  {checkCampgroundOwnership, isLoggedIn} = require("../../middleware"); //will pull in index.js automatically

// INDEX - show campgrounds
router.get("/", (req, res) => {
	// get all campgounds from DB and render
	Campground.find({}, (err, campgrounds) => {
		if(err) {
			console.log(`Error: ${err}`);
		} else {
			res.render("yelpcamp/campgrounds/index", {campgrounds});
		}
	});
	
	
});

// NEW - show form to create new campground
router.get("/new", isLoggedIn, (req, res) => {
	res.render("yelpcamp/campgrounds/new");
});


// CREATE - add new campground to DB
router.post("/", isLoggedIn, (req, res) => {
	//get data from form and add to campgrounds db
	//redirect back to campgrounds page
	let name = req.body.name;
	let image = req.body.image;
	let description = req.body.description;
	let author = {id: req.user, username: req.user.username };
	let price = req.body.price;
	Campground.create({name, image, price, description, author}, (err, campgrounds) => {
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			req.flash("success", "Campground Created");
			res.redirect("/yelpcamp/campgrounds");
		}
	});
	
});

// SHOW ROUTE
router.get("/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec( (err, campground) => {
		if(err || !campground){
			req.flash("error", "Campground does not exist");
			res.redirect("/yelpcamp/campgrounds");
		} else {
			res.render("yelpcamp/campgrounds/show", {campground});
		}
		
	}); 
});



//EDIT ROUTE
router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err || !campground){
			req.flash("error", "Campground not found");
			res.redirect("/yelpcamp/campgrounds");
		} else {
			res.render("yelpcamp/campgrounds/edit", {campground});
		}
	});
});

//UPDATE ROUTE
router.put("/:id", checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground , (err, updatedCampground) =>{
		if(err || !updatedCampground){
			req.flash("error", "Campground not found");
			res.redirect("/yelpcamp/campgrounds");
		} else {
			req.flash("success", "Campground Successfully Updated");
			res.redirect(`/yelpcamp/campgrounds/${req.params.id}`);
		}
	});
});

//DESTROY ROUTE
router.delete("/:id", checkCampgroundOwnership, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) =>{
		if(err) {
			req.flash("error", "Campground not found");
			res.redirect("/yelpcamp/campgrounds");
		} else {
			Comment.deleteMany({_id: {$in: campgroundRemoved.comments}}, (err) => {
				if(err){
					req.flash("error", "Error. Something went terribly wrong");
					console.log(err);
					res.redirect("/yelpcamp/campgrounds");
				} else {
					req.flash("success", "Campground Successfully Deleted");
					res.redirect("/yelpcamp/campgrounds");
				}
			});
		}
	});
});


module.exports = router;