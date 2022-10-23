import { Form, Input, Radio, Select } from "antd";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUserAction } from "../../utils/userAction";
import * as yup from "yup";
const { Option } = Select;

const schema = yup.object({
	taiKhoan: yup
		.string()
		.required("*Trường này bắt buộc nhập !")
		.min(6, "*Tài khoản tối thiểu 6 kí tự"),
	matKhau: yup
		.string()
		.required("*Trường này bắt buộc nhập !")
		.min(6, "*Mật khẩu phải từ 6 đến 14 kí tự"),
	hoTen: yup
		.string()
		.required("*Trường này bắt buộc nhập !")
		.matches(/^[A-Za-z ]+$/g, "*Họ tên không đúng"),
	email: yup
		.string()
		.required("*Trường này bắt buộc nhập !")
		.email("*Email không đúng định dạng"),
	soDt: yup.string().required("*Trường này bắt buộc nhập !"),
});

function AddUser() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [typeUser, setTypeUser] = useState("");

	const formik = useFormik({
		initialValues: {
			taiKhoan: "",
			matKhau: "",
			hoTen: "",
			email: "",
			soDT: "",
			maLoaiNguoiDung: "",
		},

		onSubmit: (user) => {
			const newUser = { ...user, maNhom: "GP01", maLoaiNguoiDung: typeUser };
			// console.log(newUser);
			dispatch(addUserAction(newUser));
		},

		validationSchema: schema,
	});

	// setting form antd
	const [componentSize, setComponentSize] = useState("default");
	const onFormLayoutChange = ({ size }) => {
		setComponentSize(size);
	};

	const handleChange = (value) => {
		setTypeUser(value);
	};

	return (
		<div>
			<Form
				onSubmitCapture={formik.handleSubmit}
				labelCol={{
					span: 4,
				}}
				wrapperCol={{
					span: 14,
				}}
				layout="horizontal"
				initialValues={{
					size: componentSize,
				}}
				onValuesChange={onFormLayoutChange}
				size={componentSize}
			>
				<h1 style={{ fontSize: 25, marginLeft: 10, marginBottom: 30 }}>
					Thêm người dùng mới
				</h1>
				<Form.Item label="Kích cỡ form" name="size">
					<Radio.Group>
						<Radio.Button value="small">Nhỏ</Radio.Button>
						<Radio.Button value="default">Bình thường</Radio.Button>
						<Radio.Button value="large">Lớn</Radio.Button>
					</Radio.Group>
				</Form.Item>

				<Form.Item label="Tài khoản">
					<Input
						name="taiKhoan"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>

					{formik.touched.taiKhoan && formik.errors.taiKhoan && (
						<p style={{ color: "red", margin: 0 }}>
							{formik.errors.taiKhoan}
						</p>
					)}
				</Form.Item>

				<Form.Item label="Mật khẩu">
					<Input
						name="matKhau"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>

					{formik.touched.matKhau && formik.errors.matKhau && (
						<p style={{ color: "red", margin: 0 }}>{formik.errors.matKhau}</p>
					)}
				</Form.Item>

				<Form.Item label="Họ tên">
					<Input
						name="hoTen"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>

					{formik.touched.hoTen && formik.errors.hoTen && (
						<p style={{ color: "red", margin: 0 }}>{formik.errors.hoTen}</p>
					)}
				</Form.Item>

				<Form.Item label="Email">
					<Input
						name="email"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>

					{formik.touched.email && formik.errors.email && (
						<p style={{ color: "red", margin: 0 }}>{formik.errors.email}</p>
					)}
				</Form.Item>

				<Form.Item label="Số điện thoại">
					<Input
						name="soDT"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>

					{formik.touched.soDT && formik.errors.soDT && (
						<p style={{ color: "red", margin: 0 }}>{formik.errors.soDT}</p>
					)}
				</Form.Item>

				<Form.Item label="Loại người dùng">
					<Select
						placeholder="Chọn loại người dùng"
						name="maLoaiNguoiDung"
						style={{
							width: 180,
						}}
						onChange={handleChange}
						onBlur={formik.handleBlur}
					>
						<Option value="GV">Giáo Vụ</Option>
						<Option value="HV">Học Viên</Option>
					</Select>
					{formik.touched.maLoaiNguoiDung && formik.errors.maLoaiNguoiDung && (
						<p style={{ color: "red", margin: 0 }}>
							{formik.errors.maLoaiNguoiDung}
						</p>
					)}
				</Form.Item>

				<Form.Item label="Hành động">
					<button
						type="submit"
						style={{
							cursor: "pointer",
							background: "#3498db",
							border: "none",
							padding: "5px 10px",
							color: "#fff",
						}}
					>
						Thêm người dùng
					</button>
					<button
						style={{ marginLeft: 20, cursor: "pointer" }}
						onClick={() => navigate("/admin/user")}
					>
						Trở về
					</button>
				</Form.Item>
			</Form>
		</div>
	);
}

export default AddUser;
