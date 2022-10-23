import React, { Fragment, useState } from "react";
import { Button, Modal, Spin, Table } from "antd";
import {
	AudioOutlined,
	CalendarOutlined,
	DeleteOutlined,
	EditOutlined,
} from "@ant-design/icons";
import { Input, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { fetchCourseListAction, removeCourseAction } from "../utils/courseAction";

const { Search } = Input;

function ManageCourse() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [courseList, setCourseList] = useState([]);

	const fetchCourseList = async () => {
		const data = await dispatch(fetchCourseListAction());
		setCourseList(data.payload);
	};

	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		fetchCourseList();
	}, []);

	// data for table
	if (!courseList) return <Spin size="large" />;
	const data = courseList;

	// remove course
	const removeCourse = (course) => {
		if (window.confirm("Bạn có muốn xóa khóa học: " + course.tenKhoaHoc)) {
			// soft remove
			const cloneArr = [...courseList];
			const index = cloneArr.findIndex(
				(item) => item.maKhoaHoc === course.maKhoaHoc
			);
			cloneArr.splice(index, 1);
			setCourseList(cloneArr);

			// hard remove
			dispatch(removeCourseAction(course.maKhoaHoc));
		}
	};

	const columns = [
		{
			title: "Mã khóa học",
			dataIndex: "maKhoaHoc",
			key: "maKhoaHoc",
			width: "10%",
			sorter: (a, b) => a.maPhim - b.maPhim,
			sortDirections: ["descend"],
		},
		{
			title: "Hình ảnh",
			dataIndex: "hinhAnh",
			key: "hinhAnh",
			width: "10%",
			render: (text, course, index) => {
				return (
					<Fragment>
						<img
							key={index}
							src={course.hinhAnh}
							width={100}
							height={80}
							style={{ border: "1px solid #cbcfd2" }}
							alt=""
							onError={(e) => (
								(e.target.onerror = null),
								(e.target.src = `https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled-1150x647.png`)
							)}
						/>
					</Fragment>
				);
			},
		},
		{
			title: "Tên khóa học",
			dataIndex: "tenKhoaHoc",
			key: "tenKhoaHoc",
			width: "20%",
			sorter: (a, b) => {
				let tenA = a.tenKhoaHoc.toLowerCase().trim();
				let tenB = b.tenKhoaHoc.toLowerCase().trim();
				if (tenA > tenB) {
					return 1;
				}
				return -1;
			},
			sortDirections: ["descend"],
			filteredValue: [searchText],
			onFilter: (value, course) => {
				return (
					String(course.tenKhoaHoc)
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					String(course.tenKhoaHoc).toLowerCase().includes(value.toLowerCase())
				);
			},
			render: (text, course) => {
				return (
					<Fragment>
						<div>{course.tenKhoaHoc}</div>
						<div style={{ marginTop: 20 }}>
							<Button
								onClick={() =>
									navigate("/admin/course/edit/" + course.maKhoaHoc)
								}
							>
								Chi tiết
							</Button>
						</div>
					</Fragment>
				);
			},
		},
		{
			title: "Mô tả",
			dataIndex: "moTa",
			key: "moTa",
			width: "20%",
			render: (text, course) => {
				return (
					<Fragment>
						{course.moTa.length > 100
							? course.moTa.substr(0, 100) + " ..."
							: course.moTa}
					</Fragment>
				);
			},
		},

		{
			title: "Danh mục",
			dataIndex: "danhMucKhoaHoc",
			key: "danhMucKhoaHoc",
			width: "10%",
			render: (text, course) => {
				return <Fragment>{course.danhMucKhoaHoc.tenDanhMucKhoaHoc}</Fragment>;
			},
		},

		{
			title: "Hành động",
			dataIndex: "hanhDong",
			key: "hanhDong",
			width: "15%",
			render: (text, course) => {
				return (
					<Fragment>
						<NavLink
							style={{ marginRight: 20 }}
							to={"/admin/course/edit/" + course.maKhoaHoc}
						>
							<EditOutlined style={{ fontSize: 25 }} title="Chỉnh sửa" />
						</NavLink>
						<span
							style={{ cursor: "pointer" }}
							onClick={() => removeCourse(course)}
						>
							<DeleteOutlined
								style={{ fontSize: 25, color: "red" }}
								title="Xóa"
							/>
						</span>
					</Fragment>
				);
			},
		},
	];

	return (
		<div className="EditMovie">
			<h1 className="title" style={{ fontSize: 25 }}>
				Danh sách khóa học
			</h1>

			<Search
				placeholder="Tìm kiếm..."
				allowClear
				// onSearch={(value) => {
				// 	setSearchText(value);
				// }}
				onChange={(e) => setSearchText(e.target.value.toString())}
				style={{
					width: 400,
					marginBottom: 20,
				}}
			/>
			<Table
				columns={columns}
				dataSource={data}
				rowKey="maKhoaHoc"
				pagination={{ defaultPageSize: 5 }}
			/>
		</div>
	);
}

export default ManageCourse;
