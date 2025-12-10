import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/GroupList.css'; // New CSS file

const GroupList = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch('/api/groups/get-all'); 
                if (response.ok) {
                    const data = await response.json();
                    setGroups(data);
                }
            } catch (error) {
                console.error("Failed to fetch groups", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleGroupClick = (id) => {
        navigate(`/groups/${id}`);
    };

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="group-list-container">
            <h1 className="page-title">Your Teams</h1>

            {groups.length === 0 ? (
                <div className="empty-state">
                    <p>No teams found.</p>
                    <button onClick={() => navigate('/create-group')} className="create-btn">
                        Create New Team
                    </button>
                </div>
            ) : (
                <div className="groups-grid">
                    {groups.map((group) => (
                        <div 
                            key={group.groupId} 
                            className="group-card"
                            onClick={() => handleGroupClick(group.groupId)}
                        >
                            <div className="card-icon">
                                👥
                            </div>
                            <div className="card-info">
                                <h3 className="group-name">{group.name}</h3>
                                <span className="view-details">View Details →</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupList;