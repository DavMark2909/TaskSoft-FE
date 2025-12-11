import '../styles/Home.css';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { isManager } = useAuth();
    return (
        <aside className="sidebar">
            <div className="sidebar-header">TaskSoft</div>
            <nav className="sidebar-nav">
                <NavLink to="/home" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Home</NavLink>
                {/* <NavLink to="/tasks" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>My Tasks</NavLink> */}
                <NavLink to="/create-task" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Create Task</NavLink>
                {!isManager && <NavLink to="/check-groups" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>My Groups</NavLink>}
                {isManager && 
                    <>
                        <NavLink to="/manage-groups" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Manage Groups</NavLink>
                        <NavLink to="/create-group" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Create Group</NavLink>
                    </>}
                <NavLink to="/calendar" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Calendar</NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Settings</NavLink>
            </nav>
        </aside>
    )
}

export default Sidebar;