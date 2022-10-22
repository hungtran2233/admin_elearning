import { createSlice } from "@reduxjs/toolkit";
import { fetchCourseListAction } from "./courseAction";

const initialState = {
	courseList: null,
};

const courseSlice = createSlice({
	name: "course",
	initialState: initialState,
	reducers: {},

	extraReducers: (builder) => {
		// Course list
		builder.addCase(fetchCourseListAction.fulfilled, (state, action) => {
			state.courseList = action.payload;
		});
	},
});

export default courseSlice;
