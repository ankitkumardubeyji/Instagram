import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import {toast} from "react-hot-toast"
import axios from "axios";




let data;
try {
    const dataString = localStorage.getItem("data");
    data = dataString ? JSON.parse(dataString) : {};
} catch (error) {
    console.error("Error parsing data from localStorage:", error);
    data = {};
}


const initialState = {
    data:data,
    isLoggedIn:localStorage.getItem("isLoggedIn") || false,
    sUsers:[],
    sUserDetail:JSON.parse(localStorage.getItem("sUserDetail")),
    requests: JSON.parse(localStorage.getItem("requests")) || [],
    chats:JSON.parse(localStorage.getItem("chat")) || []
    
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
            },

            error:"Please give valid inputs"
          
        })

        await res;
        return result 
    }
    catch(error){
        console.log(error)
        //toast.error(error?.response?.data?.message)
        throw error;
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
         },
         error:"Invalid credentials"
         
     })
 
     await res; 
     return result
   } catch (error) {
    console.log(error)
   // toast.error(error?.response?.data?.message)
   throw error;
   }
})



export const searchUser = createAsyncThunk("auth/search", async(data)=>{
   let result = []
    try{
        console.log(data+" here comes the data ")
        const res = axios.get(`api/v1/users/search?fullName=${data}`)
        
        toast.promise(res,{
            loading:"searching user",
            success:(data)=>{
                console.log(data?.data?.users)
                result = data?.data?.users 
                console.log(result)

            }
        })

        await res;
    }
    catch(err){
        console.log(err)
    }
    return result;

})



export const logout = createAsyncThunk("auth/logout",async()=>{
    
})

export const getUserProfile = createAsyncThunk("/auth/profile",async(id)=>{
   
    let result = {}
    const res = axios.get(`api/v1/users/userProfile/${id}`)

    toast.promise(res,{
        loading:"wait fetching usern details",
        success:(data)=>{
            //console.log(data?.data?.data)
            result = data?.data?.data 
            return data?.data?.message 
        }
    })

    await res;

    return result;
 })



 export const sendFriendRequest = createAsyncThunk("auth/sendRequest",async(userId)=>{
    const res = axios.put("/api/v1/users/sendrequest",userId)

    toast.promise(res,{
        loading:"wait sending the request",
        success:(data)=>{
            console.log(data)
            return data?.data?.message
        }
    })

    await res;

 });


 export const getNotifications = createAsyncThunk("auth/notifications", async(data)=>{
    const res = axios.get("/api/v1/users/notifications");
    let result = [] 

    toast.promise(res,{
        loading:"wait fetching your notifications",
        success:(data)=>{
            result = data?.data?.allRequests
            return data?.data?.message 
        }
    })

    await res 
    return result;


 })


 export const acceptFriendRequest = createAsyncThunk("auth/accept",async(data)=>{
    const res = axios.put("/api/v1/users/acceptrequest",data)
    toast.promise(res,{
        loading:"wait accepting the follow request",
        success:(data)=>{
            console.log(data)
            return data?.data?.message 
        }
    })

    await res; 
 })


 export const rejectFriendRequest = createAsyncThunk("auth/accept",async(data)=>{
    const res = axios.put("/api/v1/users/acceptrequest",data)
    toast.promise(res,{
        loading:"wait rejecting the follow request",
        success:(data)=>{
            console.log(data)
            return data?.data?.message 
        }
    })

    await res; 
 })

export const getMyChats = createAsyncThunk("auth/mychats",async()=>{
    const res = axios.get("api/v1/chats/my")
    let result = []

    toast.promise(res,{
        loading:"wait getting your chats ",
        success:(data)=>{
            console.log(data?.data?.chats)
            result = data?.data?.chats
            return data?.data?.message 
        }
    })

    await res ; 

    return result 
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


            builder.addCase(searchUser.fulfilled, (state,action)=>{
            
                localStorage.setItem("sUsers",JSON.stringify(action.payload))
                state.sUsers = action.payload
              
            })

            builder.addCase(getUserProfile.fulfilled,(state,action)=>{
                localStorage.setItem("sUserDetail", JSON.stringify(action.payload))
                state.sUserDetail = action.payload;
            })

            builder.addCase(getNotifications.fulfilled,(state,action)=>{
                state.requests = action.payload
                localStorage.setItem("requests",JSON.stringify(action.payload))
            })

            builder.addCase(getMyChats.fulfilled, (state,action)=>{
                state.chats = action.payload;
                localStorage.setItem("chats", JSON.stringify(action.payload))
            })
        }
    }
);


export const {} = authSlice.actions
export default authSlice.reducer;

