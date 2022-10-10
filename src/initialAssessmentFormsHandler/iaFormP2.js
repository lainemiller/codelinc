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

const MentalHealth = (mental) => {
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

const EmpAndEdu = (edu) => {
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

module.exports = async function (edu, mental) {
  try {
    const pg1MH = await MentalHealth(mental);
    const pg1EAE = await EmpAndEdu(edu);
    console.log('leg', pg1MH);
    console.log(pg1EAE);
  } catch (error) {
    console.log(error);
  }
};
