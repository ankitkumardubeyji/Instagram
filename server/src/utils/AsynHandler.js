// takes the function as the input and executes it 
export const asyncHandler = (requestHandler) =>{
    return (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))


    }
}

// the above can be also perfromed using the high order function

/*

const asyncHandler = (fn) =>{
    async(req,res,next)=>{
        try{
            fn(req,res,next);
        }
        catch(err){
            res.status(err.status || 400).json({
                success:false,
                message:"sorry some error occured"
            })
        }
    }
}

*/
