import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "api/instance";

// get movie list
export const fetchMovieListAction = createAsyncThunk(
  "hone/fetchMovieList",
  async () => {
    try {
      const res = instance.request({
        url: "/api/QuanLyPhim/LayDanhSachPhim",
        method: "GET",
        params: {
          maNhom: "GP03",
        },
      });
      // console.log((await res).data.content);
      return (await res).data.content;
    } catch (err) {
      console.log(err);
    }
  }
);

// Create movie
export const createMovieAction = createAsyncThunk(
  "admin/createMovie",
  async (formData) => {
    try {
      const res = await instance.request({
        url: "/api/QuanLyPhim/ThemPhimUploadHinh",
        method: "POST",
        data: formData,
      });
      alert("Thêm phim thành công !");
      // console.log(res.data.content);
      return res.data.content;
    } catch (err) {
      alert("Không thành công: " + err.response.data.content);
      console.log(err.response.data.content);
    }
  }
);

// get 1 movie to edit
export const fetchMovieDetailAction = createAsyncThunk(
  "admin/fetchMovieDetail",
  async (movieId) => {
    try {
      const res = await instance.request({
        url: "/api/QuanLyPhim/LayThongTinPhim",
        method: "GET",
        params: {
          maPhim: movieId,
        },
      });

      // console.log(res.data.content);
      return res.data.content;
    } catch (err) {
      console.log(err);
    }
  }
);

// Update movie
export const updateMovieAction = createAsyncThunk(
  "admin/updateMovie",
  async (formData) => {
    try {
      const res = await instance.request({
        url: "/api/QuanLyPhim/CapNhatPhimUpload",
        method: "POST",
        data: formData,
      });
      alert("Cập nhật phim thành công!");
    } catch (err) {
      if (err.response.status === 401) {
        alert("Không thành công ! Vui lòng đăng nhập! ");
      }
      if (err.response.status === 500) {
        alert(
          "Không thành công ! " +
            err.response.data.message +
            " : " +
            err.response.data.content
        );
      }

      console.log(err);
    }
  }
);

// remove movie
export const removeMovieAction = createAsyncThunk(
  "admin/removeMovie",
  async (movieId) => {
    try {
      const res = await instance.request({
        url: "/api/QuanLyPhim/XoaPhim",
        method: "DELETE",
        params: {
          maPhim: movieId,
        },
      });
      alert("Xóa phim thành công!");
    } catch (err) {
      alert("Không thành công: " + err.response.data.content);
      console.log(err);
    }
  }
);

// Get cinemas group (LayThongTinHeThongRap)
export const fetchCinemasGroupAction = createAsyncThunk(
  "admin/fetchCinemasGroup",
  async () => {
    try {
      const res = await instance.request({
        url: "/api/QuanLyRap/LayThongTinHeThongRap",
        method: "GET",
      });
      // console.log(res.data.content);
      return res.data.content;
    } catch (err) {
      console.log(err);
    }
  }
);

// Get cinemas (LayThongTinCumRapTheoHeThong)
export const fetchCinemasAction = createAsyncThunk(
  "admin/fetchCinemas",
  async (cinemasId) => {
    try {
      const res = await instance.request({
        url: "/api/QuanLyRap/LayThongTinCumRapTheoHeThong",
        method: "GET",
        params: {
          maHeThongRap: cinemasId,
        },
      });
      // console.log(res.data.content);
      return res.data.content;
    } catch (err) {
      console.log(err);
    }
  }
);

// Create movie schedule
export const createMovieScheduleAction = createAsyncThunk(
  "admin/createMovieSchedule",
  async (movieSchedule) => {
    try {
      const res = await instance.request({
        url: "/api/QuanLyDatVe/TaoLichChieu",
        method: "POST",
        data: movieSchedule,
      });

      // console.log(res.data.content);
    } catch (err) {
      console.log(err);
    }
  }
);

//Get ListUsers
export const fetchUsersListAction = createAsyncThunk(
  "admin/fetchUsersList",
  async () => {
    try {
      const res = await instance.request({
        url: "/api/QuanLyNguoiDung/LayDanhSachNguoiDung",
        method: "GET",
        params: {
          MaNhom: "GP01",
        },
      });
	  return (await res).data.content
    } catch (error) {
      console.log(error);
    }
  }
);
