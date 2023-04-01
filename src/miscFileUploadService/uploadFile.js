const aws = require('aws-sdk');
const secret = require('../secret');

const s3 = new aws.S3({
  region: secret.REGION
});

const uploadToS3 = (imgFile, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadParams = {
      Bucket: 'servant-center-miscfile-bucket',
      Key: fileName,
      Body: imgFile?.buffer,
      'Content-Type': imgFile?.mimetype
    };

    s3.upload(uploadParams, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const getUserFilesFromS3 = (prefix) => {
  return new Promise((resolve, reject) => {
    const getParams = {
      Bucket: 'servant-center-miscfile-bucket',
      Delimiter: '/',
      Prefix: prefix + '/'
    };
    s3.listObjectsV2(getParams, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const downloadFilesFromS3 = (key) => {
  return new Promise((resolve, reject) => {
    const getParams = {
      Bucket: 'servant-center-miscfile-bucket',
      Key: key
    };
    s3.getObject(getParams, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

module.exports = { uploadToS3, getUserFilesFromS3, downloadFilesFromS3 };
