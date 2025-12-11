import { useState, useEffect } from 'react';

const MyGroups = () => {
    const [groupsData, setGroupsData] = useState([]); 
    const [expandedGroups, setExpandedGroups] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserGroups = async () => {
            try {

                const response = await fetch('/api/groups/user-groups');

                if (!response.ok) {
                    throw new Error('Failed to fetch groups');
                }

                const data = await response.json();
                setGroupsData(data);
            } catch (error) {
                console.error("Error loading groups:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserGroups();
    }, []); 

    const getGroupedMembers = () => {
        if (!groupsData) return {};
        
        return groupsData.reduce((acc, groupDto) => {
            acc[groupDto.groupName] = groupDto.groupMembers;
            return acc;
        }, {});
    };

    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };

    if (loading) return <div>Loading groups...</div>;

    // 4. Render
    return (
        <div className="groups-page-container">
            <h2>My Teams</h2>
            
            {Object.entries(getGroupedMembers()).map(([groupName, members]) => (
                <div key={groupName} className="task-group">
                    <div 
                        className="group-header" 
                        onClick={() => toggleGroup(groupName)}
                    >
                        <span className="group-title">
                            {groupName} <span className="count-badge">{members.length}</span>
                        </span>
                        <span className={`arrow ${expandedGroups[groupName] ? 'open' : ''}`}>
                            ▼
                        </span>
                    </div>

                    {expandedGroups[groupName] && (
                        <div className="task-list">
                            {members.map(member => (
                                <div key={member.userId} className="task-item">
                                    <div className="task-info">
                                        <div className="task-title">{member.fullName}</div>
                                        <div className="task-desc">@{member.username}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyGroups;