const express 				= require("express"),
	  app 					= express(),
	  ejs 					= require("ejs"),
	  bodyParser 			= require("body-parser"),
	  mongoose 				= require("mongoose"),
	  Comment 				= require("./models/comment.js"),
      Campground 			= require("./models/campground.js"),
	  User 					= require("./models/user.js"),
	  expressSession 		= require("express-session"),
	  passport				= require("passport"),
	  LocalStrategy			= require("passport-local"),
	  seedDB 				= require("./seeds.js"),
	  methodOverride		= require("method-override"),
	  flash					= require("connect-flash");

const yelpcampCommentRoutes 	= require("./routes/yelpcamp/comments.js"),
	  yelpcampCampgroundRoutes	= require("./routes/yelpcamp/campgrounds.js"),
	  yelpcampAuthRoutes		= require("./routes/yelpcamp/index.js");
//seedDB();
mongoose.set('useFindAndModify', false); //removes deprecation warning


if(process.env.HEROKU == "true"){// cloud db
	mongoose.connect(process.env.DATABASEURL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	}).then(() => {
		console.log("Connected to DB");
	}).catch(err => {
		console.log("Error", err.message);
	});
} else { // local db
	mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true ,useUnifiedTopology: true});
}

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());




// PASSPORT CONFIGURATION
app.use(expressSession({
	secret: process.env.SECRET || "test environment",
	resave: false,
	saveUninitialized: false
}));

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.info = req.flash("info");
	res.locals.success = req.flash("success");
	next();
});

// ROUTES
app.use("/yelpcamp", yelpcampAuthRoutes);
app.use("/yelpcamp/campgrounds/:id/comments", yelpcampCommentRoutes);
app.use("/yelpcamp/campgrounds", yelpcampCampgroundRoutes);

app.listen(process.env.PORT || 3000, () => console.log("YelpCamp Server has started"));
