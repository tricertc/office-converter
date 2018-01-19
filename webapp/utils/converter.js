const request = require('request');
const config = require('../config');
const uuid = require('uuid/v1');
const path = require('path');
const fs = require('fs');

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
