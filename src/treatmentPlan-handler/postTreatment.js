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

//PhysicalHealth
queryPromise1 = (requestObjIssuesPH) => {
    return new Promise((resolve, reject) => {
      pool.query(
       QUERIES.SaveTreatmentPlan.TreatmentPlanDetailsPH,requestObjIssuesPH,
       (error, results) => {
        if (error) {
         return reject(error)
       }
        return resolve(results)
      }
    )
})
}

queryPromise2 = (requestObjIssuesMH) => {
  return new Promise((resolve, reject) => {
    pool.query(
     QUERIES.SaveTreatmentPlan.TreatmentPlanDetailsPH,requestObjIssuesMH,
     (error, results) => {
      if (error) {
       return reject(error)
     }
      return resolve(results)
    }
  )
})
}


module.exports = async function (requestObjIssuesPH,requestObjIssuesMH){
    try {
        const result1= await queryPromise1(requestObjIssuesPH)
        const result2= await queryPromise2(requestObjIssuesMH)
        const returnStatement=console.log("Successully saved TreatmentIssues")
        return returnStatement
    }catch(error){
        console.log(error)
    }
}
