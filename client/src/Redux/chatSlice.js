import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import {toast} from "react-hot-toast"
import axios from "axios";



const initialState = {
    messageWindow:false,
    messages:[], 
    currentChatDetail:  {},
    currentChatInfo:{}
}


export const getMyMessages = createAsyncThunk("chat/signup",async(chatId)=>{
    console.log(chatId)
    let result = []
    
    const res = axios.get(`api/v1/chats/message/${chatId}`)

    toast.promise(res,{
        loading:"wait loading your messages ",
        success:(data)=>{
            result = data?.data?.messages
            return data?.data?.message 
        }
    })

    await res;
    return result;
})


export const getChatDetails = createAsyncThunk("chat/getDetails", async(chatId)=>{
    let result = {}
    const res = axios.get(`api/v1/chats/${chatId}?populate=true`)

    toast.promise(res,{
        loading:"wait getting the chat details",
        success:(data)=>{
            result = data?.data?.chat 
            return data?.data?.message 
        }
    })

    await res;

    return result;

})

export const getChatInfo = createAsyncThunk("chat/info", async(chatId)=>{
    let result = {}
    const res = axios.get(`api/v1/chats/${chatId}?populate=false`)

    toast.promise(res,{
        loading:"wait getting the chat details",
        success:(data)=>{
            result = data?.data?.chat 
            return data?.data?.message 
        }
    })

    await res;

    return result;
})

export const sendMessages = createAsyncThunk("chat/send", async(data)=>{
    const res = axios.post("api/v1/chats/message",data)

    toast.promise(res,{
        loading:"wait sending your message ",
       
    })

    await res; 
})




const chatSlice = createSlice(
    {
        name:"chat",
        initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getMyMessages.fulfilled, (state,action)=>{
               // console.log(action.payload)
                state.messages = action.payload
                state.messageWindow = true ;
               // console.log(state.messages)
               // localStorage.getItem("messages", JSON.stringify("messages"))
            })

            builder.addCase(getChatDetails.fulfilled, (state,action)=>{
                state.currentChatDetail = action.payload
               console.log(action.payload) 
                }
             )

           builder.addCase(getChatInfo.fulfilled,(state,action)=>{
            state.currentChatInfo = action.payload
           })  
        }
    }
);


export const {} = chatSlice.actions
export default chatSlice.reducer;


