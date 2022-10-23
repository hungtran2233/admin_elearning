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
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { convertToSlug } from "common/convertToSlug";
import {
	addCourseAction,
	fetchCourseCategoryAction,
	fetchCourseDetailAction,
	fetchCreatorAction,
	updateCourseAction,
} from "../utils/courseAction";
import Swal from "sweetalert2";
import SunEditor from "suneditor-react";
const { TextArea } = Input;

const schema = yup.object({
	maKhoaHoc: yup.string().required("*Bạn chưa nhập mã khóa học !"),
	maDanhMucKhoaHoc: yup.string().required("*Bạn chưa chọn danh mục khóa học !"),
	taiKhoanNguoiTao: yup.string().required("*Bạn chưa chọn người tạo !"),
	tenKhoaHoc: yup.string().required("*Bạn chưa nhập tên khóa học !"),
	hinhAnh: yup.string().required("*Bạn chưa chọn hình ảnh !"),
	ngayTao: yup.string().required("*Bạn chưa chọn ngày tạo !"),
});

function EditCourse() {
	const [img, setImg] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// get courseId from url
	const match = useLocation();
	const index = match.pathname.lastIndexOf("/");
	const courseId = match.pathname.slice(index + 1, match.pathname.length);

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

	// get course detail
	const fetchCourseDetail = async () => {
		const data = await dispatch(fetchCourseDetailAction(courseId));
		setSlug(data.payload.biDanh);
	};

	useEffect(() => {
		fetchCourseDetail();
		fetchCourseCategory();
		fetchCreator();
	}, []);

	const courseDetail = useSelector((state) => state.course.courseDetail);
	// console.log(courseDetail);

	// Validation Form
	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			maKhoaHoc: courseDetail?.maKhoaHoc,
			biDanh: courseDetail?.biDanh,
			tenKhoaHoc: courseDetail?.tenKhoaHoc,
			moTa: courseDetail?.moTa,
			luotXem: courseDetail?.luotXem,
			danhGia: 0,

			hinhAnh: null,
			ngayTao: courseDetail?.ngayTao,

			maDanhMucKhoaHoc: courseDetail?.danhMucKhoaHoc.tenDanhMucKhoaHoc,
			taiKhoanNguoiTao: courseDetail?.nguoiTao.hoTen,
		},
		onSubmit: (values) => {
			values.maNhom = "GP01";
			values.biDanh = slug;
			values.danhGia = 0;
			console.log(values);
			// return;
			// 1) Create formData object
			let formData = new FormData();
			for (let key in values) {
				if (key !== "hinhAnh") {
					formData.append(key, values[key]);
				} else {
					// formData.append("custom name", object file, file name )
					if (values.hinhAnh !== null) {
						formData.append("File", values.hinhAnh, values.hinhAnh.name);
					}
				}
			}
			// get hinhAnh
			// console.log(formData.get("File").name);
			// console.log(formData.get("tenKhoaHoc"));
			// return;

			// 2) Call api
			dispatch(updateCourseAction(formData));
		},

		// validationSchema: schema,
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
	const handleChangeFile = async (e) => {
		//1) get file from e
		let file = e.target.files[0];
		//2) create object to read file
		if (
			file.type === "image/jpg" ||
			file.type === "image/jpeg" ||
			file.type === "image/gif" ||
			file.type === "image/png"
		) {
			// Save file data to formik. Notice: setFieldValue is async func
			await formik.setFieldValue("hinhAnh", file);
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				setImg(e.target.result);
			};
		}
	};

	// waiting data
	if (courseCategory.length === 0) return <div>Loading...</div>;
	if (creator.length === 0) return <div>Loading...</div>;
	if (!courseDetail) return <div>Loading...</div>;

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
		formik.setFieldValue("taiKhoanNguoiTao", value);
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
				<h1 style={{ fontSize: 25, marginLeft: 10, marginBottom: 30 }}>
					Chỉnh sửa khóa học
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
						value={formik.values.maDanhMucKhoaHoc}
					></Select>
					{formik.touched.maDanhMucKhoaHoc &&
						formik.errors.maDanhMucKhoaHoc && (
							<p style={{ color: "red", margin: 0 }}>
								{formik.errors.maDanhMucKhoaHoc}
							</p>
						)}
				</Form.Item>

				<Form.Item label="Người tạo">
					<Select
						name="taiKhoanNguoiTao"
						options={convertSelectCreator()}
						placeholder="Chọn người tạo"
						onChange={handleChangeCreator}
						onBlur={formik.handleBlur}
						value={formik.values.taiKhoanNguoiTao}
					></Select>
					{formik.touched.taiKhoanNguoiTao &&
						formik.errors.taiKhoanNguoiTao && (
							<p style={{ color: "red", margin: 0 }}>
								{formik.errors.taiKhoanNguoiTao}
							</p>
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
						value={formik.values.maKhoaHoc}
						disabled
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
						value={formik.values.tenKhoaHoc}
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

				{/* <Form.Item label="Mô tả">
					<SunEditor name="moTa" setContents={formik.values.moTa} />
				</Form.Item> */}
				<Form.Item label="Mô tả">
					<TextArea
						rows={8}
						placeholder="Nhập mô tả..."
						name="moTa"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.moTa}
					/>
				</Form.Item>

				<Form.Item label="Lượt xem">
					<InputNumber
						onChange={handleChangeInputNumber("luotXem")}
						min={0}
						max={9999999}
						value={formik.values.luotXem}
					/>
				</Form.Item>

				<Form.Item label="Đánh giá">
					<InputNumber
						onChange={handleChangeInputNumber("danhGia")}
						min={0}
						max={10}
						value={formik.values.danhGia}
					/>
				</Form.Item>

				<Form.Item label="Hình ảnh">
					<input
						type="file"
						onChange={handleChangeFile}
						style={{ marginBottom: 20 }}
					/>

					<img
						style={{ width: 100, height: 140, objectFit: "cover" }}
						src={img === "" ? courseDetail.hinhAnh : img}
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
						// value={moment(formik.values.ngayTao)}
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
						Cập nhật khóa học
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

export default EditCourse;
