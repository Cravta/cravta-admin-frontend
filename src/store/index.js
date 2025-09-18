import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/authSlice";
import userSlice from "./auth/userSlice";
import adminUsersReducer from './admin/usersSlice';
import adminClassesReducer from './admin/classesSlice';
import adminContentReducer from './admin/contentSlice';
import adminQuizReducer from './admin/quizSlice';
import blogReducer from './admin/blogSlice';
import adminAuthReducer from './auth/adminAuthSlice';
import adminTeamReducer from './auth/adminUsersSlice';
import adminHelpReducer from './admin/helpSlice';
import roleReducer from './admin/roleSlice';
import dashboardReducer from './admin/dashboardSlice';
import packagesReducer from './admin/packageSlice';
import productReducer from './admin/market/productSlice'
import salesReducer from './admin/market/salesSlice'
import enterpriseReducer from './admin/enterpriseSlice'
import promocodeReducer from './admin/promoCodesSlice'
// Redux Persist Configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "content"], // Specify which reducers should be persisted
};

// Combine All Reducers
const rootReducer = combineReducers({
  auth: adminAuthReducer,
  user: userSlice,
  blogs: blogReducer,
  role: roleReducer,
  team: adminTeamReducer,
  adminUsers: adminUsersReducer,
  adminClasses: adminClassesReducer,
  adminContent: adminContentReducer,
  adminQuiz: adminQuizReducer,
  help: adminHelpReducer,
  dashboard: dashboardReducer,
  package: packagesReducer,
  product: productReducer,
  sales: salesReducer,
  adminEnterprise:enterpriseReducer,
  adminPromoCodes:promocodeReducer,
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