const { configureStore } = require("@reduxjs/toolkit");
import { PERSIST, persistReducer, persistStore } from "redux-persist";
import storage from 'redux-persist/lib/storage'
import rootReducer from "./rootReducer";
const persistConfig = {
  key: 'root',
  storage,
  whitelist:["auth","lock"]
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
  reducer:persistedReducer,
  middleware: (getDefaultMiddleWare) => {
    return getDefaultMiddleWare({
      serializableCheck: {
        ignoreActions: [PERSIST],
      },
    });
  },
})
const persistor = persistStore(store)
export  {store,persistor};