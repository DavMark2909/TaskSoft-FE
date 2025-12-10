// import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateTask from './pages/CreateTask';
import MainLayout from './pages/MainLayout';
import CreateGroup from './pages/CreateGroup';
import GroupList from './pages/GroupList';
import GroupDetails from './pages/GroupDetails';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { loading, user } = useAuth();

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
    
    if (!user) {
		window.location.href = "http://localhost:9000/oauth2/authorization/gateway";
	}

    return children;
};

function App() {
  return (
    <AuthProvider>
        <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />

            <Route element={<MainLayout />}>
                <Route path="/home" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />
                <Route path="/create-task" element={
                    <ProtectedRoute>
                        <CreateTask />
                    </ProtectedRoute>
                } />
                <Route path="/create-group" element={
                    <ProtectedRoute>
                        <CreateGroup />
                    </ProtectedRoute>
                } />
                <Route path="/manage-groups" element={
                    <ProtectedRoute>
                        <GroupList />
                    </ProtectedRoute>
                } />
                <Route path="/groups/:id" element={
                    <ProtectedRoute>
                        <GroupDetails />
                    </ProtectedRoute>
                } />
            </Route>
        </Routes>
    </AuthProvider>
  );
}

// function App() {
// 	return (
// 		<Routes>
// 			<Route path="/" element={<Navigate to="/home" replace />} />
// 			<Route element={<MainLayout />}>
// 				<Route path="/home" element={<Home />} />
// 			</Route>
// 		</Routes>
// 	);

// }

export default App;

{/* <main>
	<Routes>
		<Route path="/authorization" element={<Authorization />} />
		<Route element={<PrivateRoute />}>
			<Route path="/home" element={<Home />} />
			<Route path="/" element={<Navigate to="/home" replace />} />
		</Route>
	</Routes>
</main> */}