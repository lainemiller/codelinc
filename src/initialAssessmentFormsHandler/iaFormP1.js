/* eslint-disable no-undef */
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

healthInsurance = (personalDetails) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.InitialAssessment.postIAPage1HI,
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
FamilyHist = (hist) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.InitialAssessment.postIAPage1FH,
      hist,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = async function (personalDetails, income, insu, hist) {
  try {
    const PI = await personalInfo(personalDetails);
    const IR = await incomeResc(income);
    const HI = await healthInsurance(insu);
    const FH = await FamilyHist(hist);
    console.log('leg', PI);
    console.log(IR);
    console.log(HI);
    console.log(FH);
  } catch (error) {
    console.log(error);
  }
  console.log('query reached');
};
