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
        QUERIES.TreatmentPlan.GetTreatmentPlanDetails,[vet],
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