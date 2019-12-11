const Influx = require("influx");


class MetricsWriter {
	constructor(measurement,conf = {}) {
		const {
			host = 'influxdb01.naturalint.com',
			database = "heartbeat"
        } = conf;
        this.measurement = measurement;
		this.influx = new Influx.InfluxDB({
			host,
			database,
            schema:[{
                measurement: this.measurement,
                fields: {
                    value: Influx.FieldType.FLOAT,
					color: Influx.FieldType.FLOAT,
					trend: Influx.FieldType.FLOAT	
                },
                tags: [
                    'entity',
					'metric',
					'industry'
                ]
            }]
		});
	}

	async writeMetrics(measurement, tags, fields) {
		try {
			this.influx.writePoints([
				{
					measurement: measurement,
					tags: tags,
					fields: fields
				}
			]);
		} catch (e) {
			console.error(e);
		}

	}

	async writeBusinessMetric(entity, metric, value, color,trend,industry) {
		this.writeMetrics(this.measurement, {entity, metric,industry}, {color, value,trend});
	}
	
    async writeBusinessMetrics(data){
		const inserts = data.map((row) => {
			const {
				value,
				color,
				trend,
				metric,
				entity,
				industry,
			} = row;

			return this.writeBusinessMetric(entity, metric, value, color,trend,industry);
		});
		return Promise.all(inserts);
    }




}

module.exports = MetricsWriter;

