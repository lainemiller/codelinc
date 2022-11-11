const { Pool } = require('pg');
const { QUERIES } = require('../constants');

const AWS = require('aws-sdk');
const region = 'us-east-1';
var dbCredential = {};

const client = new AWS.SecretsManager({
  region
});

getCredential();

function getCredential() {
    client.getSecretValue({ SecretId: 'dev/postgres/codelinc/db' }, function (err, data) {
    if (err) {
      console.log("ERROR")
      console.log(err)
      if (err.code === 'DecryptionFailureException') { throw err; } else if (err.code === 'InternalServiceErrorException') { throw err; } else if (err.code === 'InvalidParameterException') { throw err; } else if (err.code === 'InvalidRequestException') { throw err; } else if (err.code === 'ResourceNotFoundException') { throw err; }
    } else {
      console.log("SUCCESS")
      if ('SecretString' in data) {
        let secret = data.SecretString;
        dbCredential = JSON.parse(secret);
        dbConnection();
      }
    }
  });
}

let pool;
function dbConnection() {
  pool = new Pool({
    host: dbCredential.host,
    user: dbCredential.username,
    password: dbCredential.password,
    database: dbCredential.dbname,
    port: dbCredential.port
  });
}

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
