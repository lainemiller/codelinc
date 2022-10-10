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
