const redShiftReader = require('./metricReaders/business/redShift');
const QUERIES = require('./metricReaders/business/queries');

const MetricsWriter = require("./metricsWriter");
const businessMetricWriter = new MetricsWriter("business_metrics");

const READERS = Object.values(QUERIES).map(queryEntity => getReaderForQuery(queryEntity));

exports.handler = async function (event = {}, context) {
    const {metric = 'SitesTraffic'} = event;

    await Promise.all(Object.entries(READERS).map(async reader => {
        let readerName;

        try {
            readerName = reader[1].name;

            console.info(`INFO data for ${readerName}`);

            const data = await reader[1].read();

            console.info(`INFO data for ${readerName}`, data);

            let result = await reader[1].write.writeBusinessMetrics(data);

            console.info(`INFO done for ${readerName}`, result);

        } catch (e) {
            console.error(`ERROR getting data for ${readerName}`, e);
        }
    }));
};


function getReaderForQuery(queryEntity) {
    return {name: queryEntity[0], read: redShiftReader.getDataByQuery(queryEntity[1]), write: businessMetricWriter}
}
