const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

// Upload folder path
const uploadPath = path.join(__dirname, "../public/imgs/uploads");

// Ensure folder exists (important for Render deployment)
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Profile Uploaded Successfully!");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(6, (err, bytes) => {
      const filename = bytes.toString("hex") + path.extname(file.originalname);
      cb(null, filename);
    });
  }
});

const upload = multer({ storage });

module.exports = upload;
