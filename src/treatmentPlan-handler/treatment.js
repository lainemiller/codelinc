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

queryPromise1 = (requestObj) => {
  return new Promise((resolve, reject) => {
    pool.query(
     QUERIES.TreatmentPlan.SaveTreatmentPlanDetails,requestObj,
     (error, results) => {
      if (error) {
       return reject(error)
     }
      return resolve(results)
    }
    )
  })
}

queryPromise2 = (requestObjIssues) => {
    return new Promise((resolve, reject) => {
      pool.query(
       QUERIES.SaveTreatmentPlan.TreatmentPlanDetailsPH,requestObjIssues,
       (error, results) => {
        if (error) {
         return reject(error)
       }
        return resolve(results)
      }
    )
})
}


module.exports = async function (requestObj,requestObjIssues){
    try {
        const result1= await queryPromise1(requestObj)
        const result2= await queryPromise2(requestObjIssues)
     
        const returnStatement=console.log("Successully saved TreatmentPlanDetails")
        return returnStatement
    }catch(error){
        console.log(error)
    }
}
