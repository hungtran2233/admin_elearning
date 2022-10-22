import React, { Fragment, useState } from "react";
import { Button, Spin, Table } from "antd";
import {
	AudioOutlined,
	CalendarOutlined,
	DeleteOutlined,
	EditOutlined,
} from "@ant-design/icons";
import { Input, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { fetchCourseListAction } from "../utils/courseAction";

const { Search } = Input;

function ManageCourse() {
	const dispatch = useDispatch();

	const fetchCourseList = () => {
		dispatch(fetchCourseListAction());
	};

	const courseList = useSelector((state) => state.course.courseList);

	const [searchText, setSearchText] = useState("");

	useEffect(() => {
		fetchCourseList();
	}, []);

	// remove course
	// const removeMovie = (film) => {
	// 	if (window.confirm("Bạn có muốn xóa phim " + film.tenPhim)) {
	// 		dispatch(removeMovieAction(film.maPhim));
	// 	}
	// };

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
			width: "15%",
			render: (text, course, index) => {
				return (
					<Fragment>
						<img
							key={index}
							src={course.hinhAnh}
							width={50}
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
			onFilter: (value, record) => {
				return (
					String(record.tenKhoaHoc)
						.toLowerCase()
						.includes(value.toLowerCase()) ||
					String(record.tenKhoaHoc).toLowerCase().includes(value.toLowerCase())
				);
			},
		},
		{
			title: "Mô tả",
			dataIndex: "moTa",
			key: "moTa",
			width: "40%",
			render: (text, course) => {
				return (
					<Fragment>
						{course.moTa.length > 50
							? course.moTa.substr(0, 50) + " ..."
							: course.moTa}
					</Fragment>
				);
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
							to={"/course/edit/" + course.maKhoaHoc}
						>
							<EditOutlined style={{ fontSize: 25 }} title="Chỉnh sửa" />
						</NavLink>
						<span style={{ cursor: "pointer" }}>
							<DeleteOutlined
								style={{ fontSize: 25, color: "red" }}
								title="Xóa"
							/>
						</span>

						{/* <NavLink
							style={{ marginLeft: 20 }}
							to={"/movies/showtime/" + course.maKhoaHoc}
						>
							<CalendarOutlined
								style={{ fontSize: 25 }}
								title="Thêm lịch chiếu"
							/>
						</NavLink> */}
					</Fragment>
				);
			},
		},
	];

	// data for table
	if (!courseList) return <Spin size="large" />;
	const data = courseList;

	return (
		<div className="EditMovie">
			<h1 className="title" style={{ fontSize: 20 }}>
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
			<Table columns={columns} dataSource={data} rowKey="maKhoaHoc" />
		</div>
	);
}

export default ManageCourse;
