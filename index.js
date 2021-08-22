require("dotenv").config();

const express = require("express");
const map = require("./map");
const app = express();
const port = 8080;
const mongoose = require("./db/connect.js");

app.use(express.json());

app.get("/hello", (req, res, next) => {
	res.status(200).end();
});

app.get("/distance", async (req, res, next) => {
	let source, destination;
	// if missing query param return error
	if (!(req.query.source && req.query.destination))
		return next({ status: 400, message: "bad query string" });

	source = req.query.source;
	destination = req.query.destination;
	try {
		//get distance with google api
		let distance = await map.getDistance(source, destination);
		//if failed to find location return error
		if (!distance) throw new Error("failed to find locations");
		//response with the distance
		res.status(200).json({ distance });
	} catch (e) {
		return next({ status: 500, message: e.message });
	}
});

app.get("/health", (req, res, next) => {
	if (mongoose.connection.readyState != 1)
		res.status(500).json({ message: "connection to the db is not ok" });
	res.sendStatus(200);
});

app.get("/popularsearch", (req, res, next) => {});

app.post("/distance", (req, res, next) => {});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next({ status: 404, message: "page not found" });
});

// error handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json({ ...err });
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
