const { Pool } = require('pg');
const { QUERIES } = require('../constants');
const AWS = require('aws-sdk');
const region = 'us-east-1';
var dbCredential = {};

const client = new AWS.SecretsManager({
  region
});

client.getSecretValue({ SecretId: 'dev/postgres/codelinc/db' }, function (err, data) {
  if (err) {
    if (err.code === 'DecryptionFailureException') { throw err; } else if (err.code === 'InternalServiceErrorException') { throw err; } else if (err.code === 'InvalidParameterException') { throw err; } else if (err.code === 'InvalidRequestException') { throw err; } else if (err.code === 'ResourceNotFoundException') { throw err; }
  } else {
    if ('SecretString' in data) {
      let secret = data.SecretString;
      dbCredential = JSON.parse(secret);
    }
  }
});

const pool = new Pool({
  host: dbCredential.host,
  user: dbCredential.username,
  password: dbCredential.password,
  database: dbCredential.dbname,
  port: dbCredential.port
});

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
      QUERIES.InitialAssessment.page4SubAbu, subAbu,
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
