import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "api/instance";

// Sign in
export const signInAction = createAsyncThunk("auth/signIn", async (user) => {
	try {
		const res = await instance.request({
			url: "/api/QuanLyNguoiDung/DangNhap",
			method: "POST",
			data: user,
		});
		// console.log(res);
		if (res.data.maLoaiNguoiDung === "GV") {
			const profile = { ...res.data };
			delete profile.accessToken;
			localStorage.setItem("token", res.data.accessToken);
			return profile;
		} else {
			alert(
				"Bạn không đủ quyền truy cập ! \nChỉ có tài khoản GV mới được quyền truy cập!"
			);
		}
	} catch (err) {
		alert("Không thành công! " + err.response.data);
		console.log(err);
	}
});

// Profile
export const fetchProfileAction = createAsyncThunk("auth/fetchProfile", async () => {
	try {
		const res = await instance.request({
			url: "/api/QuanLyNguoiDung/ThongTinNguoiDung",
			method: "POST",
		});

		return res.data;
	} catch (err) {
		// console.log("Chua dang nhap");
	}
});
