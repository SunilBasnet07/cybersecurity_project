import {createSlice} from "@reduxjs/toolkit";
import { login } from "./authAction";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null,
        error: null,
    },
    reducer: {

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
        })
    }

)
export default authSlice.reducer;