import React from 'react';

const UserSelector = ({ allUsers, selectedUserIds, onAddUser, onRemoveUser, loading }) => {
    
    const handleSelectChange = (e) => {
        const userId = e.target.value;
        if (!userId) return;

        const userToAdd = allUsers.find(u => String(u.id) === String(userId));
        
        if (userToAdd) {
            onAddUser(userToAdd.id);
        }
        
        e.target.value = "";
    };

    const getUserObj = (id) => allUsers.find(u => u.id === id);

    return (
        <div className="user-selector-component">
            <div className="form-group">
                <label>Add Members</label>
                <select onChange={handleSelectChange} defaultValue="" className="user-select">
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
                                    {user.firstName[0]}{user.lastName[0]}
                                </div>
                                <span className="chip-name">{user.username}</span>
                                <button 
                                    type="button" 
                                    className="chip-remove"
                                    onClick={() => onRemoveUser(id)}
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default UserSelector;