const { combineReducers } = require("@reduxjs/toolkit");
import authReducer from "./auth/authSlice"
import lockSlice from "./auth/lockSlice"

const rootReducer= combineReducers({
   auth:authReducer,
   lock:lockSlice,
      
})

export default rootReducer