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

const medicalInfo = (medInfo) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.InitialAssessment.page3medInfo,
      medInfo,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

const mentalStatus = (menStaAssess) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.InitialAssessment.page3menStaAssess, menStaAssess,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

// mentalStatus = (ideation) => {
//   return new Promise((resolve, reject) => {
//     pool.query(
//       QUERIES.InitialAssessment.page3ideation, ideation,
//       (error, results) => {
//         if (error) {
//           return reject(error);
//         }
//         return resolve(results);
//       }
//     );
//   });
// };

module.exports = async function (medInfo, menStaAssess) {
  try {
    const pg3medInfo = await medicalInfo(medInfo);
    const pg3menStaAssess = await mentalStatus(menStaAssess);
    // const pg3ideation = await mentalStatus(ideation);
    console.log('leg', pg3medInfo);
    console.log(pg3menStaAssess);
    // console.log(pg3ideation);
  } catch (error) {
    console.log(error);
  }
};
