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

personalInfo = (personalDetails) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.InitialAssessment.postIAPage1PI,
      personalDetails,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

incomeResc = (personalDetails) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.InitialAssessment.postIAPage1IR,
      personalDetails,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = async function (personalDetails, income) {
  try {
    const PI = await personalInfo(personalDetails);
    const IR = await incomeResc(income);
    console.log('leg', PI);
    console.log(IR);
  } catch (error) {
    console.log(error);
  }
  console.log('query reached');
};
