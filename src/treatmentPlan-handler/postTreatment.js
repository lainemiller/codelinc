/* eslint-disable no-undef */
const secrets = require('../secret');

const { Pool } = require('pg');
const { QUERIES } = require('../constants');
const pool = new Pool({
  host: secrets.HOST,
  user: secrets.USER,
  password: secrets.PASSWORD,
  database: secrets.DATABASE,
  port: secrets.PORT
});

treatmentIssue = (requestObjIssues) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.SaveTreatmentPlan.TreatmentPlanDetailsPH, requestObjIssues,
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