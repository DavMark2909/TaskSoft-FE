import Sidebar from '../components/Sidebar';
import SockJS from 'sockjs-client';
import ToastContainer from '../components/ToastContainer';
import useFetch from '../utils/useFetch';
import { Outlet } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

import '../styles/Home.css';

const MainLayout = () => {
    const { userId, loading: authLoading } = useAuth();
    const [liveNotifications, setLiveNotifications] = useState([]);

    const { data: groupdData, loading: groupLoading, error: groupError } = useFetch('/api/user/groups');

    useEffect(() => {
        if (!groupdData || !data) return;

        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:9000/ws-notifications', null, {
                withCredentials: true
            }),
            onConnect: () => {
                console.log("Global STOMP Connected!");
                stompClient.subscribe('/user/queue/notifications', (message) => {
                    const newAlert = JSON.parse(message.body);
                    setLiveNotifications(prev => [...prev, newAlert]);
                });
                
                groupdData.forEach(group => {
                    stompClient.subscribe(`/topic/group.${group.id}`, (message) => {
                        const newAlert = JSON.parse(message.body);
                        setLiveNotifications(prev => [...prev, newAlert]);
                    });
                });
            }
        });

        stompClient.activate();
        return () => stompClient.deactivate();
    }, [groupdData, data]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }


    return (
        <div className="app-container">
            <Sidebar />
            <ToastContainer notifications={liveNotifications} setLiveNotifications={setLiveNotifications} />

            <main className="main-content">
                <div className="content-container">
                    <Outlet /> 
                </div>
            </main>
        </div>
    );
};

export default MainLayout;