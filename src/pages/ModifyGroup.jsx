import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserSelector from '../components/UserSelector';

import '../styles/Home.css'; 

const ModifyGroup = () => {
    const { id, group } = useParams();
    const navigate = useNavigate();

    const [groupName, setGroupName] = useState(group || '');
    const [existingUsers, setExistingUsers] = useState([]);
    const [deletedMemberIds, setDeletedMemberIds] = useState(new Set());

    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const [userExpanded, setUsersExpanded] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const existingUsersResponse = await fetch(`/api/groups/stats/${id}`);
                const newUsersResponse = await fetch(`/api/users/get-all`);

                // set to filter out existing users from the all users list
                let exiUsers;

                if (existingUsersResponse.ok) {
                    const result = await existingUsersResponse.json();
                    console.log(result);
                    exiUsers = new Set(result.usersDto.groupMembers.map(m => m.userId));
                    setExistingUsers(result);
                } else {
                    console.error("Failed to fetch group details");
                }
                if (newUsersResponse.ok) {
                    const usersData = await newUsersResponse.json();
                    setAllUsers(usersData.filter(user => !exiUsers.has(user.id)));
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

        let payload = {};

        payload = {
            updatedName: groupName,
            userIdsToAdd: selectedUserIds,
            userIdsToRemove: Array.from(deletedMemberIds)
        };

        console.log("Payload to submit:", payload);

        try {
            const response = await fetch(`/api/groups/modify/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                navigate('/manage-groups');
            } else {
                console.error("Failed to modify group");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const toggleDelete = (userId) => {
        setDeletedMemberIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
                newSet.delete(userId);
            } else {
                newSet.add(userId);
            }
            return newSet;
        });
    }

    const members = existingUsers?.usersDto?.groupMembers || [];

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
    if (!existingUsers || !allUsers) return <div className="empty-state">Group not found.</div>;

    return (
        <div className="create-group-container">
            <form onSubmit={handleSubmit} className="group-form">
                <h1 className="page-title">Modify a Team</h1>

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
                            {members.map(member => {
                                const isDeleted = deletedMemberIds.has(member.userId);
                                return ( 
                                    <div key={member.userId} className={`task-item ${isDeleted ? 'staged-deleted' : ''}`}>
                                        <div className="task-info">
                                            <div className="task-title">{member.fullName}</div>
                                            <div className="task-desc">@{member.username}</div>
                                        </div>

                                        <button 
                                            type="button"
                                            className="delete-btn"
                                            onClick={() => toggleDelete(member.userId)}

                                        >
                                            {isDeleted ? 'Undo' : '✕'}
                                        </button>
                                    </div>
                                );
                        })}
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

                <div className="action-footer">
                    <button
                        className="submit-btn"
                    >
                        Modify Task
                    </button>
                </div>

            </form>

        </div>

    )

}

export default ModifyGroup;