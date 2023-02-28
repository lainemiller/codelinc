const aws = require('aws-sdk');
const secret = require('../secret');
//const secrets = require('../secret');
//let fileCredential = {};

// const client = new aws.SecretsManager({
//   region
// });

// client.getSecretValue({ SecretId: 'file/s3' }, function (err, data) {
//   if (err) {
//     if (err.code === 'DecryptionFailureException') {
//       throw err;
//     } else if (err.code === 'InternalServiceErrorException') {
//       throw err;
//     } else if (err.code === 'InvalidParameterException') {
//       throw err;
//     } else if (err.code === 'InvalidRequestException') {
//       throw err;
//     } else if (err.code === 'ResourceNotFoundException') {
//       throw err;
//     }
//   } else {
//     if ('SecretString' in data) {
//       const secret = data.SecretString;
//       fileCredential = JSON.parse(secret);
//     }
//   }
// });

const s3 = new aws.S3({
    region:secret.REGION
});

const uploadToS3 = (imageBody, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadParams = {
      Bucket: "servant-center-miscfile-bucket",
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

module.exports = { uploadToS3 };
