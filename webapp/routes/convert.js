const express = require('express');
const router = express.Router();
const converter = require('../utils/converter');
const path = require('path');
const fs = require('fs');

router.post('/', async (req, res) => {
  let document = req.files.document;
  let ext = path.extname(document.name);
  let base = path.basename(document.name, ext);

  try {
    let pdfFile = await converter.convert(document.data, document.name);
    res.download(pdfFile, `${base}.pdf`, (err) => {
      fs.unlinkSync(pdfFile);
    });
  }
  catch (ex) {
    console.log('Conversion failed:', ex);
  }
});

module.exports = router;