import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Home.css'; // Reusing your main Dashboard styles

const GroupDetails = () => {
    const { id } = useParams(); // Extracts '123' from '/groups/123'
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const DUMMY_GROUP_DATA = {
    groupName: "Backend Team",
    stats: {
        totalCompleted: 15,
        totalPending: 5,
        overdueCount: 2
    },
    tasks: [
        {
            id: 201,
            title: "Fix JWT Token Expiry",
            description: "Tokens are expiring too fast in production. Need to extend TTL to 24h.",
            taskType: "IN_PROGRESS",
            dueDate: "2025-12-01T10:00:00", // Past date (Overdue)
            assigneeName: "Mark Spencer"
        },
        {
            id: 202,
            title: "Optimize Database Queries",
            description: "The 'get-all-users' endpoint is taking 2s to load. Needs indexing.",
            taskType: "IN_PROGRESS",
            dueDate: "2025-12-08T15:00:00", // Future date
            assigneeName: "Sarah Connor"
        },
        {
            id: 203,
            title: "Setup CI/CD Pipeline",
            description: "Integrate GitHub Actions for auto-deployment to AWS.",
            taskType: "IN_PROGRESS",
            dueDate: "2025-12-10T09:00:00",
            assigneeName: "John Doe"
        },
        {
            id: 204,
            title: "Update API Documentation",
            description: "Swagger is missing the new Group endpoints.",
            taskType: "IN_PROGRESS",
            dueDate: "2025-12-05T12:00:00", // Future date
            assigneeName: "Mark Spencer"
        },
        {
            id: 205,
            title: "Refactor Auth Middleware",
            description: "Clean up the legacy code in the security filter chain.",
            taskType: "IN_PROGRESS",
            dueDate: "2025-11-20T10:00:00", // Past date (Overdue)
            assigneeName: "Alice Wonderland"
        }
    ]
};

    // useEffect(() => {
    //     const fetchGroupDetails = async () => {
    //         try {
    //             const response = await fetch(`/api/groups/stats/${id}`); 
                
    //             if (response.ok) {
    //                 const result = await response.json();
    //                 setData(result);
    //             } else {
    //                 console.error("Failed to fetch group details");
    //             }
    //         } catch (error) {
    //             console.error("Error:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchGroupDetails();
    // }, [id]);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                
                    setData(DUMMY_GROUP_DATA);

            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupDetails();
    }, [id]);

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
    if (!data) return <div className="empty-state">Group not found.</div>;

    return (
        <div className="group-details-container"> 
            

            <header className="welcome-header">
                <button onClick={() => navigate(-1)} className="back-link">
                    ← Back to Teams
                </button>
                <h1>{data.groupName}</h1>
                <p className="date-display">Team Overview</p>
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

            {/* 3. Flat Task List (No Accordion needed) */}
            <section className="tasks-section">
                <h2>Active Tasks</h2>

                {(!data.tasks || data.tasks.length === 0) ? (
                    <p className="empty-state">No active tasks for this group.</p>
                ) : (

                    <div className="task-list">
                        {data.tasks.map(task => (
                            <div key={task.id} className="task-item">
                                <div className="task-info">
                                    <div className="task-title">{task.title}</div>
                                    <div className="task-desc">{task.description}</div>
                                    
                                    {/* Optional: Show who is assigned if you have that data */}
                                    
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
            </section>
        </div>
    );
};

export default GroupDetails;