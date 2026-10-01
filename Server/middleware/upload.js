// const multer = require("multer");
// const path=require("path")

// const storage = multer.diskStorage({
//    destination: function (req, file, cb)
//     {
//       cb(null, "uploads/");
//     },
//    filename: function (req, file, cb) 
//     {
//       cb(null, Date.now() + "-" + path.extname(file.originalname));
//    }
// });

// // const upload = multer({ storage });

// module.exports = multer({ storage });



const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'my-app-uploads',       // folder name in your Cloudinary account
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, crop: 'limit' }], // optional
  },
});

const upload = multer({ storage });

module.exports = upload;