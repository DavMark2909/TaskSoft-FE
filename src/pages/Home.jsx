import { use, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import useFetch from '../utils/useFetch';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import '../styles/Home.css';

function Home() {
    // const [data, setData] = useState(null);
    // const [loading, setLoading] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState({});



    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('/api/home');

    //             if (response.status === 401) {
    //                 console.log("Session expired or invalid. Redirecting to login...");
                    
    //                 window.location.href = "http://localhost:9000/oauth2/authorization/gateway";
    //                 return; 
    //             }

    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }

    //             const result = await response.json();
    //             console.log(result)
    //             setData(result);
                
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, []);

    const { data, loading, error } = useFetch('/api/home');

    // make a call to notification service to get all notifications for the user

    const { data: groupdData, loading: groupLoading, error: groupError } = useFetch('/api/user/groups');

    useEffect(() => {
        if (!groupdData || !data) return;

        console.log("Groups data:", groupdData);

        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:9000/ws-notifications', null, {
                withCredentials: true
            }),
            
            onConnect: () => {
                console.log("Connected to STOMP!");

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
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
            }
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };


    }, [groupdData]);



    const handleComplete = async (task) => {

        const payload = {
            id: task.id,
            name: task.title,       
            description: task.description,
            type: "COMPLETED"
        };

        try{
            const response = await fetch('/api/tasks/update', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(payload)
            });

            if (response.ok){
                setData(prev => ({
                    ...prev,
                    ongoingTasks: prev.ongoingTasks.filter(t => t.id !== task.id),
                    stats: {
                        ...prev.stats,
                        totalPending: prev.stats.totalPending - 1,
                        totalCompleted: prev.stats.totalCompleted + 1
                    }
                }));
            }
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    
    const getGroupedTasks = () => {
        if (!data || !data.ongoingTasks) return {};
        
        return data.ongoingTasks.reduce((acc, task) => {
            const groupName = task.group || "Personal"; 
            if (!acc[groupName]) {
                acc[groupName] = [];
            }
            acc[groupName].push(task);
            return acc;
        }, {});
    };

    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName] 
        }));
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    const groupedTasks = getGroupedTasks();

    return (
        <>
            <header className="welcome-header">
                <h1>Welcome {data?.userName}</h1>
                <p className="date-display">{new Date().toLocaleDateString()}</p>
            </header>

            <section className="stats-grid">
                <div className="stat-card completed">
                    <h3>Total Completed</h3>
                    <div className="stat-number">{data.stats.totalCompleted}</div>
                </div>
                <div className="stat-card pending">
                    <h3>Total Ongoing</h3>
                    <div className="stat-number">{data.stats.totalPending}</div>
                </div>
                <div className="stat-card overdue">
                    <h3>Overdue Count</h3>
                    <div className="stat-number">{data.stats.overdueCount}</div>
                </div>
            </section>

            <section className="tasks-section">
                <h2>Your Tasks</h2>
                
                {Object.keys(groupedTasks).length === 0 && (
                    <p className="empty-state">No ongoing tasks. Good job!</p>
                )}

                {Object.entries(groupedTasks).map(([groupName, tasks]) => (
                    <div key={groupName} className="task-group">
                        <div 
                            className="group-header" 
                            onClick={() => toggleGroup(groupName)}
                        >
                            <span className="group-title">{groupName} <span className="count-badge">{tasks.length}</span></span>
                            <span className={`arrow ${expandedGroups[groupName] ? 'open' : ''}`}>
                                ▼
                            </span>
                        </div>

                        {expandedGroups[groupName] && (
                            <div className="task-list">
                                {tasks.map(task => (
                                    <div key={task.id} className="task-item">
                                        <div className="task-info">
                                            <div className="task-title">{task.title}</div>
                                            <div className="task-desc">{task.description}</div>
                                        </div>
                                        <div className="task-meta">
                                            <span className="due-date">
                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                            <button 
                                                className="complete-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    handleComplete(task);
                                                }}
                                            >
                                                ✓ Complete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </>

    );
}

export default Home;