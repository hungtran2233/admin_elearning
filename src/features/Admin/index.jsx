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

import { fetchUsersListAction } from "./utils/adminAction";
import Dashboard from "./Course/Dashboard";
import ManageCourse from "./Course/ManageCourse";
import EditCourse from "./Course/EditCourse";
import AddCourse from "./Course/AddCourse";
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
	getItem("Khóa học", "/course", <DesktopOutlined />, [
		getItem("Quản lý khóa học", "/course/manage"),
		getItem("Thêm khóa học", "/course/add"),
	]),
	getItem("Người dùng", "/users", <UserOutlined />),
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
				{/* <div className="logo">
					{login ? (
						<div style={{ color: "#fff", textAlign: "center" }}>
							<div
								style={{
									display: "inline-block",
									border: "3px solid white",
									borderRadius: "50%",
								}}
							>
								<UserOutlined style={{ fontSize: 30 }} />
							</div>
							<div style={{ marginTop: 10, fontSize: 16 }}>
								Hi, {login?.taiKhoan}
							</div>
						</div>
					) : (
						<h1
							onClick={navigate("/signin")}
							style={{
								color: "#fff",
								display: "inline-block",
								cursor: "pointer",
							}}
						>
							Bạn chưa đăng nhập !
						</h1>
					)}
				</div> */}
				<Menu
					onClick={({ key }) => {
						navigate(key);
						if (key === "logout") {
							alert("Ban co muon dang xuat");
							// localStorage.removeItem("token");
						}
					}}
					theme="dark"
					defaultSelectedKeys={["/"]}
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
