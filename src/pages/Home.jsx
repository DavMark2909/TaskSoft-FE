import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState({});

    const DUMMY_DATA = {
    userName: "Mark",
    stats: {
        totalCompleted: 42,
        totalPending: 8,
        overdueCount: 2
    },
    ongoingTasks: [
        {
            id: 101,
            title: "Fix Login JWT Issue",
            description: "Token is expiring too fast, need to check refresh token logic.",
            group: "Backend Team",
            dueDate: "2025-12-05T10:00:00"
        },
        {
            id: 102,
            title: "Database Migration",
            description: "Migrate User table to new schema.",
            group: "Backend Team",
            dueDate: "2025-12-08T14:30:00"
        },
        {
            id: 103,
            title: "Prepare Q4 Financial Report",
            description: "Gather data from all departments for the board meeting.",
            group: "Finance Group",
            dueDate: "2025-12-01T09:00:00" // Past date (Overdue)
        },
        {
            id: 104,
            title: "Review Budget Proposal",
            description: "Check the allocation for the new marketing campaign.",
            group: "Finance Group",
            dueDate: "2025-12-10T11:00:00"
        },
        {
            id: 105,
            title: "Buy Groceries",
            description: "Milk, Eggs, Bread, and Coffee.",
            group: null, // Testing the "Personal" fallback
            dueDate: "2025-12-04T18:00:00"
        },
        {
            id: 106,
            title: "Call Mom",
            description: "Catch up on the weekend news.",
            group: null,
            dueDate: "2025-12-06T19:00:00"
        },
        {
            id: 107,
            title: "Update API Documentation",
            description: "Swagger UI is outdated.",
            group: "DevOps",
            dueDate: "2025-12-15T12:00:00"
        }
    ]
};

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
    //             setData(result);
    //             // set all groups to ne expanded by default
    //             // initializeGroups(result.ongoingTasks);
                
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            setTimeout(() => {
                console.log("Using Mock Data");
                setData(DUMMY_DATA);
                setLoading(false);
            }, 800);
        };

        fetchData();
    }, []);
    
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
                <h1>Welcome, {data?.userName}</h1>
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