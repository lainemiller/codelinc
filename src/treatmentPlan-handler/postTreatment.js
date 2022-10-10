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
