import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Input, Table } from "antd";
import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { fetchUsersListAction, removeUserAction } from "./utils/userAction";
const { Search } = Input;

function User() {
	const dispatch = useDispatch();
	const [userList, setUserList] = useState([]);
	const navigate = useNavigate();

	const fetchUserList = async () => {
		const data = await dispatch(fetchUsersListAction());
		setUserList(data.payload);
	};
	useEffect(() => {
		fetchUserList();
	}, []);

	// remove course
	const removeUser = (user) => {
		if (window.confirm("Bạn có muốn xóa người dùng : " + user.hoTen)) {
			// soft remove
			const cloneArr = [...userList];
			const index = cloneArr.findIndex((item) => item.taiKhoan === user.taiKhoan);
			cloneArr.splice(index, 1);
			setUserList(cloneArr);

			// hard remove
			dispatch(removeUserAction(user.taiKhoan));
		}
	};

	// search
	const [searchText, setSearchText] = useState("");

	if (!userList) return <div>Đang tải...</div>;
	const data = userList;
	const columns = [
		{
			title: "Tài khoản",
			dataIndex: "taiKhoan",
			key: "taiKhoan",
			width: "15%",
			sorter: (a, b) => a.taiKhoan - b.taiKhoan,
			sortDirections: ["descend"],
		},
		{
			title: "Họ tên",
			dataIndex: "hoTen",
			key: "hoTen",
			width: "15%",
			sorter: (a, b) => {
				let tenA = a.hoTen.toLowerCase().trim();
				let tenB = b.hoTen.toLowerCase().trim();
				if (tenA > tenB) {
					return 1;
				}
				return -1;
			},

			sortDirections: ["descend"],
			filteredValue: [searchText],
			onFilter: (value, user) => {
				return (
					String(user.hoTen).toLowerCase().includes(value.toLowerCase()) ||
					String(user.hoTen).toLowerCase().includes(value.toLowerCase())
				);
			},
		},

		{
			title: "Mã loại người dùng",
			dataIndex: "maLoaiNguoiDung",
			key: "maLoaiNguoiDung",
			width: "15%",
			filters: [
				{
					text: "GV",
					value: "GV",
				},
				{
					text: "HV",
					value: "HV",
				},
			],
			onFilter: (value, record) => record.maLoaiNguoiDung.indexOf(value) === 0,
		},

		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			width: "15%",
			sorter: (a, b) => a.email - b.email,
			sortDirections: ["descend"],
		},
		{
			title: "Số điện thoại",
			dataIndex: "soDt",
			key: "soDt",
			width: "15%",
		},

		{
			title: "Hành động",
			dataIndex: "hanhDong",
			key: "hanhDong",
			width: "15%",
			render: (text, user) => {
				return (
					<Fragment>
						<NavLink
							style={{ marginRight: 20 }}
							to={"/admin/course/edit/" + user.maKhoaHoc}
						>
							<EditOutlined style={{ fontSize: 25 }} title="Chỉnh sửa" />
						</NavLink>
						<span
							style={{ cursor: "pointer" }}
							onClick={() => removeUser(user)}
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
		<div>
			<h1 className="title" style={{ fontSize: 25 }}>
				Danh sách người dùng
			</h1>

			<Search
				placeholder="Tìm kiếm..."
				allowClear
				onChange={(e) => setSearchText(e.target.value.toString())}
				style={{
					width: 400,
					marginBottom: 20,
				}}
			/>

			<Button
				type="primary"
				style={{ marginLeft: 100 }}
				onClick={() => navigate("/admin/user/add")}
			>
				Thêm người dùng
			</Button>

			<Table
				columns={columns}
				dataSource={data}
				rowKey="taiKhoan"
				pagination={{ defaultPageSize: 20 }}
			/>
		</div>
	);
}

export default User;
