import { Button, Checkbox, Form, Input } from "antd";
import instance from "api/instance";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SignIn.scss";
const SignIn = ({ setGetUser }) => {
	const navigate = useNavigate();
	const onFinish = (values) => {
		fetchUsers(values);
		console.log("Success:", values);
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	const fetchUsers = async (acount) => {
		try {
			const res = await instance.request({
				url: "/api/QuanLyNguoiDung/DangNhap",
				method: "POST",
				data: acount,
			});
			console.log(res);
			if (res.data.maLoaiNguoiDung === "GV") {
				localStorage.setItem("token", res.data.accessToken);
				delete res.data.content.accessToken;
				setGetUser(res.data.content);
				navigate("/users");
				return;
			}
			return alert("Bạn Không Đủ Quyền Truy Cập");
		} catch (error) {
			alert("Sai Tên Tài Khoản Hoặc Mật Khẩu");
		}
	};

	return (
		<div className="signIn">
			<Form
				name="basic"
				labelCol={{
					span: 8,
				}}
				wrapperCol={{
					span: 16,
				}}
				initialValues={{
					remember: true,
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<h1
					style={{
						color: "#fff",
						textAlign: "center",
						marginBottom: 40,
					}}
				>
					Đăng nhập
				</h1>
				<Form.Item
					label="Tài Khoản"
					name="taiKhoan"
					rules={[
						{
							required: true,
							message: "Please input your username!",
						},
					]}
				>
					<Input style={{ marginLeft: 2 }} />
				</Form.Item>

				<Form.Item
					label="Mật Khẩu"
					name="matKhau"
					rules={[
						{
							required: true,
							message: "Please input your password!",
						},
					]}
				>
					<Input.Password style={{ marginLeft: 2 }} />
				</Form.Item>

				<Form.Item
					name="remember"
					valuePropName="checked"
					wrapperCol={{
						offset: 8,
						span: 16,
					}}
				>
					<Checkbox>Remember me</Checkbox>
				</Form.Item>

				<Form.Item
					wrapperCol={{
						offset: 8,
						span: 16,
					}}
				>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default SignIn;
