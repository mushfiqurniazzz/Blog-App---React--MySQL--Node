//this middleware will be the cloudinary connection initialization file which will connect to the cloudinary cloud using the cloudinary library and the config function by taking the credentials stored in environmental varibales 
const cloudinary = require("cloudinary").v2;
//env variables
require("dotenv").config();

//cloudinary config function which will take credentials from env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRECT
});

//exporting the connection function
module.exports = cloudinary;
