const AWS = require('aws-sdk');
const region = 'us-east-1';
var photoCredential;

const client = new AWS.SecretsManager({
  region
});

client.getSecretValue({ SecretId: 'photo/s3' }, function (err, data) {
  if (err) {
    if (err.code === 'DecryptionFailureException') { throw err; } else if (err.code === 'InternalServiceErrorException') { throw err; } else if (err.code === 'InvalidParameterException') { throw err; } else if (err.code === 'InvalidRequestException') { throw err; } else if (err.code === 'ResourceNotFoundException') { throw err; }
  } else {
    if ('SecretString' in data) {
      let secret = data.SecretString;
      photoCredential = JSON.parse(secret);
    }
  }
});

module.exports = Object.freeze({
  REGION: 'us-east-1',
  HOST: 'codelinc-dev-instance-1.cc3ixdgzorsu.us-east-1.rds.amazonaws.com',
  USER: 'codelinc_api',
  DBENTRY: 'sjr930Qhy',
  DATABASE: 'codelinc',
  PORT: '5432',
  SECRETACCESSKEY: photoCredential.secretKey,
  ACCESSKEYID: photoCredential.accessKey,
  BUCKET: 'servant-center-profileph-bucket'
});
