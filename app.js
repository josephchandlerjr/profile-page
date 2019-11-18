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

const projects = [
	{
		name: "YelpCamp", 
		description: "something something", 
		image:"https://images.unsplash.com/photo-1528150206408-07a3f3025282?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		route: "/yelpcamp",
		github: "https://github.com/josephchandlerjr/YelpCamp.git"
	},
	{
		name: "Chess for Emerson", 
		description: "something something chess related", 
		image:"https://images.unsplash.com/photo-1538221566857-f20f826391c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		route: "/chess",
		github: "https://github.com/josephchandlerjr/Chess_For_Emerson"
	},
];

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
app.get("/", (req,res) => res.render("landing", {projects}));
app.get("/chess", (req,res) => res.render("chess/index"));
app.use("/yelpcamp", yelpcampAuthRoutes);
app.use("/yelpcamp/campgrounds/:id/comments", yelpcampCommentRoutes);
app.use("/yelpcamp/campgrounds", yelpcampCampgroundRoutes);

app.listen(process.env.PORT || 3000, () => console.log("YelpCamp Server has started"));
