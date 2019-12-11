const redShiftReader = require('./metricReaders/business/redShift');

const MetricsWriter = require("./metricsWriter");
const businessMetricWriter = new MetricsWriter("business_metrics");


const READERS = {
	'impressions': { read: redShiftReader.getImpressions, write: businessMetricWriter},
	'clickouts': { read: redShiftReader.getClickouts, write: businessMetricWriter},
	'earnings': { read: redShiftReader.getEarnings, write: businessMetricWriter},
	'aggregations': { read: redShiftReader.getAggregations, write: businessMetricWriter},
};

exports.handler = async function (event = {}, context) {
	const { metric = 'SitesTraffic' } = event;

	await Promise.all(Object.entries(READERS).map(async reader => {
		try {

			console.info(`INFO data for ${reader[0]}`);
			const data = await reader[1].read();
	
			console.info(`INFO data for ${reader[0]}`, data);
	
			let result = await reader[1].write.writeBusinessMetrics(data);
			console.info(`INFO done for ${reader[0]}`);
		} catch (e) {
			console.error(`ERROR getting data for ${reader[0]}`, e);
		}
	}));
};
