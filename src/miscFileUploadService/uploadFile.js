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
      Body: imgFile.buffer,
      ContentType: imgFile.mimetype
    };

    s3.upload(uploadParams, (err, data) => {
      if (err) {
        console.log('misc files uploadToS3:', err);
        reject(err);
      }
      console.log('misc files uploadToS3:', data);
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
        console.log('misc files getUserFilesFromS3:', err);
        reject(err);
      }
      console.log('misc files getUserFilesFromS3:', data);
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
    // s3.getObject(getParams, (err, data) => {
    //   if (err) {
    //     console.log('misc files downloadFilesFromS3:', err);
    //     reject(err);
    //   }
    //   console.log('misc files downloadFilesFromS3:', data);
    //   resolve(data);
    // });
    s3.getSignedUrl('getObject', getParams, (err, urlStr) => {
      if (err) {
        console.log('misc files downloadFilesFromS3:', err);
        reject(err);
      }
      console.log('misc files downloadFilesFromS3:', urlStr);
      resolve(urlStr);
    });
  });
};

module.exports = { uploadToS3, getUserFilesFromS3, downloadFilesFromS3 };
