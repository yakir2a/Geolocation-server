//load .env
require("dotenv").config();

//extrnal imports
const express = require("express");
const app = express();

//import my files
const map = require("./map");
const { GetPopulerSearch, setSourceToDestination } = require("./db/querys");
const { DBconnected } = require("./middlewares/db");
const { findDistance } = require("./middlewares/map");

//server port
const port = process.env.SERVER_PORT | 8080;

//json parse
app.use(express.json());

//hello end point return status 200
app.get("/hello", (req, res, next) => {
	return res.status(200).end();
});

//distance end point return distance between 2 location on the map
app.get(
	"/distance",
	DBconnected,
	async (req, res, next) => {
		let source, destination;
		// if missing query param return error
		if (!(req.query.source && req.query.destination))
			return next({ status: 400, message: "bad query string" });
		return next();
	},
	findDistance
);

//health end point return DB connection status 200 if all good 500 if somthing worng
app.get("/health", DBconnected, (req, res, next) => {
	if (!req.db)
		return res
			.status(500)
			.json({ message: "connection to the db is not ok" });
	return res.sendStatus(200);
});

//popularsearch end point return most populer serach for location on DB
app.get("/popularsearch", DBconnected, async (req, res, next) => {
	if (req.db) {
		let popularsearch = await GetPopulerSearch();
		return res.status(200).json(popularsearch);
	}
	return next({
		status: 500,
		message: "DataBase is not connected cant get data",
	});
});

//POST distance end point allow to insert Source To Destination and its distance to the DB
app.post("/distance", DBconnected, async (req, res, next) => {
	if (req.db) {
		try {
			let result = await setSourceToDestination(req.body);
			return res.status(201).json(result);
		} catch (e) {
			return next({ status: 500, message: e.message });
		}
	}
	return next({
		status: 500,
		message: "DataBase is not connected cant get data",
	});
});

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
