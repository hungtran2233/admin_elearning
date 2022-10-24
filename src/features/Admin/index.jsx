import {
	DesktopOutlined,
	FileOutlined,
	PieChartOutlined,
	TeamOutlined,
	UserOutlined,
	LoginOutlined,
	UserSwitchOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import User from "./User/User";
import "./admin.scss";

import Dashboard from "./Course/Dashboard";
import ManageCourse from "./Course/ManageCourse";
import EditCourse from "./Course/EditCourse";
import AddCourse from "./Course/AddCourse";
import { useDispatch } from "react-redux";
import { fetchProfileAction } from "features/Authentication/utils/authAction";
import AddUser from "./User/components/AddUser";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
	return {
		key,
		icon,
		children,
		label,
	};
}

const items = [
	getItem("Khóa học", "/admin/course", <DesktopOutlined />, [
		getItem("Quản lý khóa học", "/admin/course/manage"),
		getItem("Thêm khóa học", "/admin/course/add"),
	]),
	getItem("Người dùng", "/admin", <UserOutlined />,
	[
		getItem('Quản lý người dùng','/admin/user'),
		getItem('Đăng kí khóa học')
	]),
	getItem("Đăng Xuất", "logout", <LoginOutlined />),
];

// ADMIN:
// tk: hunggv1
// mk: 123456

const Admin = () => {
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);

	return (
		<Layout
			style={{
				minHeight: "100vh",
			}}
		>
			<Sider
				className="sider"
				collapsible
				collapsed={collapsed}
				onCollapse={(value) => setCollapsed(value)}
			>
				<Menu
					onClick={({ key }) => {
						navigate(key);
						if (key === "logout") {
							alert("Ban co muon dang xuat");
							// localStorage.removeItem("token");
						}
					}}
					theme="dark"
					defaultSelectedKeys={["/admin"]}
					mode="inline"
					items={items}
				/>
			</Sider>
			<Layout className="site-layout">
				<Header
					className="site-layout-background"
					style={{
						padding: 0,
					}}
				/>
				<Content
					style={{
						margin: "0 16px",
					}}
				>
					<div
						className="site-layout-background"
						style={{
							padding: 24,
							minHeight: 360,
						}}
					>
						<Routes>
							<Route path="/" element={<Dashboard />} />
							<Route path="/course/manage" element={<ManageCourse />} />
							<Route path="/course/edit/:id" element={<EditCourse />} />
							<Route path="/course/add" element={<AddCourse />} />

							<Route path="/user" element={<User />} />
							<Route path="/user/add" element={<AddUser />} />
						</Routes>
					</div>
				</Content>
				<Footer
					style={{
						textAlign: "center",
					}}
				>
					Ant Design ©2018 Created by Ant UED
				</Footer>
			</Layout>
		</Layout>
	);
};

export default Admin;
