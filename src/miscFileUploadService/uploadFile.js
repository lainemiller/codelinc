const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} = require(`@aws-sdk/client-s3`);

const presigner = require("@aws-sdk/s3-request-presigner");
const s3 = new S3Client({
  region: "us-east-1",
});
const bucketName = "servant-center-miscfile-bucket";

const uploadToS3 = (imgFile, fileName) => {
  return new Promise((resolve, reject) => {
    const objectParams = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: imgFile.buffer,
      ContentType: imgFile.mimetype,
    });
    console.log(objectParams);
    s3.send(objectParams).then(
      (data) => {
        console.log("upload file", data);
        resolve(data);
      },
      (err) => {
        console.log("upload file err", err);
        reject(err);
      }
    );
  });
};

const getUserFilesFromS3 = (prefix) => {
  return new Promise((resolve, reject) => {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Delimiter: "/",
      Prefix: prefix + "/",
    });
    s3.send(command).then(
      (result) => {
        resolve(result);
      },
      (err) => {
        reject(err);
      }
    );
  });
};

const downloadFilesFromS3 = (key) => {
  return new Promise((resolve, reject) => {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    console.log("key==>", key);
    presigner.getSignedUrl(s3, command, { expiresIn: 3000 }).then(
      (data) => {
        resolve(data);
      },
      (err) => {
        reject(err);
      }
    );
  });
};

module.exports = { uploadToS3, getUserFilesFromS3, downloadFilesFromS3 };
