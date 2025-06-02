import {createSlice} from "@reduxjs/toolkit";
import { login, userRegister } from "./authAction";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null,
        error: null,
    },
    reducers: {  
      logout:(state)=>{
       state.user=null;
       if(typeof window !== undefined){
        localStorage.removeItem("authToken")
    }
      }
    },
    extraReducers: (builder) => 
        builder.addCase(login.pending,(state) => {
            state.loading = true;
            state.user = null;
            state.error = null;
        }).addCase(login.fulfilled,(state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = false;
        }).addCase(login.rejected,(state, action) => {
            state.error = action.payload;
            state.user = null;
            state.loading = false;
        }).addCase(userRegister.pending,(state) => {
            state.loading = true;
            state.user = null;
            state.error = null;
        }).addCase(userRegister.fulfilled,(state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = false;
        }).addCase(userRegister.rejected,(state, action) => {
            state.error = action.payload;
            state.user = null;
            state.loading = false;
        })
    }

)
export const  {logout} =authSlice.actions;
export default authSlice.reducer;