const mongoose = require("./connect");

const { Schema } = mongoose;

const sourceToDestination = new Schema(
	{
		source: {
			type: String,
			required: true,
		},
		destination: {
			type: String,
			required: true,
		},
		hits: {
			type: Number,
			default: 1,
		},
		distance: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);
sourceToDestination.index(
	{ source: 1, destination: 1 },
	{ name: "sourceToDestination", unique: true }
);

module.exports = {
	sourceToDestination: mongoose.model(
		"sourceToDestination",
		sourceToDestination
	),
};
