import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/AsynHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const publishPost = asyncHandler(async(req,res)=>{
    
    const {caption} = req.body;
    console.log(req.body)

    
    const files = req.files || [];
    const attachments = await uploadOnCloudinary(files);

    

   
    console.log("yha tak kam hua hai")
    const newPost = await Post.create({
        caption,
        posts:attachments,
        isPublished:true,
        owner:req.user?._id, 
    })

    console.log(newPost)
    const publishedPost = await Post.findById(newPost?._id)

    return res.status(200)
    .json(new ApiResponse(200,publishedPost,"Post got uploaded successfully"))
})


export const getAllPosts = asyncHandler(async(req,res)=>{
   
   // checking if any of the below has been passed by the user as query params otherwise assigning the below with the default values  
    let {page=1,limit=12,query,sortBy,sortType,userId} = req.query;

    // parsing the page and the limit
    page = parseInt(page,10); // here 10 denotes the decimal 
    limit = parseInt(limit); 

    // validating the page and the limit values
    page = Math.max(1,page); // ensuring the page is atleast 1
    limit = Math.min(20,Math.max(1,limit)); // ensuring the limit is between 1 and 10

    const pipeline = [];

    // match songs by song userId if provided
    if(userId){
        if(!isValidObjectId(userId)){
            throw new ApiError(400,"userId is invalid")
        }

        pipeline.push({
            // filtering forthe songs that has userId as the owner 
            $match:{
                owner: new mongoose.Types.ObjectId(userId),
            }
        });
    }

        // Match the songs based on the search query passed by the user
        if(query){
            pipeline.push({
       // filtering all the song docs whose title or description matches with the provided text         
                $match:{
                    $text:{
                        $search:query 
                    }
                }
            });
        }

        // sorting the pipeline based on the sortBy and sortType

        const sortCriteria = {};
        if(sortBy && sortType){
            sortCriteria[sortBy] = sortType === "asc" ? 1 :"-1";
            pipeline.push({
                $sort:sortCriteria 
            })
        }

        // sorting in descending order based on createdAt time ie the song uploaded latest will  be at the top 
        else{
            sortCriteria["createdAt"] =-1;
            pipeline.push({
                $sort:sortCriteria 
            })
        }

        // Applying pagination using the skip and limit
        pipeline.push({
            $skip:(page-1)*limit
        });

        pipeline.push({
            $limit:limit 
        });

        pipeline.push({
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $project:{
                            fullName:1,
                            _id:0
                           
                        }
                    }
                ]
            },
        })

        pipeline.push({
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        })

        pipeline.push({
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"post",
                as:"comments",
                pipeline:[
                    {
                        $project:{
                            content:1,
                            _id:0,
                            createdAt:1,  
                            owner:1
                           
                        }
                    }

                

                    
                ]
            },
        })

     

        

    
        // executing the aggregation pipeline
        const posts = await Post.aggregate(pipeline)
            posts.map((post)=>{
                post.owner = post.owner.fullName
            })
        if(!posts || posts.length === 0){
            throw new ApiError(404,"posts not found ");
        }

        return res.status(200)
        .json(new ApiResponse(200,posts,"posts fetched successfully"));


    });
