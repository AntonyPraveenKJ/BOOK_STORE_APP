const { S3 } = require("@aws-sdk/client-s3");
const fs = require("fs");



const bucketName ="book-store-app-images";
const region ="ap-south-1";
const accessKeyId = "AKIA2XY6YO3N5F7XXTFC";
const secretAccessKey = "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";


const s3 = new S3({
  region,
  credentials:{
    accessKeyId,
    secretAccessKey,
  }
});

//Upload a file to S3

function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.putObject(uploadParams);
}
exports.uploadFile = uploadFile;

// Downloads a file from S3

function getFileStream(fileKey){
    const downloadParams={
        Key:fileKey,
        Bucket:bucketName
    }
    return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream=getFileStream;