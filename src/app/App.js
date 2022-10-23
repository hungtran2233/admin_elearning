import "../App.scss";
import "suneditor/dist/css/suneditor.min.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Admin from "features/Admin";
import User from "features/Admin/User/User";

import SignIn from "features/Authentication/SignIn/SignIn";
import { useDispatch } from "react-redux";
import { fetchProfileAction } from "features/Authentication/utils/authAction";
import { useEffect } from "react";

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(fetchProfileAction());
	}, []);

	// ADMIN:
	// tk: hunggv1
	// mk: 123456

	return (
		<div>
			<Router>
				<Routes>
					<Route path="/" element={<SignIn />} />
					<Route path="/admin/*" element={<Admin />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
