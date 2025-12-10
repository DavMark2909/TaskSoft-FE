import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Authorization() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const effectRan = useRef(false);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('idle');

    const code = new URLSearchParams(location.search).get('code');

    useEffect(() => {
        if (effectRan.current === true || !code) return;

        async function exchangeToken() {
            effectRan.current = true; // Mark as run
            setLoading(true);
            setStatus('exchanging');

            try {
                const codeVerifier = localStorage.getItem("code_verifier");

                const params = new URLSearchParams();
                params.append("grant_type", "authorization_code");
                params.append("client_id", "frontend");
                params.append("code", code);
                params.append("redirect_uri", "http://localhost:5173/authorization");
                params.append("code_verifier", codeVerifier);

                const res = await fetch("http://localhost:8080/oauth2/token", {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded' 
                    },
                    body: params 
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || `HTTP ${res.status}`);
                }

                const data = await res.json();
                console.log(data)
                
                localStorage.setItem('access_token', data.access_token);
                if (data.refresh_token) {
                    localStorage.setItem('refresh_token', data.refresh_token);
                }
                
                localStorage.removeItem('code_verifier');

                setStatus('success');
                navigate('/home');

            } catch (err) {
                console.error("Token Exchange Failed:", err);
                setError(err.message);
                setStatus('error');
            } finally {
                setLoading(false);
            }
        }

        exchangeToken();
    }, [code, navigate]); 

    if (loading) return <div>Processing Login...</div>;
    if (error) return <div style={{color: 'red'}}>Login Failed: {error}</div>;

    return <div>Redirecting...</div>;
}

export default Authorization;