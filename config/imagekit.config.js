const ImageKit = require('imagekit');

const imagekit = new ImageKit({
    publicKey: process.env.IK_PUB,
    privateKey: process.env.IK_PVT,
    urlEndpoint : process.env.IK_URL,
});

module.exports = imagekit;