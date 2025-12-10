import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/CreateGroups.css";

const CreateGroup = () => {
    const navigate = useNavigate();

    const [groupName, setGroupName] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users/get-all');
                if (response.ok) {
                    const data = await response.json();
                    setAllUsers(data);
                }
            } catch (error) {
                console.error("Failed to load users", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleAddUser = (e) => {
        const userId = e.target.value;
        if (!userId) return;

        const userToAdd = allUsers.find(u => String(u.id) === String(userId));

        if (userToAdd) {
             const realId = userToAdd.id; 
             
             if (!selectedUserIds.includes(realId)) {
                setSelectedUserIds([...selectedUserIds, realId]);
            }
        }
        
        e.target.value = "";
    };

    const handleRemoveUser = (userIdToRemove) => {
        setSelectedUserIds(selectedUserIds.filter(id => id !== userIdToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedUserIds.length === 0) {
            alert("Please select at least one member.");
            return;
        }

        const payload = {
            name: groupName,
            users: selectedUserIds
        };

        try {
            const response = await fetch('/api/groups/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                navigate('/home');
            } else {
                alert("Failed to create group");
            }
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    const getUserObj = (id) => allUsers.find(u => u.id === id);

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

                <div className="form-group">
                    <label>Add Members</label>
                    <select onChange={handleAddUser} defaultValue="" className="user-select">
                        <option value="" disabled>-- Select a User to Add --</option>
                        {loading ? <option>Loading...</option> : (
                            allUsers
                                .filter(u => !selectedUserIds.includes(u.id))
                                .map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.username} ({user.firstName} {user.lastName})
                                    </option>
                                ))
                        )}
                    </select>
                </div>

                <div className="selected-members-area">
                    <label>Selected Members ({selectedUserIds.length})</label>
                    
                    <div className="members-grid">
                        {selectedUserIds.length === 0 && (
                            <span className="empty-msg">No members added yet.</span>
                        )}

                        {selectedUserIds.map(id => {
                            const user = getUserObj(id);
                            if (!user) return null;

                            return (
                                <div key={id} className="member-chip">
                                    <div className="chip-avatar">
                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                    </div>
                                    <span className="chip-name">{user.username}</span>
                                    <button 
                                        type="button" 
                                        className="chip-remove"
                                        onClick={() => handleRemoveUser(id)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button type="submit" className="submit-btn">
                    Create Group
                </button>
            </form>
        </div>
    );
};

export default CreateGroup;