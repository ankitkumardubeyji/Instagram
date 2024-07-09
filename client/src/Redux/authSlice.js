import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import {toast} from "react-hot-toast"
import axios from "axios";



const initialState = {
    data:JSON.parse(localStorage.getItem("data")) || {},
    isLoggedIn:localStorage.getItem("isLoggedIn") || false,
    
}

export const createAccount = createAsyncThunk("/auth/create",async(data)=>{
    let result = {}
    try{
        const res = axios.post("/api/v1/users/register",data)

        toast.promise(res,{
            loading:"wait creating your account!",
            success:(data)=>{
          
                result = data?.data?.data?.user 
                return data?.data?.message
            }
        })

        await res;
        return result 
    }
    catch(err){
        toast.error(err?.response?.data?.message)
    }
})

export const validateAccount = createAsyncThunk("auth/validate",async(data)=>{
   let result = {}
    try {
     const res = axios.post("/api/v1/users/login",data)
 
     toast.promise(res,{
         loading:"wait logging you",
         success:(data)=>{
            result = data?.data?.data?.user
             return data?.data?.message 
         }
         
     })
 
     await res; 
     return result
   } catch (error) {
    console.log(error?.response?.data?.message)
    toast.error(error?.response)
   }
})



export const logout = createAsyncThunk("auth/logout",async()=>{
    
})

const authSlice = createSlice(
    {
        name:"auth",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{

            builder.addCase(createAccount.fulfilled,(state,action)=>{
                state.data = action.payload
                localStorage.setItem("data",JSON.stringify(state.data))
            })

            builder.addCase(validateAccount.fulfilled,(state,action)=>{
                state.data = action.payload
                localStorage.setItem("data",JSON.stringify(state.data))
            })

          

        }
    }
);

export const {} = authSlice.actions
export default authSlice.reducer;