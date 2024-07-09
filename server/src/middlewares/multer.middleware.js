// uploading the file with the help of multer middleware to the local disk storage

import multer from "multer"

// storing the location of the localstorage where the file is to be uploaded, and the name of the file
const storage = multer.diskStorage({
    // deciding the location of the localstorage where the file has to be kept.
    destination:function(req,file,cb){
        cb(null,"./public/temp")
    },

    // deciding the names of the file here
    fileName:function(req,file,cb){
        cb(null,file.originalname)
    }
})

export const upload = multer({
    storage 
})