const axios = require('axios');
const cheerio = require('cheerio');

const TARGET = 'http://64.227.105.240/total/ordenes_servicio';

exports.handler = async function(event, context) {
  try {
    const res = await axios.get(TARGET, { timeout: 10000 });
    const $ = cheerio.load(res.data);
    const table = $('table').first();
    if (!table.length) {
      return { statusCode: 404, body: JSON.stringify({ error: 'No se encontró tabla' }) };
    }

    const headers = [];
    const firstRow = table.find('tr').first();
    firstRow.find('th,td').each((i, el) => headers.push($(el).text().trim()));

    const rows = [];
    table.find('tr').slice(1).each((i, tr) => {
      const row = {};
      $(tr).find('td').each((j, td) => {
        const key = headers[j] || `col_${j}`;
        row[key] = $(td).text().trim();
      });
      if (Object.keys(row).length) rows.push(row);
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ headers, rows })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.toString() })
    };
  }
};
