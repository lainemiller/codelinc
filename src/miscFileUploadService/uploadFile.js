const aws = require('aws-sdk');
const secrets = require('../secret');
const region = 'us-east-1';
let photoCredential = {};

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
      photoCredential = JSON.parse(secret);
    }
  }
});

const s3 = new aws.S3({
  secretAccessKey: photoCredential.secretKey,
  accessKeyId: photoCredential.accessKey,
  region: secrets.REGION
});

const uploadToS3 = (imgFile, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadParams = {
      Bucket: secrets.BUCKET,
      Key: fileName,
      Body: imgFile.buffer,
    };
    console.log("upload params",uploadParams);
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
      Bucket: secrets.BUCKET,
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
      Bucket: secrets.BUCKET,
      Key: key,
    };
    s3.getObject(getParams, (err, data) => {
      if (err) {
        console.log('misc files downloadFilesFromS3 pdf:', err);
        reject(err);
      }
      console.log("file download response from s3",data);
      resolve(data);
      // if (data.ContentType.indexOf('pdf') > 0) {
      //   console.log('misc files downloadFilesFromS3 pdf:', data);
      //   resolve(data);
      // } else {
      //   s3.getSignedUrl('getObject', getParams, (err, urlStr) => {
      //     if (err) {
      //       console.log('misc files downloadFilesFromS3 image:', err);
      //       reject(err);
      //     }
      //     console.log('misc files downloadFilesFromS3 image:', urlStr);
      //     resolve(urlStr);
      //   });
      // }
    });
  });
};

module.exports = { uploadToS3, getUserFilesFromS3, downloadFilesFromS3 };
