import { createSlice } from "@reduxjs/toolkit";
import {} from "features/Authentication/utils/autheSlice.js";
const autheSlice = createSlice({
  name: "authentication",
  initialState: {
    //Demo
    // movieList: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Demo
    // builder.addCase(fetchMovieListAction.fulfilled, (state, action) => {
    // 	state.movieList = action.payload;
    // });
  },
});
export default autheSlice;
