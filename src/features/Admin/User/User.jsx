import {
	Form,
	Input,
	InputNumber,
	Popconfirm,
	Table,
	Typography,
	Button,
	Space,
	Spin,
} from "antd";
import instance from "api/instance";
import React, { useEffect, useState, useRef } from "react";
import "./users.scss";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";

import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import { fetchUsersListAction } from "../utils/adminAction";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

const EditableCell = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	...restProps
}) => {
	const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{
						margin: 0,
					}}
					rules={[
						{
							required: true,
							message: `Please Input ${title}!`,
						},
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};
const originData = [];
const User = ({ users, fetchUsers }) => {
	const dispatch = useDispatch();
	const [form] = Form.useForm();
	const [data, setData] = useState(originData);
	const [editingKey, setEditingKey] = useState("");
	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef(null);
	const usersList = useSelector((state) => state.admin.usersList);
	const navigate = useNavigate();

	usersList?.map((user, index) => {
		originData.push({ ...user, key: index });
	});
	const test = usersList?.map((user, index) => ({
		...user,
		key: index,
		maNhom: "GP01",
	}));
	console.log(test);
	const isEditing = (record) => record.key === editingKey;

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
	};

	//input search
	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
		}) => (
			<div
				style={{
					padding: 8,
				}}
			>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						handleSearch(selectedKeys, confirm, dataIndex)
					}
					style={{
						marginBottom: 8,
						display: "block",
					}}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() =>
							handleSearch(selectedKeys, confirm, dataIndex)
						}
						icon={<SearchOutlined />}
						size="small"
						style={{
							width: 90,
						}}
					>
						Search
					</Button>
					<Button
						onClick={() =>
							clearFilters && handleReset(clearFilters)
						}
						size="small"
						style={{
							width: 90,
						}}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({
								closeDropdown: false,
							});
							setSearchText(selectedKeys[0]);
							setSearchedColumn(dataIndex);
						}}
					>
						Filter
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{
					color: filtered ? "#1890ff" : undefined,
				}}
			/>
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase()),
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{
						backgroundColor: "#ffc069",
						padding: 0,
					}}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ""}
				/>
			) : (
				text
			),
	});

	//call api Edit User
	const postEdit = async (user) => {
		try {
			const res = await instance.request({
				url: "/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung",
				method: "POST",
				data: user,
			});
			Swal.fire({
				position: "center",
				icon: "success",
				title: "Sửa Thành Công !",
				showConfirmButton: false,
				timer: 1500,
			});
			fetchUsersAction();
		} catch (error) {}
	};
	//call api Delete User
	const deleteUsers = async (user) => {
		try {
			const res = await instance.request({
				url: "/api/QuanLyNguoiDung/XoaNguoiDung",
				method: "DELETE",
				params: {
					TaiKhoan: user,
				},
			});
			Swal.fire({
				position: "center",
				icon: "success",
				title: "Xóa Thành Công !",
				showConfirmButton: false,
				timer: 1500,
			});
			fetchUsersAction();
		} catch (error) {
			console.log(error.response.data.content);
			Swal.fire({
				title: error.response.data.content,
				text: "Không Thể Xóa",
				icon: "error",
				showConfirmButton: false,
				timer: 1500,
			});
		}
	};
	const edit = (record) => {
		form.setFieldsValue({
			taiKhoan: "",
			hoTen: "",
			matKhau: "",
			soDT: "",
			email: "",
			maLoaiNguoiDung: "",
			...record,
		});
		setEditingKey(record.key);
	};

	const cancel = () => {
		setEditingKey("");
	};

	const save = async (key) => {
		try {
			const row = await form.validateFields();
			const user = { ...test[key], ...row };
			postEdit(user);
			setEditingKey("");
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo);
		}
	};
	const fetchUsersAction = () => {
		dispatch(fetchUsersListAction());
	};
	useEffect(() => {
		fetchUsersAction();
	}, []);
	if (!usersList) return <Spin></Spin>;
	const columns = [
		{
			title: "Tài Khoản",
			dataIndex: "taiKhoan",
			width: "15%",
			editable: false,
			...getColumnSearchProps("taiKhoan"),
		},
		{
			title: "Họ Tên",
			dataIndex: "hoTen",
			width: "25%",
			editable: true,
			...getColumnSearchProps("hoTen"),
		},
		{
			title: "Mật Khẩu",
			dataIndex: "matKhau",
			width: "10%",
			editable: true,
		},
		{
			title: "Điện Thoại",
			dataIndex: "soDT",
			width: "10%",
			editable: true,
			...getColumnSearchProps("soDT"),
		},
		{
			title: "Email",
			dataIndex: "email",
			width: "15%",
			editable: true,
			...getColumnSearchProps("email"),
		},
		{
			title: "Phân Loại",
			dataIndex: "maLoaiNguoiDung",

			filters: [
				{
					text: "Quản Trị",
					value: "QuanTri",
				},
				{
					text: "Khách Hàng",
					value: "KhachHang",
				},
			],
			onFilter: (value, record) =>
				record.maLoaiNguoiDung.indexOf(value) === 0,
			width: "15%",
			editable: true,
		},
		{
			title: "Chức Năng",
			dataIndex: "operation",
			render: (_, record) => {
				const editable = isEditing(record);
				return editable ? (
					<span>
						<Typography.Link
							onClick={() => save(record.key)}
							style={{
								marginRight: 8,
							}}
						>
							Save
						</Typography.Link>
						<Popconfirm title="Sure to cancel?" onConfirm={cancel}>
							<a>Cancel</a>
						</Popconfirm>
					</span>
				) : (
					<>
						<Typography.Link
							style={{
								marginRight: 8,
							}}
							disabled={editingKey !== ""}
							onClick={() => edit(record)}
						>
							Edit
						</Typography.Link>
						<Popconfirm
							title="Sure to Delete?"
							onConfirm={() => {
								deleteUsers(record.taiKhoan);
							}}
						>
							<a>Delete</a>
						</Popconfirm>
					</>
				);
			},
		},
	];
	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col;
		}

		return {
			...col,
			onCell: (record) => ({
				record,
				inputType: col.dataIndex === "age" ? "number" : "text",
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});
	// useEffect(()=>{
	//   // fetchUsers()
	// },[])
	return (
		<>
			<h1 style={{ fontSize: 20 }}>Quản lý người dùng</h1>
			<Button
				onClick={() => {
					navigate("/signup");
				}}
				className="btn-add"
			>
				{" "}
				<UserAddOutlined />
				Thêm Người Dùng
			</Button>
			<Form form={form} component={false}>
				<Table
					components={{
						body: {
							cell: EditableCell,
						},
					}}
					bordered
					dataSource={test}
					columns={mergedColumns}
					rowClassName="editable-row"
					pagination={{
						style: { textAlign: "center" },
						onChange: cancel,
					}}
				/>
			</Form>
		</>
	);
};

export default User;
