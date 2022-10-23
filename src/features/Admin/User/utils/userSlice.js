import { createSlice } from "@reduxjs/toolkit";
import { fetchUsersListAction } from "./userAction";

const initialState = {
	userList: null,
};

const userSlice = createSlice({
	name: "user",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		// User list
		builder.addCase(fetchUsersListAction.fulfilled, (state, action) => {
			state.userList = action.payload;
		});
	},
});
export default userSlice;
