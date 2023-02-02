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
        console.log('SUCCESS iaForm');
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
  pool.connect();
}

const LeaglHist = (legal) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.InitialAssessment.page4legal,
      legal,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

const SubstanceAbuse = (subAbu) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.InitialAssessment.page4SubAbu,
      subAbu,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = async function (legal, subAbu) {
  try {
    const pg1Leagl = await LeaglHist(legal);
    const pg1SubAbu = await SubstanceAbuse(subAbu);
    console.log('leg', pg1Leagl);
    console.log(pg1SubAbu);
  } catch (error) {
    console.log(error);
  }
};
