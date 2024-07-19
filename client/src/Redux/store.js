import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../Redux/authSlice"
import chatSliceReducer from "../Redux/chatSlice"





const store = configureStore({
    reducer:{
        auth:authSliceReducer,
        chat:chatSliceReducer,  
    }
})


export default store;
