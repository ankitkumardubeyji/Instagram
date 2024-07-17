// here we are uploading the files from the localstorage server to the cloudinary and then removing from the local server

import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { getBase64 } from "../lib/helper.js";
import { v4 as uuid } from "uuid";

// configuring the cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET 
})

// this is for uploading on cloudinary when single files are selected 
export const uploadOnCloudinarySingle = async(localFilePath)=>{
    try{
        if(!localFilePath){
            return null;
        }

        // upload the file on cloudinary

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

       // console.log("file has been successfully uploaded on the cloudinary "+response.url)
        fs.unlinkSync(localFilePath) // deleting the file from the local storage 
        return response
    }
    catch(error){
        fs.unlinkSync(localFilePath)
    }
}


export const uploadOnCloudinary = async(files = [])=>{
    const uploadPromises =  files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            getBase64(file),
            {
              resource_type: "auto",
              public_id: uuid(),
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
        });
      });
    
      try {
        console.log("came here");
        const results = await Promise.all(uploadPromises);
        console.log("okk")
        const formattedResults = results.map((result) => ({
          public_id: result.public_id,
          secure_url: result.secure_url,
        }));
        return formattedResults;
      } catch (err) {
        console.log(err)
        throw new Error("Error uploading files to cloudinary", err);
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
    console.log(publicId)
    try{
        if(!publicId){
            return null;
        }

        const response = await cloudinary.uploader.destroy(publicId);

        return response; // return response from cloudinary
    }

    catch(err){
        console.log(err)
        console.error("error deleting file from cloudinary");
        throw err;
    }
};


