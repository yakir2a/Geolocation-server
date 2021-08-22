const { Client } = require("@googlemaps/google-maps-services-js");
const { existInDB, AddToDB } = require("../db/querys");

const client = new Client({});

/**
 * get distance of 2 point
 * first check DB if not found look in extrnal API
 *
 * @param {String} source
 * @param {String} destination
 * @returns {number} or throw error if failed
 */
async function getDistance(source, destination) {
	try {
		let distance = await existInDB(source, destination);
		if (!distance) {
			distance = await getDistanceAPI(source, destination);
			AddToDB(source, destination, distance);
		}
		return distance;
	} catch (e) {
		throw e;
	}
}

/**
 * get distance of 2 point
 * look in extrnal API
 *
 * @param {String} source
 * @param {String} destination
 * @returns {number} or throw error if failed
 */
async function getDistanceAPI(source, destination) {
	let lat1, lat2, lon1, lon2, distance;
	try {
		({ lat: lat1, lng: lon1 } = (
			await getLocation(source)
		).geometry.location);
		({ lat: lat2, lng: lon2 } = (
			await getLocation(destination)
		).geometry.location);
		distance = Math.round(calculatDistance(lat1, lat2, lon1, lon2));
	} catch (e) {
		throw new Error(e.message);
	}
	return distance;
}

/**
 * searching for giving address GEOCODE with google map API
 *
 * @param {String} address
 * @returns {Object} or throw error if failed
 */
async function getLocation(address) {
	try {
		const response = await client.geocode({
			params: {
				address: address,
				key: process.env.MAP_API_KEY,
			},
			timeout: 1000, // milliseconds
		});
		if (response.data.status !== "OK") {
			response.data.error_message = "failed to find location: " + address;
			throw { response };
		}
		return response.data.results[0];
	} catch (e) {
		throw new Error(e.response.data.error_message);
	}
}

/**
 * giving 2 peirs or longitude and latitude
 * and calcuating thier distance im KM
 *
 * @param {number} lat1
 * @param {number} lat2
 * @param {number} lon1
 * @param {number} lon2
 * @returns {number}
 */
function calculatDistance(lat1, lat2, lon1, lon2) {
	// The math module contains a function
	// named toRadians which converts from
	// degrees to radians.
	lon1 = (lon1 * Math.PI) / 180;
	lon2 = (lon2 * Math.PI) / 180;
	lat1 = (lat1 * Math.PI) / 180;
	lat2 = (lat2 * Math.PI) / 180;

	// Haversine formula
	let dlon = lon2 - lon1;
	let dlat = lat2 - lat1;
	let a =
		Math.pow(Math.sin(dlat / 2), 2) +
		Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

	let c = 2 * Math.asin(Math.sqrt(a));

	// Radius of earth in kilometers. Use 3956
	// for miles
	let r = 6371;

	// calculate the result
	return c * r;
}

module.exports = {
	getDistance,
	getDistanceAPI,
};
