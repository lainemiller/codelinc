const { Pool } = require('pg');
const { QUERIES } = require('../constants');

const AWS = require('aws-sdk');
const region = 'us-east-1';
let dbCredential = {};

const client = new AWS.SecretsManager({
  region
});

getCredential();

function getCredential () {
  client.getSecretValue(
    { SecretId: 'dev/postgres/codelinc/db' },
    function (err, data) {
      if (err) {
        console.log('ERROR');
        console.log(err);
        if (err.code === 'DecryptionFailureException') {
          throw err;
        } else if (err.code === 'InternalServiceErrorException') {
          throw err;
        } else if (err.code === 'InvalidParameterException') {
          throw err;
        } else if (err.code === 'InvalidRequestException') {
          throw err;
        } else if (err.code === 'ResourceNotFoundException') {
          throw err;
        }
      } else {
        console.log('SUCCESS');
        if ('SecretString' in data) {
          const secret = data.SecretString;
          dbCredential = JSON.parse(secret);
          dbConnection();
        }
      }
    }
  );
}

let pool;
function dbConnection () {
  pool = new Pool({
    host: dbCredential.host,
    user: dbCredential.username,
    password: dbCredential.password,
    database: dbCredential.dbname,
    port: dbCredential.port
  });
}

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
