const aws = require('aws-sdk');
const secrets = require('../secret');

const s3 = new aws.S3({
  secretAccessKey: secrets.SECRETACCESSKEY,
  accessKeyId: secrets.ACCESSKEYID,
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
