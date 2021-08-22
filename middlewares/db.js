const db = require("../db/connect");

function DBconnected(req, res, next) {
	if (db.connection.readyState != 1) req.db = false;
	else req.db = true;
	return next();
}

module.exports = {
	DBconnected,
};
