import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/Task.css";


const CreateTask = () => {
    const { isManager, userId } = useAuth();

    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    
    const [selectedGroupId, setSelectedGroupId] = useState(''); // Group ID
    const [selectedUserId, setSelectedUserId] = useState('');   // User ID (Only if 'Personal')

    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (isManager) {
            const fetchData = async () => {
                setLoadingData(true);
                try {
                    const [usersRes, groupsRes] = await Promise.all([
                        fetch('/api/users/get-all'),
                        fetch('/api/groups/get-all')
                    ]);

                    if (usersRes.ok && groupsRes.ok) {
                        const usersData = await usersRes.json();
                        const groupsData = await groupsRes.json();

                        setUsers(usersData);
                        
                        const allGroups = [
                            { groupId: 'PERSONAL_MODE', name: 'Personal' },
                            ...groupsData
                        ];
                        setGroups(allGroups);
                    }
                } catch (error) {
                    console.error("Failed to load assignment data", error);
                } finally {
                    setLoadingData(false);
                }
            };
            fetchData();
        }
    }, [isManager]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isPersonal = !isManager || selectedGroupId === 'PERSONAL_MODE';

        let payload = {};

        if (isPersonal) {
            payload = {
                name: title,
                description,
                assignerId: userId,
                assigneeId: isManager ? selectedUserId : userId,
                type: SINGLE,
                dueDate
            };
        } else {
            payload = {
                name: title,
                description,
                assignerId: userId,
                assigneeId: selectedGroupId,
                type: GROUP,
                dueDate
            };
        }


        try {
            const response = await fetch('/api/tasks/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                navigate('/home'); 
            } else {
                alert("Failed to create task");
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    return (
        <div className="create-task-container">
            
            <form onSubmit={handleSubmit} className="task-form">

                <h1 className="page-title">{isManager ? 'Create New Task' : 'Create Personal Task'}</h1>
                
                <div className="form-group">
                    <label>Task Name</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Fix Login Bug"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task details..."
                        rows="6"
                    />
                </div>

                <div className="form-group">
                    <label>Deadline</label>
                    <input 
                        type="datetime-local" 
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>

                {isManager && (
                    <>
                        <div className="divider"></div> {/* Optional CSS line */}
                        <div className="form-group">
                            <label>Assign To (Group or Individual)</label>
                            <select 
                                value={selectedGroupId} 
                                onChange={(e) => {
                                    setSelectedGroupId(e.target.value);
                                    setSelectedUserId(''); 
                                }}
                                required
                            >
                                <option value="">Select Assignee Type</option>
                                {loadingData ? <option>Loading...</option> : (
                                    groups.map(g => (
                                        <option key={g.groupId} value={g.groupId}>{g.name}</option>
                                    ))
                                )}
                            </select>
                        </div>

                        {selectedGroupId === 'PERSONAL_MODE' && (
                            <div className="form-group fade-in">
                                <label>Select Specific User</label>
                                <select 
                                    value={selectedUserId} 
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    required
                                >
                                    <option value="">Select User</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.username} ({u.firstName} {u.lastName})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </>
                )}

                <button type="submit" className="submit-btn">
                    Create Task
                </button>
            </form>
        </div>
    );
}

export default CreateTask;