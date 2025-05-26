import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

// Redux Persist Configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "content"], // Specify which reducers should be persisted
};

// Combine All Reducers
const rootReducer = combineReducers({
});

// Apply Persist Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Redux Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for Redux Persist
    }),
});

const persistor = persistStore(store);

export { persistor };
export default store;