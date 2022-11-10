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

const treatmentIssue = (requestObjIssues) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.TreatmentIssues.SaveTreatmentIssues, requestObjIssues,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = async function (requestObjIssues) {
  try {
    await treatmentIssue(requestObjIssues);
    const returnStatement = console.log('Successfully saved TreatmentIssues');
    return returnStatement;
  } catch (error) {
    console.log(error);
  }
};
