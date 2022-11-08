const aws = require('aws-sdk');
const secrets = require('../secret');
const region = 'us-east-1';
var photoCredential = {};

const client = new aws.SecretsManager({
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

const s3 = new aws.S3({
  secretAccessKey: photoCredential.secretKey,
  accessKeyId: photoCredential.accessKey,
  region: secrets.REGION
});

const uploadToS3 = (imageBody, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadParams = {
      Bucket: secrets.BUCKET,
      Key: fileName,
      Body: imageBody
    };
    console.log('files resp', uploadParams);

    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      console.log(data);
      resolve(data);
    });
  });
};

const getImageFromS3 = (fileName) => {
  return new Promise((resolve, reject) => {
    const getParams = {
      Bucket: secrets.BUCKET,
      Key: fileName
    };
    console.log('files resp', getParams);

    s3.getObject(getParams, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      console.log(data);
      resolve(data);
    });
  });
};

module.exports = { uploadToS3, getImageFromS3 };
