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

/**
 * return the doc with the most hits on the database
 * @returns {{String,String,number}}
 */
async function GetPopulerSearch() {
	test = schema.sourceToDestination.find();
	console.log(test);
	let result = (
		await schema.sourceToDestination
			.find()
			.sort({ hits: -1 })
			.limit(1)
			.select("destination hits source -_id")
	)[0];
	return result;
}

/**
 * update existing doc or create new doc with user input source To Destination
 * 						{ source, destination, distance }
 *
 * @param {Object} sourceToDestination
 * @param {String} sourceToDestination.source
 * @param {String} sourceToDestination.destination
 * @param {number} sourceToDestination.distance
 * @returns {Object} or throw erroe if failed
 */
async function setSourceToDestination({ source, destination, distance }) {
	try {
		// validate input with shema
		await schema.sourceToDestination.validate({
			source,
			destination,
			distance,
		});
		//search for doc if found update not not create new then return the doc
		let doc = schema.sourceToDestination.findOneAndUpdate(
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
		console.log(doc);
		doc = await doc.exec();
		return doc;
	} catch (e) {
		throw e;
	}
}

function bulkSave(docs) {
	try {
		let result = schema.bulkSave(docs);
	} catch (error) {}
}

module.exports = {
	existInDB,
	AddToDB,
	GetPopulerSearch,
	setSourceToDestination,
};
