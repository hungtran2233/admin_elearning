import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "api/instance";

// Get all course
export const fetchCourseListAction = createAsyncThunk(
	"course/fetchCourseList",
	async () => {
		try {
			const res = await instance.request({
				url: "/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc",
				method: "GET",
			});
			// console.log(res);
			return res.data;
		} catch (err) {
			console.log(err);
		}
	}
);
