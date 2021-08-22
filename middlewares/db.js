const db = require("../db/connect");

//check db connection state and store it in req.db
function DBconnected(req, res, next) {
	if (db.connection.readyState != 1) req.db = false;
	else req.db = true;
	return next();
}

module.exports = {
	DBconnected,
};
