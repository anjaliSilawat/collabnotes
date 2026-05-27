const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log("Cloudinary Config Loaded ✔️", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  keyExists: !!process.env.CLOUDINARY_API_KEY,
  secretExists: !!process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;