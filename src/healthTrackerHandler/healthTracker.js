const { Pool } = require('pg');
const { QUERIES } = require('../constants');
const AWS = require('aws-sdk');
const region = 'us-east-1';
var dbCredential = {};

const client = new AWS.SecretsManager({
  region
});

getCredential();

function getCredential() {
    client.getSecretValue({ SecretId: 'dev/postgres/codelinc/db' }, function (err, data) {
    if (err) {
      console.log("ERROR")
      console.log(err)
      if (err.code === 'DecryptionFailureException') { throw err; } else if (err.code === 'InternalServiceErrorException') { throw err; } else if (err.code === 'InvalidParameterException') { throw err; } else if (err.code === 'InvalidRequestException') { throw err; } else if (err.code === 'ResourceNotFoundException') { throw err; }
    } else {
      console.log("SUCCESS")
      if ('SecretString' in data) {
        let secret = data.SecretString;
        dbCredential = JSON.parse(secret);
        dbConnection();
      }
    }
  });
}

let pool;
function dbConnection() {
  pool = new Pool({
    host: dbCredential.host,
    user: dbCredential.username,
    password: dbCredential.password,
    database: dbCredential.dbname,
    port: dbCredential.port
  });
}

const insertHealthTracker = (insertHealthTrackerObj, veteranId) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < insertHealthTrackerObj.length; i++) {
      const requestParams = insertHealthTrackerObj[i];
      const requestObj = [
        veteranId,
        requestParams.trackingSubject,
        requestParams.date,
        requestParams.measurement,
        requestParams.comments,
        requestParams.currentTracker
      ];
      pool.query(
        QUERIES.HealthTracker.saveHealthTrackerRequest, requestObj,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    }
  });
};

const updateHealthTracker = (updateHealthTrackerObj, veteranId) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < updateHealthTrackerObj.length; i++) {
      const requestParams = updateHealthTrackerObj[i];
      const requestObj = [
        veteranId,
        requestParams.tracking_subject,
        requestParams.note_date,
        requestParams.measurement,
        requestParams.tracking_comments,
        requestParams.current_tracker
      ];
      pool.query(
        QUERIES.HealthTracker.updateHealthTrackerRequest, requestObj,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    }
  });
};

const getHealthTracker = (veteranId) => {
  return new Promise((resolve, reject) => {
    const requestObj = [veteranId];
    pool.query(
      QUERIES.HealthTracker.getHealthTracker, requestObj,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = async function (insertHealthTrackerObj, updateHealthTrackerObj, veteranId) {
  try {
    if (insertHealthTrackerObj.length !== 0) {
      await insertHealthTracker(insertHealthTrackerObj, veteranId);
    }
    if (updateHealthTrackerObj.length !== 0) {
      await updateHealthTracker(updateHealthTrackerObj, veteranId);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result3 = await getHealthTracker(veteranId);
    return result3.rows;
  } catch (error) {
    console.log(error);
  }
};
