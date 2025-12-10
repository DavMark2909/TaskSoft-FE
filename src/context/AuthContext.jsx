import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserContext = async () => {
            try {
                const response = await fetch('/api/user');
                
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.username);
                    if (data.role) {
                        setRole([data.role.toLowerCase()]); 
                    } else {
                        setRole([]);
                    }
                    setUserId(data.id)
                } else {
                    setUser(null);
                    setRole([]);
                }
            } catch (error) {
                console.error("Auth check failed", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserContext();
    }, []);

    const isManager = role?.includes('manager');

    return (
        <AuthContext.Provider value={{ user, isManager, userId, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);