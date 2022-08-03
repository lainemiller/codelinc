var constants = require('../constants');
const secrets = require('../secret');

const { Pool } = require('pg')
const { QUERIES } = require('../constants')
const pool = new Pool({
  host: secrets.HOST,
  user: secrets.USER,
  password: secrets.PASSWORD,
  database: secrets.DATABASE,
  port: secrets.PORT
})


queryPromise1 = () =>{
  return new Promise((resolve, reject)=>{
      pool.query(QUERIES.UserProfile.UserAssessmentDetailsTable, (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};

queryPromise2 = (vet) =>{
  return new Promise((resolve, reject)=>{
      pool.query(QUERIES.UserProfile.UserAssessmentDetails, [vet], (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};

queryPromise3 = () =>{
  return new Promise((resolve, reject)=>{
      pool.query(QUERIES.UserProfile.UserAssessmentDetailsFinanceTable, (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};

queryPromise4 = (vet) =>{
  return new Promise((resolve, reject)=>{
      pool.query(QUERIES.UserProfile.UserAssessmentDetailsFinance, [vet], (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};




let Header = [];
let Data = [];
let veteranObj1 = [];
let veteranObj2 = [];
module.exports = async function(vet) {
    try{
    const result1 = await queryPromise1();
    const result2 = await queryPromise2(vet);
    const result3 = await queryPromise3();
    const result4 = await queryPromise4(vet);
    veteranObj1.push(result1.rows[0], result3.rows[0]);
    veteranObj2.push(result2.rows[0], result4.rows[0]);
    const headerObj = [];
    const dataObj = [];
     for (const veteranProp in veteranObj1) {
       for (const veteranProp1 in veteranObj2) {
         headerObj.push({header: veteranProp}, {key: veteranProp1, value: veteranObj2[veteranProp1]});
    //     dataObj.push({key: veteranProp1, value: veteranObj2[veteranProp1]});
      
       }
     }

    console.log('veteranObj1',veteranObj1);
    console.log('veteranObj2',veteranObj2);
    // for (const veteranProp in veteranObj2) {
    //   dataObj.push({key: veteranProp, value: veteranObj2[veteranProp]});
    // }
    console.log('headerObj', headerObj);
    //console.log(dataObj);
    //console.log(headerObj,{data:dataObj});
    //Header.push(result1.rows, result3.rows);
   // Data.push(result2.rows, result4.rows);
    } catch(error){
    console.log(error)
    }
    //console.log('Header', Header);
    //console.log('Data',organizer(Header, Data));
}



function organizer(Header, requestObj){
   let retObj = [];
    const veteranObj = requestObj;
    //console.log(veteranObj);
    const dataObj = [];
    for (const veteranProp in veteranObj) {
      dataObj.push({key: veteranProp, value: veteranObj[veteranProp]});
    }
    //console.log(dataObj);
    return {assessment_details:[{header:Header,data:dataObj}]};
}
