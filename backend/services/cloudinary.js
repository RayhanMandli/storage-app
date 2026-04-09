import {v2}  from "cloudinary"
const cloudinary = v2;
cloudinary.config({
  secure: true,
});

export default cloudinary;
