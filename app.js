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

const commentRoutes 	= require("./routes/comments.js"),
	  campgroundRoutes	= require("./routes/campgrounds.js"),
	  authRoutes		= require("./routes/index.js");
//seedDB();
console.log(process.env.DATABASEURL);
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
	mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true ,useUnifiedTopology: true});
}

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());




// PASSPORT CONFIGURATION
app.use(expressSession({
	secret: "Ich will noch nicht gehen, ich will noch ein bisschen tanzen",
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
app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT || 3000, () => console.log("YelpCamp Server has started"));
