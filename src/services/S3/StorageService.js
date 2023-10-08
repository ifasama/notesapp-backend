const AWS = require('aws-sdk');

class StorageService {
  constructor() {
    this._S3 = new AWS.S3();
  }

  writeFile(file, meta) {
    const parameter = {
      Bucket: process.env.AWS_BUCKET_NAME, // name of the s3 bucket we are using
      Key: +new Date() + meta.filename, // nama berkas yang akan disimpan
      Body: file._data, // Berkas dalam bentuk buffer yang akan disimpan
      // kenapa data pakai underscore? karena variable data reserved di AWS?
      ContentType: meta.headers['content-type'], // MIME type berkas yang akan disimpan
    };

    return new Promise((resolve, reject) => {
      this._S3.upload(parameter, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data.Location);
      });
    });
  }
}

module.exports = StorageService;
