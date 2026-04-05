import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "documents",
    resource_type: "raw",   // 🔥 keep this
    type: "upload",         // 🔥 VERY IMPORTANT
  },
});

const upload = multer({ storage });

export default upload;