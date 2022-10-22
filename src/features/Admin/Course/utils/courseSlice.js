import { createSlice } from "@reduxjs/toolkit";
import { fetchCourseDetailAction, fetchCourseListAction } from "./courseAction";

const initialState = {
	courseList: null,
	courseDetail: null,
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

		// Course detail
		builder.addCase(fetchCourseDetailAction.fulfilled, (state, action) => {
			state.courseDetail = action.payload;
		});
	},
});

export default courseSlice;
