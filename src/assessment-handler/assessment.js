/* eslint-disable no-undef */
const secrets = require('../secret')

const { Pool } = require('pg')
const { QUERIES } = require('../constants')
const pool = new Pool({
  host: secrets.HOST,
  user: secrets.USER,
  password: secrets.PASSWORD,
  database: secrets.DATABASE,
  port: secrets.PORT
})

queryPromise1 = (vet) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.UserProfile.UserAssessmentDetailsPI,
      [vet],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      }
    )
  })
}

queryPromise2 = (vet) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.UserProfile.UserAssessmentDetailsFinance,
      [vet],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      }
    )
  })
}

queryPromise3 = (vet) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.UserProfile.UserAssessmentDetailsEEH,
      [vet],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      }
    )
  })
}
queryPromise4 = (vet) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.UserProfile.UserAssessmentDetailsSocial,
      [vet],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      }
    )
  })
}

queryPromise5 = (vet) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.UserProfile.UserAssessmentDetailsFamily,
      [vet],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      }
    )
  })
}

queryPromise6 = (vet) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.UserProfile.UserAssessmentDetailsSAH,
      [vet],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      }
    )
  })
}
queryPromise7 = (vet) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.UserProfile.UserAssessmentDetailsLHI,
      [vet],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      }
    )
  })
}

// queryPromise8 = (vet) => {
//   return new Promise((resolve, reject) => {
//     pool.query(
//       QUERIES.UserProfile.UserAssessmentDetailsITG,
//       [vet],
//       (error, results) => {
//         if (error) {
//           return reject(error);
//         }
//         return resolve(results);
//       }
//     );
//   });
// };

module.exports = async function (vet) {
  try {
    const result1 = await queryPromise1(vet)
    const result2 = await queryPromise2(vet)
    const result3 = await queryPromise3(vet)
    const result4 = await queryPromise4(vet)
    const result5 = await queryPromise5(vet)
    const result6 = await queryPromise6(vet)
    const result7 = await queryPromise7(vet)
    // const result8 = await queryPromise8(vet)

    const assessmentDetails = {
      assessment_details: [
        { header: 'Personal Information', data: dataFormatter(result1.rows) },
        { header: 'Financial', data: dataFormatter(result2.rows) },
        {
          header: 'Employment and Education History',
          data: dataFormatter(result3.rows)
        },
        { header: 'Social', data: dataFormatter(result4.rows) },
        { header: 'Family', data: dataFormatter(result5.rows) },
        {
          header: 'Substance Abuse History',
          data: dataFormatter(result6.rows)
        },
        { header: 'Legal History/Issues', data: dataFormatter(result7.rows) }
        // { header: "Initial Treatment Goals", data: dataFormatter(result8.rows) },
      ]
    }
    // console.log('assessmentDetails', assessmentDetails)
    return assessmentDetails
  } catch (error) {
    console.log(error)
  }
}

function dataFormatter (requestObj) {
  const veteranObj = requestObj[0]

  const dataObj = []
  for (const veteranProp in veteranObj) {
    dataObj.push({ key: veteranProp, value: veteranObj[veteranProp] })
  }

  return dataObj
}
