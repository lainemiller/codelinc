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

MentalHealth = (mental) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.InitialAssessment.page2MHPost,
      mental,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

EmpAndEdu = (edu) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.InitialAssessment.page2EAEPost, edu,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

socialHistory = (social) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.InitialAssessment.page2SocialPost, social,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = async function (edu, mental, social) {
  try {
    const pg1MH = await MentalHealth(mental);
    const pg1EAE = await EmpAndEdu(edu);
    const pg1Soc = await socialHistory(social);
    console.log('leg', pg1MH);
    console.log(pg1EAE);
    console.log(pg1Soc);
  } catch (error) {
    console.log(error);
  }
};
