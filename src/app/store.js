import { configureStore } from "@reduxjs/toolkit";
import courseSlice from "features/Admin/Course/utils/courseSlice";
import userSlice from "features/Admin/User/utils/userSlice";
import authSlice from "features/Authentication/utils/authSlice";

const store = configureStore({
	reducer: {
		course: courseSlice.reducer,
		auth: authSlice.reducer,
		user: userSlice.reducer,
	},
});
export default store;
