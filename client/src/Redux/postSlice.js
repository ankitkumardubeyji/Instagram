import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axios from "axios";

const initialState = {
  posts: JSON.parse(localStorage.getItem("posts")) || []
};

export const uploadPost = createAsyncThunk("post/create", async (data) => {
  const res = axios.post("/api/v1/posts/upload/post", data);

  toast.promise(res, {
    loading: 'wait uploading your post',
    success: (data) => {
      return data?.data?.message;
    },
    error: "some error happened try again!"
  });

  await res; 
});

export const getPosts = createAsyncThunk("post/getpost", async()=>{
    let result = []
    const res = axios.get("/api/v1/posts")

    toast.promise(res,{
        loading:"wait getting the post details",
        success:(data)=>{
            result = data?.data?.data
            localStorage.setItem("posts",JSON.stringify(result))
            return data?.data?.message 
        }
    })

    await res;

    return result;
})


const postSlice = createSlice(
    {
        name:"post",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{

            builder.addCase(getPosts.fulfilled,(state,action)=>{
                console.log("hine")
                state.posts = action.payload
                localStorage.setItem("posts",JSON.stringify(state.posts))
            })

            
        }
    }
);


export const {} = postSlice.actions;
export default postSlice.reducer;
