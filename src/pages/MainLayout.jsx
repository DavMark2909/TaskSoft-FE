import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/Home.css';

const MainLayout = () => {
    return (
        <div className="app-container">
            <Sidebar />

            <main className="main-content">
                <div className="content-container">
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};

export default MainLayout;