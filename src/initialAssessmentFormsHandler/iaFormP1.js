const { Pool } = require('pg');
const { QUERIES } = require('../constants');

const AWS = require('aws-sdk');
const region = 'us-east-1';
var dbCredential = {};

const client = new AWS.SecretsManager({
  region
});

client.getSecretValue({ SecretId: 'dev/postgres/codelinc/db' }, function (err, data) {
  if (err) {
    if (err.code === 'DecryptionFailureException') { throw err; } else if (err.code === 'InternalServiceErrorException') { throw err; } else if (err.code === 'InvalidParameterException') { throw err; } else if (err.code === 'InvalidRequestException') { throw err; } else if (err.code === 'ResourceNotFoundException') { throw err; }
  } else {
    if ('SecretString' in data) {
      let secret = data.SecretString;
      dbCredential = JSON.parse(secret);
    }
  }
});

const pool = new Pool({
  host: dbCredential.host,
  user: dbCredential.username,
  password: dbCredential.password,
  database: dbCredential.dbname,
  port: dbCredential.port
});

const personalInfo = (personalDetails) => {
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

const incomeResc = (incomeResources) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.InitialAssessment.postIAPage1IR,
      incomeResources,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

const healthInsurance = (healthInsurance) => {
  return new Promise((resolve, reject) => {
    pool.query(
      QUERIES.InitialAssessment.postIAPage1HI,
      healthInsurance,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};
const FamilyHist = (hist) => {
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
