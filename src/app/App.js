import "../App.scss";
import "suneditor/dist/css/suneditor.min.css";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Admin from "features/Admin";
import User from "features/Admin/User/User";
import ManageCourse from "features/Admin/Course/ManageCourse";
import EditCourse from "features/Admin/Course/EditCourse";
import AddCourse from "features/Admin/Course/AddCourse";

function App() {
	return (
		<div>
			<Router>
				<Routes>
					{/* <Route path="/signin" element={<SignIn setGetUser={setGetUser} />} /> */}
					<Route path="/*" element={<Admin />}>
						<Route path="/*users" element={<User />} />
						<Route path="/*course/manage" element={<ManageCourse />} />
						<Route path="/*course/edit/:id" element={<EditCourse />} />
						<Route path="/*course/add" element={<AddCourse />} />
					</Route>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
