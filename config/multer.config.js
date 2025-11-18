const multer = require('multer');
const crypto = require('crypto');
const path  = require('path');
const { error } = require('console');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Profile Updated Successfully!!");
    cb(null, path.join(__dirname, '../public/imgs/uploads'));
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(6, (err, bites)=>{
        const fn = bites.toString('hex')+ path.extname(file.originalname);
        cb(null, fn);
    });
  }
});

const upload  = multer({storage:storage});

module.exports = upload;  