const map = require("../map");

async function findDistance(req, res, next) {
	source = req.query.source;
	destination = req.query.destination;
	try {
		let distance;
		//if db is connected check with db first
		if (req.db) distance = await map.getDistance(source, destination);
		// else use extrnal api
		else distance = await map.getDistanceAPI(source, destination);
		//response with the distance
		return res.status(200).json({ distance });
	} catch (e) {
		return next({ status: 500, message: e.message });
	}
}

module.exports = {
	findDistance,
};
