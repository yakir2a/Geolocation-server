const schema = require("./schema");

/**
 * if find doc inc hit count retrun doc
 * else return null
 *
 * @param {String} source
 * @param {String} destination
 * @returns {number | null} if found return the doc
 */
async function existInDB(source, destination) {
	let doc;
	doc = await schema.sourceToDestination.findOneAndUpdate(
		{ source, destination },
		{ $inc: { hits: 1 } }
	);
	if (doc) return doc.distance;
	return null;
}

/**
 * add new sourceToDestination doc to the DB
 * if fail log to console
 * @param {String} source
 * @param {String} destination
 * @param {number} distance
 */
async function AddToDB(source, destination, distance) {
	try {
		let doc = new schema.sourceToDestination({
			source,
			destination,
			distance,
		});
		await doc.save();
	} catch (e) {
		console.log(e);
	}
}

async function GetPopulerSearch() {
	let result = (
		await schema.sourceToDestination
			.find()
			.sort({ hits: -1 })
			.limit(1)
			.select("destination hits source -_id")
	)[0];
	return result;
}

async function setSourceToDestination({ source, destination, distance }) {
	try {
		// validate input with shema
		await schema.sourceToDestination.validate({
			source,
			destination,
			distance,
		});
		//search for doc if found update not not create new then return the doc
		let doc = await schema.sourceToDestination.findOneAndUpdate(
			{
				source,
				destination,
			},
			{ source, destination, distance },
			{
				new: true,
				upsert: true,
				setDefaultsOnInsert: true,
				projection: "destination hits source -_id",
			}
		);
		return doc;
	} catch (e) {
		throw e;
	}
}

module.exports = {
	existInDB,
	AddToDB,
	GetPopulerSearch,
	setSourceToDestination,
};
