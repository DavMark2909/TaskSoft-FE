import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserSelector from '../components/UserSelector';

import '../styles/Home.css'; 

const ModifyGroup = () => {
    const { id, group } = useParams();
    const navigate = useNavigate();

    const [groupName, setGroupName] = useState(group || '');
    const [existingUsers, setExistingUsers] = useState([]);
    const [removedUsersIds, setRemovedUsersIds] = useState([]);

    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const [userExpanded, setUsersExpanded] = useState(false);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const existingUsersResponse = await fetch(`/api/groups/stats/${id}`);
                const newUsersResponse = await fetch(`/api/users/get-all`);

                if (existingUsersResponse.ok) {
                    const result = await existingUsersResponse.json();
                    console.log(result);
                    setExistingUsers(result);
                } else {
                    console.error("Failed to fetch group details");
                }
                if (newUsersResponse.ok) {
                    const usersData = await newUsersResponse.json();
                    setAllUsers(usersData);
                } else {
                    console.error("Failed to fetch all users");
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupDetails();
    }, [id]);

    const removeUserId = (userIdToRemove) => {
        setSelectedUserIds(selectedUserIds.filter(id => id !== userIdToRemove));
    };

    const addUserId = (id) => {
        if (!selectedUserIds.includes(id)) {
            setSelectedUserIds([...selectedUserIds, id]);
        }
    };

    const toggleUsers = () => {
        setUsersExpanded(!userExpanded);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();


    };

    const members = existingUsers?.usersDto?.groupMembers || [];

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
    if (!existingUsers || !allUsers) return <div className="empty-state">Group not found.</div>;

    return (
        <div className="create-group-container">
            <form onSubmit={handleSubmit} className="group-form">
                <h1 className="page-title">Create New Team</h1>

                <div className="form-group">
                    <label>Team Name</label>
                    <input 
                        type="text" 
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="e.g. Frontend Developers"
                        required
                    />
                </div>

                <div className="task-section">
                    <div className="section-header">
                        <h2>Current members</h2>
                    </div>
                    <div
                        className="group-header"
                        onClick={() => toggleUsers()}
                    >
                        <span className="group-title">
                            {"Number of members"} <span className="count-badge">{members.length}</span>
                        </span>
                        <span className={`arrow ${userExpanded ? 'open' : ''}`}>
                            ▼
                        </span>
                    </div>

                    {userExpanded && (
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

                <div className="section-header">
                    <h2>Add new members</h2>
                </div>

                <UserSelector 
                    allUsers={allUsers}
                    selectedUserIds={selectedUserIds}
                    onAddUser={addUserId}
                    onRemoveUser={removeUserId}
                    loading={loading}
                />

            </form>

        </div>

    )

}

export default ModifyGroup;