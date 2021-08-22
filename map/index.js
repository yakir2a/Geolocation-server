const { Client } = require("@googlemaps/google-maps-services-js");
const { checkCache: cache, insert: addToCache } = require("../cache");
const { sourceToDestination } = require("../db/schema");
require("dotenv").config();

const client = new Client({});

async function getDistance(source, destination) {
	try {
		let result = cache(source, destination) | null;
		if (!result) {
			({ lat: lat1, lng: lon1 } = (
				await getLocation(source)
			).geometry.location);
			({ lat: lat2, lng: lon2 } = (
				await getLocation(destination)
			).geometry.location);
			result = Math.round(distance(lat1, lat2, lon1, lon2));
			addToCache(source, destination);
		}
		console.log(result);
		return result;
	} catch (e) {
		console.log(e);
		return null;
	}
}

async function getLocation(address) {
	try {
		const response = await client.geocode({
			params: {
				address: address,
				key: process.env.MAP_API_KEY,
			},
			timeout: 1000, // milliseconds
		});
		if (response.data.status !== "OK") return null;
		return response.data.results[0];
	} catch (e) {
		throw new Error(
			"Failed to get location: " + e.response.data.error_message
		);
	}
}

function distance(lat1, lat2, lon1, lon2) {
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
};
