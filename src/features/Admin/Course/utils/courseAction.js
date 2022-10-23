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

// Add Course Upload Image
export const addCourseAction = createAsyncThunk("course/addCourse", async (formData) => {
	try {
		const res = await instance.request({
			url: "/api/QuanLyKhoaHoc/ThemKhoaHocUploadHinh",
			method: "POST",
			data: formData,
		});
		alert("Thêm khóa học thành công !");
		return res.data;
	} catch (err) {
		alert("Không thành công: " + err.response.data);
		console.log(err);
	}
});

// get Course Category
export const fetchCourseCategoryAction = createAsyncThunk(
	"course/fetchCourseCategory",
	async () => {
		try {
			const res = await instance.request({
				url: "/api/QuanLyKhoaHoc/LayDanhMucKhoaHoc",
				method: "GET",
			});

			// console.log(res.data);
			return res.data;
		} catch (err) {
			console.log(err);
		}
	}
);

// get Creator
export const fetchCreatorAction = createAsyncThunk("creator/fetchCreator", async () => {
	try {
		const res = await instance.request({
			url: "/api/QuanLyNguoiDung/TimKiemNguoiDung",
			method: "GET",
			params: {
				maNhom: "GP01",
			},
		});

		// console.log(res.data);
		return res.data;
	} catch (err) {
		console.log(err);
	}
});

// get 1 Course to edit
export const fetchCourseDetailAction = createAsyncThunk(
	"course/fetchCourseDetail",
	async (courseId) => {
		try {
			const res = await instance.request({
				url: "/api/QuanLyKhoaHoc/LayThongTinKhoaHoc",
				method: "GET",
				params: {
					maKhoaHoc: courseId,
				},
			});

			// console.log(res.data);
			return res.data;
		} catch (err) {
			console.log(err);
		}
	}
);

// update course
export const updateCourseAction = createAsyncThunk(
	"course/updateCourse",
	async (formData) => {
		try {
			const res = await instance.request({
				url: "/api/QuanLyKhoaHoc/CapNhatKhoaHocUpload",
				method: "POST",
				data: formData,
			});
			alert("Cập nhật khóa học thành công!");
			return res;
		} catch (err) {
			alert("Không thành công ! " + err.response.data);
			console.log(err);
		}
	}
);

// remove course
export const removeCourseAction = createAsyncThunk(
	"course/removeCourse",
	async (courseId) => {
		try {
			const res = await instance.request({
				url: "/api/QuanLyKhoaHoc/XoaKhoaHoc",
				method: "DELETE",
				params: {
					maKhoaHoc: courseId,
				},
			});
			alert("Xóa khóa học thành công!");
		} catch (err) {
			// console.log(err.response);
			alert("Xóa không thành công!" + " " + err.response.statusText);
		}
	}
);
