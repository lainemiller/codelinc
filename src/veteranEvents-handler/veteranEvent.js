const secrets = require('../secret');

const { Pool } = require('pg');
const { QUERIES } = require('../constants');
const pool = new Pool({
  host: secrets.HOST,
  user: secrets.USER,
  password: secrets.DBENTRY,
  database: secrets.DATABASE,
  port: secrets.PORT
});

const queryPromise1 = (veteranId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.calendarAPis.getCurrentVeteranEmailId,
      [veteranId],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

const queryPromise2 = (emailId) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.calendarAPis.getCalendarEventsForVeteran,
      [emailId],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = async function (vet) {
  try {
    const result1 = await queryPromise1(vet);
    const result2 = await queryPromise2(result1.rows[0].email);
    return result2.rows;
  } catch (error) {
    console.log(error);
  }
};
