const aws = require("aws-sdk");
const secret = require("../secret");

const s3 = new aws.S3({
  region: secret.REGION,
});

const uploadToS3 = (imageBody, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadParams = {
      Bucket: "servant-center-miscfile-bucket",
      Key: fileName,
      Body: imageBody,
    };
    console.log("files resp", uploadParams);

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

const getUserFilesFromS3 = (prefix) => {
  return new Promise((resolve, reject) => {
    const getParams = {
      Bucket: "servant-center-miscfile-bucket",
      Delimiter: "/",
      Prefix: prefix + "/",
    };
    console.log(getParams);
    s3.listObjectsV2(getParams, (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      console.log(data);
      resolve(data);
    });
  });
};

module.exports = { uploadToS3, getUserFilesFromS3 };
