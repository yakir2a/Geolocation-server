require("dotenv").config();

const express = require("express");
const app = express();

const map = require("./map");
const { GetPopulerSearch, setSourceToDestination } = require("./db/querys");
const { DBconnected } = require("./middlewares/db");
const { findDistance } = require("./middlewares/map");

const port = 8080;

app.use(express.json());

app.get("/hello", (req, res, next) => {
	res.status(200).end();
});

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

app.get("/health", DBconnected, (req, res, next) => {
	if (!req.db)
		return res
			.status(500)
			.json({ message: "connection to the db is not ok" });
	return res.sendStatus(200);
});

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
