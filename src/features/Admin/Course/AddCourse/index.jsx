import {
	Button,
	Cascader,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Radio,
	Select,
	Switch,
	TreeSelect,
} from "antd";
import { useFormik } from "formik";
import * as yup from "yup";
import React, { useRef, useState } from "react";
import moment from "moment";
import { min } from "lodash";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { convertToSlug } from "common/convertToSlug";
import {
	addCourseAction,
	fetchCourseCategoryAction,
	fetchCreatorAction,
} from "../utils/courseAction";
import Swal from "sweetalert2";
import SunEditor from "suneditor-react";

const schema = yup.object({
	maKhoaHoc: yup.string().required("*Bạn chưa nhập mã khóa học !"),
	maDanhMucKhoaHoc: yup.string().required("*Bạn chưa chọn danh mục khóa học !"),
	taiKhoanNguoiTao: yup.string().required("*Bạn chưa chọn người tạo !"),
	tenKhoaHoc: yup.string().required("*Bạn chưa nhập tên khóa học !"),
	hinhAnh: yup.string().required("*Bạn chưa chọn hình ảnh !"),
	ngayTao: yup.string().required("*Bạn chưa chọn ngày tạo !"),
});

function AddCourse() {
	const [img, setImg] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// course category
	const [courseCategory, setCourseCategory] = useState([]);
	// creator
	const [creator, setCreator] = useState([]);

	// input slug
	const [slug, setSlug] = useState("");

	// get course category
	const fetchCourseCategory = async () => {
		const data = await dispatch(fetchCourseCategoryAction());
		setCourseCategory(data.payload);
	};

	// get creator
	const fetchCreator = async () => {
		const data = await dispatch(fetchCreatorAction());
		const arrGV = data.payload.filter((item) => item.maLoaiNguoiDung === "GV");
		setCreator(arrGV);
	};

	useEffect(() => {
		fetchCourseCategory();
		fetchCreator();
	}, []);

	// Validation Form
	const formik = useFormik({
		initialValues: {
			maKhoaHoc: "",
			biDanh: "",
			tenKhoaHoc: "",
			moTa: "",
			luotXem: 0,
			danhGia: 0,

			hinhAnh: {},
			ngayTao: "",

			maDanhMucKhoaHoc: "",
			taiKhoanNguoiTao: "",
		},
		onSubmit: (values) => {
			values.maNhom = "GP01";
			values.biDanh = slug;
			// console.log(values);
			// return;
			// 1) Create formData object
			let formData = new FormData();
			for (let key in values) {
				if (key !== "hinhAnh") {
					formData.append(key, values[key]);
				} else {
					// formData.append("custom name", object file, file name )
					formData.append("File", values.hinhAnh, values.hinhAnh.name);
				}
			}
			// get hinhAnh
			// console.log(formData.get("File").name);
			// console.log(formData.get("tenKhoaHoc"));

			// 2) Call api
			let choice = window.confirm("Bạn có muốn thêm khóa học này không ?");
			if (choice == true) {
				dispatch(addCourseAction(formData));
				setTimeout(navigate("/course/manage"), 2000);
			} else {
				return;
			}
		},

		validationSchema: schema,
	});

	// setting form antd
	const [componentSize, setComponentSize] = useState("default");
	const onFormLayoutChange = ({ size }) => {
		setComponentSize(size);
	};

	// change date picker
	const handleChangeDatePicker = (value) => {
		let date = moment(value).format("DD/MM/YYYY");
		formik.setFieldValue("ngayTao", date);
	};

	const handleChangeInputNumber = (name) => {
		return (value) => formik.setFieldValue(name, value);
	};

	// change image
	const handleChangeFile = (e) => {
		//1) get file from e
		let file = e.target.files[0];
		//2) create object to read file
		if (
			file.type === "image/jpg" ||
			file.type === "image/jpeg" ||
			file.type === "image/gif" ||
			file.type === "image/png"
		) {
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				setImg(e.target.result);
			};
			formik.setFieldValue("hinhAnh", file);
		}
	};

	if (courseCategory.length === 0) return <div>Loading...</div>;

	// ========= setting select course category ===========
	// convert select course category
	const convertSelectCourseCategory = () => {
		return courseCategory?.map((item, index) => {
			return {
				label: item.tenDanhMuc,
				value: item.maDanhMuc,
				key: index,
			};
		});
	};
	// get value select course category
	const handleChangeCourseCategory = (value) => {
		formik.setFieldValue("maDanhMucKhoaHoc", value);
	};
	// ========== END setting select course category ==========

	// ========= setting select Creator ===========
	// convert select Creator
	const convertSelectCreator = () => {
		return creator?.map((item, index) => {
			return {
				label: item.hoTen,
				value: item.taiKhoan,
				key: index,
			};
		});
	};
	// get value select Creator
	const handleChangeCreator = (value) => {
		//  Vì khi dùng thẻ select có mode="tags" , thì ta có thể dùng thêm được
		// chức năng tìm kiếm. Tuy nhiên, kết quả nó luôn trả về một mảng
		// Vậy nên ta chỉ lấy một giá trị đầu tiên trong mảng (vì api chỉ yêu cầu 1 giá trị)
		// console.log(value[0]);
		formik.setFieldValue("taiKhoanNguoiTao", value[0]);
	};
	// ========== end setting select course category ==========

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
				<h1 style={{ fontSize: 20, marginLeft: 50, marginBottom: 30 }}>
					Thêm khóa học mới
				</h1>
				<Form.Item label="Kích cỡ form" name="size">
					<Radio.Group>
						<Radio.Button value="small">Nhỏ</Radio.Button>
						<Radio.Button value="default">Bình thường</Radio.Button>
						<Radio.Button value="large">Lớn</Radio.Button>
					</Radio.Group>
				</Form.Item>

				<Form.Item label="Danh mục khóa học">
					<Select
						name="maDanhMucKhoaHoc"
						options={convertSelectCourseCategory()}
						placeholder="Chọn danh mục"
						onChange={handleChangeCourseCategory}
						onBlur={formik.handleBlur}
					></Select>
					{formik.touched.maRap && formik.errors.maRap && (
						<p style={{ color: "red", margin: 0 }}>{formik.errors.maRap}</p>
					)}
				</Form.Item>

				<Form.Item label="Người tạo">
					<Select
						name="taiKhoanNguoiTao"
						options={convertSelectCreator()}
						placeholder="Chọn người tạo"
						onChange={handleChangeCreator}
						mode="tags"
						onBlur={formik.handleBlur}
					></Select>
					{formik.touched.maRap && formik.errors.maRap && (
						<p style={{ color: "red", margin: 0 }}>{formik.errors.maRap}</p>
					)}
					<div style={{ marginTop: 10, color: "gray", fontStyle: "italic" }}>
						*Lưu ý: chỉ nên chọn một người tạo, hệ thống chỉ lấy một người đầu
						tiên
					</div>
				</Form.Item>

				<Form.Item label="Mã khóa học">
					<Input
						name="maKhoaHoc"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
					/>

					{formik.touched.maKhoaHoc && formik.errors.maKhoaHoc && (
						<p style={{ color: "red", margin: 0 }}>
							{formik.errors.maKhoaHoc}
						</p>
					)}
				</Form.Item>

				<Form.Item label="Tên khóa học">
					<Input
						name="tenKhoaHoc"
						onChange={formik.handleChange}
						onBlur={(e) => {
							formik.handleBlur(e);
							setSlug(convertToSlug(e.target.value.trim()));
						}}
					/>

					{formik.touched.tenKhoaHoc && formik.errors.tenKhoaHoc && (
						<p style={{ color: "red", margin: 0 }}>
							{formik.errors.tenKhoaHoc}
						</p>
					)}
				</Form.Item>

				<Form.Item label="Bí danh">
					<Input name="biDanh" value={slug} disabled />
					<div style={{ marginTop: 10, color: "gray", fontStyle: "italic" }}>
						*Lưu ý: bí danh sẽ dựa vào tên khóa học, không cần nhập vào!
					</div>
				</Form.Item>

				<Form.Item label="Mô tả">
					<SunEditor />
				</Form.Item>

				<Form.Item label="Lượt xem">
					<InputNumber
						onChange={handleChangeInputNumber("luotXem")}
						min={0}
						max={9999999}
					/>
				</Form.Item>

				<Form.Item label="Đánh giá">
					<InputNumber
						onChange={handleChangeInputNumber("danhGia")}
						min={0}
						max={10}
					/>
				</Form.Item>

				<Form.Item label="Hình ảnh">
					<input
						type="file"
						onChange={handleChangeFile}
						accept="image/png, image/jpeg,  image/jpg, image/gif"
						style={{ marginBottom: 20 }}
					/>

					<img
						style={{ width: 100, height: 140, objectFit: "cover" }}
						src={img}
						alt="..."
					/>
				</Form.Item>

				<Form.Item label="Ngày tạo">
					<DatePicker
						name="ngayTao"
						format={"DD/MM/YYYY"}
						onChange={handleChangeDatePicker}
						onBlur={formik.handleBlur}
						placeholder="Chọn ngày"
					/>
					{formik.touched.ngayTao && formik.errors.ngayTao && (
						<p style={{ color: "red", margin: 0 }}>{formik.errors.ngayTao}</p>
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
						Thêm khóa học
					</button>
					<button
						style={{ marginLeft: 20, cursor: "pointer" }}
						onClick={() => navigate("/course/manage")}
					>
						Trở về
					</button>
				</Form.Item>
			</Form>
		</div>
	);
}

export default AddCourse;
