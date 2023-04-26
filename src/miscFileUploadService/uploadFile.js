const aws = require('aws-sdk');
const secrets = require('../secret');
const region = 'us-east-1';
let fileCredential = {};

const client = new aws.SecretsManager({
  region
});

client.getSecretValue({ SecretId: 'photo/s3' }, function (err, data) {
  if (err) {
    if (err.code === 'DecryptionFailureException') {
      throw err;
    } else if (err.code === 'InternalServiceErrorException') {
      throw err;
    } else if (err.code === 'InvalidParameterException') {
      throw err;
    } else if (err.code === 'InvalidRequestException') {
      throw err;
    } else if (err.code === 'ResourceNotFoundException') {
      throw err;
    }
  } else {
    if ('SecretString' in data) {
      const secret = data.SecretString;
      fileCredential = JSON.parse(secret);
    }
  }
});

const s3 = new aws.S3({
  secretAccessKey: fileCredential.secretKey,
  accessKeyId: fileCredential.accessKey,
  region: secrets.REGION
});

const uploadToS3 = (imgFile, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadParams = {
      Bucket: "servant-center-profileph-bucket",
      Key: fileName,
      Body: imgFile.buffer,
      ContentType: imgFile.mimetype,
    };
    console.log(uploadParams);
    s3.putObject(uploadParams, (err, data) => {
      if (err) {
        console.log("misc files uploadToS3:", err);
        reject(err);
      }
      console.log("misc files uploadToS3:", data);
      resolve(data);
    });
  });
};

const getUserFilesFromS3 = (prefix) => {
  return new Promise((resolve, reject) => {
    const getParams = {
      Bucket: "servant-center-miscfile-bucket",
      Delimiter: "/",
      Prefix: prefix + "/",
    };
    s3.listObjectsV2(getParams, (err, data) => {
      if (err) {
        console.log("misc files getUserFilesFromS3:", err);
        reject(err);
      }
      console.log("misc files getUserFilesFromS3:", data);
      resolve(data);
    });
  });
};

const downloadFilesFromS3 = (key) => {
  return new Promise((resolve, reject) => {
    const getParams = {
      Bucket: "servant-center-miscfile-bucket",
      Key: key,
    };
    s3.getObject(getParams, (err, data) => {
      if (err) {
        console.log('misc files downloadFilesFromS3 pdf:', err);
        reject(err);
      }
      if (data.ContentType.indexOf('pdf') > 0) {
        console.log('misc files downloadFilesFromS3 pdf:', data);
        resolve(data);
      } else {
        s3.getSignedUrl('getObject', getParams, (err, urlStr) => {
          if (err) {
            console.log('misc files downloadFilesFromS3 image:', err);
            reject(err);
          }
          console.log('misc files downloadFilesFromS3 image:', urlStr);
          resolve(urlStr);
        });
      }
    });
  });
};

module.exports = { uploadToS3, getUserFilesFromS3, downloadFilesFromS3 };
