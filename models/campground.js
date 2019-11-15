const mongoose = require("mongoose");

//SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	],  //embedded references to comments
	author: 
	{	id: 
	 	{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
	 	username: String
	}
});

module.exports = mongoose.model("Campground", campgroundSchema);