import multer from "multer";
import path from "path";

 //  Storage   configuration
const storage = multer.diskStorage({
     destination: (req, file, cb) => {
        cb(null, "uploads/");
  },
  filename:  (req, file, cb) =>  {

      const uniqueName = Date.now() + path.extname(file.originalname);


       cb(null, uniqueName);
  }
});

 //  File filter ( only images )

const  fileFilter  = ( req, file, cb ) =>  {
  if ( file.mimetype.startsWith("image/") ) {
     cb(null, true);
  }  else {
     cb(new Error("Only image files are allowed"), false) ;

  }
};

const  upload =  multer(
  {
  storage,
   fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

export default upload;