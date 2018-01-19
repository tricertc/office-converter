const request = require('request');
const config = require('../config');
const uuid = require('uuid/v1');
const qpdf = require('node-qpdf');
const path = require('path');
const fs = require('fs');
const mv = require('mv');

exports.convert = (buffer, name) => {
  return new Promise((resolve, reject) => {
    let id = uuid();
    let tmpFile = path.join(config.UPLOADS_DIR, id);

    let options = {
      url: config.CONVERTER_URL,
      formData: {
        file: {
          value: buffer,
          options: {
            filename: name
          }
        }
      }
    };

    let output = fs.createWriteStream(tmpFile);

    request.post(options, (err, res, body) => {
      if (err) {
        return reject(err);
      }
      if (res.statusCode !== 200) {
        return reject(body);
      }
    }).pipe(output);

    output.on('finish', () => resolve(tmpFile));
  });
};

exports.protect = (pdfFile, password) => {
  return new Promise((resolve, reject) => {
    try {
      let tmpFile = path.join(config.UPLOADS_DIR, uuid());
      mv(pdfFile, tmpFile, () => {
        let options = {
          keyLength: 128,
          password: password
        };

        let stream = fs.createWriteStream(pdfFile);

        qpdf.encrypt(tmpFile, options).pipe(stream);

        stream.on('finish', () => {
          resolve();
          fs.unlinkSync(tmpFile);
        });
      });
    }
    catch (ex) {
      reject(ex);
    }
  });
};
