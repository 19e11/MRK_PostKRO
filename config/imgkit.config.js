const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMGKIT_PB_KEY,
  privateKey: process.env.IMGKIT_PVT_KEY,
  urlEndpoint: process.env.IMGKIT_URL
});

module.exports = imagekit;
