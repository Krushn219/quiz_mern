const multer = require("multer");
const fs = require('fs');

const uploadDirectory = 'uploads'; // Define the directory name

// Check if the 'uploads' directory exists; if not, create it
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
  }
 
// Specify the destination for uploaded files and provide a custom filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDirectory); // Uploads will be stored in the "uploads" directory
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Use a timestamp and the original filename
    },
  });
  
  // Create a Multer instance with the storage configuration
  const upload = multer({ storage: storage });

module.exports = upload;