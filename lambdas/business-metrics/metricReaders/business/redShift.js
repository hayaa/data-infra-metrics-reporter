const {Client} = require('pg');
const QUERIES = require('./queries');

process.env.HOST='redshift-prod-int.naturalint.com';
process.env.PORT='5439';
process.env.DATABASE='warehouse';
process.env.USER='heart_beat';
process.env.PASSWORD='HBv123456@';

const {
	HOST: host,
	PORT: port,
	DATABASE: database,
	USER: user,
	PASSWORD: password,
} = process.env;


async function getImpressions() {
	const client = new Client({host, port, database, user, password});
	await client.connect();
	const {rows} = await client.query(QUERIES.impressions);
	await client.end();

	return rows.map(row => {
		const {value} = row;
		return {
			value: row.value,
			metric:row.metric,
			entity:row.entity,
			color: (value/100.0 < 0.10 ? 1 : 0.1),
		}
	});
}

async function getClickouts() {
	const client = new Client({host, port, database, user, password});
	await client.connect();
	const {rows} = await client.query(QUERIES.clickouts);
	await client.end();

	return rows.map(row => {
		const {value} = row;
		return {
			value: row.value,
			metric:row.metric,
			entity:row.entity,
			color: (value/100.0 < 0.10 ? 1 : 0.1),
		}
	});
}

async function getEarnings() {
	const client = new Client({host, port, database, user, password});
	await client.connect();
	const {rows} = await client.query(QUERIES.earnings);
	await client.end();

	return rows.map(row => {
		const {value} = row;
		return {
			value: row.value,
			metric:row.metric,
			entity:row.entity,
			color: (value/100.0 < 0.10 ? 1 : 0.1),
		}
	});
}

async function getAggregations() {
	const client = new Client({host, port, database, user, password});
	await client.connect();
	const {rows} = await client.query(QUERIES.aggregations);
	await client.end();

	return rows.map(row => {
		const {value} = row;
		return {
			value: row.value,
			metric:row.metric,
			entity:row.entity,
			color: (value/100.0 < 0.10 ? 1 : 0.1),
		}
	});
}



module.exports = {
	getImpressions,
	getClickouts,
	getEarnings,
	getAggregations
};