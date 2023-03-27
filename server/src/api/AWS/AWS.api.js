require('dotenv').config();
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const path = require('path');

const AWS_S3_CLIENT = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const UPLOAD_CONFIG = {
  filePath: '', // Nombre completo (incluyendo la ruta) del archivo. Ex: 'el-angel-2023-01-01'
  keyName: '', // Reenombra el archivo al guardarse en el bucket (incluye las extensiones '.gz, .gzip, .txt, .json')
  bucketName: '', // Nombre del S3 Bucket
}

async function uploadFileToBucket(config = UPLOAD_CONFIG) {
  const uploadConfig = { ...UPLOAD_CONFIG, ...config };

  const fileOriginalName = path.basename(config.filePath);
  const fileName = config.keyName ?? fileOriginalName;
  const command = new PutObjectCommand({
    Bucket: uploadConfig.bucketName, // Nombre del bucket
    Key: fileName, // Nombre del archivo al guardarse en el bucket
    Body: uploadConfig.filePath // Archivo o data que se guardara en el bucket
  });

  try {
    const response = await AWS_S3_CLIENT.send(command);
    return {
      ok: response.$metadata.httpStatusCode >= 200 && response.$metadata.httpStatusCode <= 300,
      file: fileName,
      response,
    }
  } catch (err) {
    return {
      ok: false,
      error: err,
    }
  }
}

module.exports = {
  uploadFileToBucket,
}