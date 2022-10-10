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
