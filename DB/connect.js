require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");

let db_url = process.env["DB_URL"];

db_url = db_url
	.replace("<DB_USER>", process.env["DB_USER"])
	.replace("<DB_USER_PASSWORD>", process.env["DB_USER_PASSWORD"])
	.replace("<DB_NAME>", process.env["DB_NAME"]);
mongoose
	.connect(db_url, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then((connect) => console.log("connected to mongodb.."))
	.catch((e) => console.log("could not connect to mongodb", e));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

module.exports = mongoose;
