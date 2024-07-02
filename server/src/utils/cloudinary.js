// here we are uploading the files from the localstorage server to the cloudinary and then removing from the local server

import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

// configuring the cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET 
})


export const uploadOnCloudinary = async(localFilePath)=>{
    try{
        // checking if the file exists in the localstorage
        if(!localFilePath){
            return null;
        }

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        

        fs.unlinkSync(localFilePath) // removed the temporary saved local file 

        return response; // file gets uploaded and returned the url as the response
    }
    catch(err){
        fs.unlinkSync(localFilePath)
        console.log(err)
    }
}

// for deleting the file from cloudinary we need the public id 

// extracting the public id from the url

export function getPublicIdFromUrl(cloudinaryUrl){
      // Cloudinary URL format: https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/<public_id>.<format>
      const parts = cloudinaryUrl.split('/');
      const publicIdWithFormat = parts[parts.length - 1]; // get the last part of the url
      const publicId = publicIdWithFormat.split('.')[0]; // again splitting and extracting the public id
      return publicId;
}

// function for deleting the file from cloudinary
export const deleteFromCloudinary = async(publicId)=>{
    try{
        if(!publicId){
            return null;
        }

        const response = await cloudinary.uploader.destroy(publicId);

        return response; // return response from cloudinary
    }

    catch(err){
        console.error("error deleting file from cloudinary");
        throw err;
    }
};

