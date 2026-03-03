import '../styles/Toast.css';

const ToastContainer = ({ notifications, setLiveNotifications }) => {
    
    const removeNotification = (indexToRemove) => {
        setLiveNotifications(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    if (notifications.length === 0) return null; // Invisible when empty

    return (
        <div className="toast-wrapper">
            {notifications.map((note, index) => (
                <div key={index} className="toast-message">
                    <p>{note.message}</p>
                    <button onClick={() => removeNotification(index)}>X</button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;