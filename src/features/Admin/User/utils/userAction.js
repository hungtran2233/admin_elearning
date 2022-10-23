import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "api/instance";

//Get ListUsers
export const fetchUsersListAction = createAsyncThunk("admin/fetchUsersList", async () => {
	try {
		const res = await instance.request({
			url: "/api/QuanLyNguoiDung/LayDanhSachNguoiDung",
			method: "GET",
			params: {
				MaNhom: "GP01",
			},
		});
		// console.log(res.data);
		return res.data;
	} catch (error) {
		console.log(error);
	}
});

// add user
export const addUserAction = createAsyncThunk("user/addUser", async (user) => {
	try {
		const res = await instance.request({
			url: "/api/QuanLyNguoiDung/ThemNguoiDung",
			method: "POST",
			data: user,
		});
		alert("Thêm người dùng thành công!");
	} catch (err) {
		// console.log(err.response);
		alert("Không thành công! \nTài khoản hoặc email đã tồn tại!");
	}
});

// remove user
export const removeUserAction = createAsyncThunk("user/removeUser", async (userId) => {
	try {
		const res = await instance.request({
			url: "/api/QuanLyNguoiDung/XoaNguoiDung",
			method: "DELETE",
			params: {
				TaiKhoan: userId,
			},
		});
		alert("Xóa người dùng thành công!");
	} catch (err) {
		// console.log(err.response);
		alert("Xóa không thành công!" + " " + err.response.statusText);
	}
});
