import { configureStore } from "@reduxjs/toolkit";
import courseSlice from "features/Admin/Course/utils/courseSlice";

const store = configureStore({
	reducer: {
		course: courseSlice.reducer,
	},
});
export default store;
