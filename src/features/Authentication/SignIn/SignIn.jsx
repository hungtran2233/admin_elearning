import { Button, Checkbox, Form, Input } from "antd";
import instance from "api/instance";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { signInAction } from "../utils/authAction";

import "./SignIn.scss";
const SignIn = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onFinish = async (values) => {
		const data = await dispatch(signInAction(values));
		if (data.payload === undefined) {
			return;
		} else {
			Swal.fire({
				position: "center",
				icon: "success",
				title: "Đăng nhập thành công!",
				showConfirmButton: false,
				timer: 1500,
			});
			setTimeout(() => navigate("/admin"), 2000);
		}
	};

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
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
