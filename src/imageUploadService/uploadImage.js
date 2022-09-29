const aws = require('aws-sdk');

const s3 = new aws.S3({
  secretAccessKey: '6v/hXrJj3YWllnobXYJxyNA7UVIy5P5MGp+KvAl3',
  accessKeyId: 'AKIASX4D4UGUWXQMLUUC',
  region: 'us-east-1'
});

const uploadToS3 = (imageBody, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadParams = {
      Bucket: 'servant-center-profileph-bucket',
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
      return resolve(data);
    });
  });
};

module.exports = uploadToS3;
