const {Client} = require('pg');

const {
    HOST: host,
    PORT: port,
    DATABASE: database,
    USER: user,
    PASSWORD: password,
} = process.env;

async function getDataByQuery(query) {

    const client = new Client({host, port, database, user, password});
    await client.connect();
    const {rows} = await client.query(query);
    await client.end();

    return rows.map(row => {
        const {value} = row;
        return {
            value: row.value,
            metric: row.metric,
            entity: row.entity,
            color: (value / 100.0 < 0.10 ? 1 : 0.1),
        }
    });
}

module.exports = {
    getDataByQuery
};