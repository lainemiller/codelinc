const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const https = require('https');
const fs = require('fs');
// const dotenv = require('dotenv');
// dotenv.config();

aws.config.update({
  secretAccessKey: '6v/hXrJj3YWllnobXYJxyNA7UVIy5P5MGp+KvAl3',
  accessKeyId: 'AKIASX4D4UGUWXQMLUUC',
  region: 'us-east-1' // E.g us-east-1
});

const s3 = new aws.S3();

/* In case you want to validate your file type */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Wrong file type, only upload JPEG and/or PNG !'),
      false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: 'servant-center-profileph-bucket',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      /* I'm using Date.now() to make sure my file has a unique name */
      req.file = Date.now() + file.originalname;
      cb(null, Date.now() + file.originalname);
    }
  })
});

module.exports = upload;

// const fs = require('fs')
// const S3 = require('aws-sdk/clients/s3')

// const bucketName = "servant-center-profileph-bucket"
// const region = "us-east-1"
// const accessKeyId =  "AKIASX4D4UGUWXQMLUUC"
// const secretAccessKey = "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"

// const s3 = new S3({
//   region,
//   accessKeyId,
//   secretAccessKey
// })

// // uploads a file to s3
// function uploadFile(file) {
//   const fileStream = fs.createReadStream(file.path)

//   const uploadParams = {
//     Bucket: bucketName,
//     Body: fileStream,
//     Key: file.filename
//   }

//   return s3.upload(uploadParams).promise()
// }
// exports.uploadFile = uploadFile
