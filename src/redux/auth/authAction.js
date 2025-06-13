
import { signIn, signUp } from "@/api/auth";




const { createAsyncThunk } = require("@reduxjs/toolkit");

const login= createAsyncThunk("auth/login", async(data,{rejectWithValue})=>{
  
    try {
        const response = await signIn(data);
        localStorage.setItem("authToken",response.data?.token)
   
        return response.data
    } catch (error) {
       return rejectWithValue(error.response?.data)
    }

})
const userRegister= createAsyncThunk("auth/register", async(data,{rejectWithValue})=>{
    try {
        const response = await signUp(data);
        console.log(response.data);
        localStorage.setItem("authToken",response.data?.token)
        return response.data
    } catch (error) {
       return rejectWithValue(error.response?.data)
    }

})
export {login,userRegister}