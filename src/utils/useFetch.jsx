import { useState, useEffect } from 'react';

const useFetch = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url, options);

                if (response.status === 401) {
                    console.log("Session expired or invalid. Redirecting to login...");
                    window.location.href = "http://localhost:9000/oauth2/authorization/gateway";
                    return; 
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setData(result);
                setError(null); 
                
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (url) {
            fetchData();
        }

    }, [url]); 

    return { data, loading, error };
};

export default useFetch;