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

module.exports = {
	sourceToDestination: mongoose.model(
		"sourceToDestination",
		sourceToDestination
	),
};
