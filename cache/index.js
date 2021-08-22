/**
 * if new result insert it to the array and dic
 * array hold the keys of the dic sorted by the hit value
 * dic hold the result object {source: String, destination: String, hits: int}
 */

const schemas = require("../db/schema");

// will handle db req for data in not found and will update
const maxLength = process.env.MAX_CACHE_LENGTH;

//fifo array sorted by "hit"
const sorted = [];

//hold a dic for each known entry
const cache = {};

/**
 *
 * @param {String} source
 * @param {String} destination
 * @returns {number | null} return the distance if found else null
 */
function checkCache(source, destination) {
	if (source + destination in cache) return cache[source + destination];
	return null;
}

/**
 * will insert new req if not in cache unless it less have less "hit" from every element
 * @param {{source: String, destination: String, distance: int}} result
 */
function insert(result) {
	let max = sorted.length;

	if (max == maxLength) {
		if (cache[sorted[max - 1]].hits < result.hits) {
			//if reach max lenght and need to replace pop the smallest and remove from it cashe
			delete cache[sorted[max - 1]];
			sorted.pop();
			max = max - 1;
		}
		// else no need to replace result in cache
		else return;
	}

	for (i = max; i > 0; i--) {
		if (result.hits > cache[sorted[i]].hits) {
			cache[sorted[i]];
		}
	}
}

function incressHit() {}

module.exports = {
	checkCache,
	insert,
	incressHit,
};
