const express 	= require("express"),
	  router 	= express.Router(),
	  passport	= require("passport"),
	  User 		= require("../models/user.js");

//root route
router.get("/", (req, res) => {
	res.render("landing");
});




// AUTH ROUTES


// register routes
router.get("/register", (req, res) => {
	res.render("register");
});

// sign-up logic
router.post("/register", (req, res) => {
	let newUser = new User({username: req.body.username});
	let password = req.body.password;
	User.register(newUser, password, (err, user) => {
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			passport.authenticate("local")(req, res, () => {
				req.flash("success", `Welcome, ${req.user.username}! You're all signed up!`)
				res.redirect("/campgrounds");
			});
		}
	});
});

// login routes

router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", 
		 passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect: "/login"}), 
		 (req, res) => {});


//logout

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("info", "Goodbye!");
	res.redirect("/campgrounds");
});



module.exports = router;