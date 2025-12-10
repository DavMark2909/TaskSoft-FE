import {useEffect, useState} from 'react';
import { Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        
        if (token) {
            setIsAuthenticated(true);
        } else {
            startLogin();
        }
    }, []);

    if (!isAuthenticated) {
        return <div>Loading TaskSoft...</div>; 
    }

    return <Outlet />;
}


async function startLogin() {
    const codeVerifier = generateRandomString();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    localStorage.setItem('code_verifier', codeVerifier);
    localStorage.setItem('code_challenge', codeChallenge);

    const authUrl = new URL("http://localhost:8080/oauth2/authorize");
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("client_id", "frontend");
    authUrl.searchParams.append("scope", "openid");
    authUrl.searchParams.append("redirect_uri", "http://localhost:5173/authorization");
    authUrl.searchParams.append("code_challenge", codeChallenge);
    authUrl.searchParams.append("code_challenge_method", "S256");

    // Don't make an actual call, just tell the browser to open the thymeleaf based page
    window.location.href = authUrl.toString();
}

function generateRandomString() {
    const array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}

async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)));
    return base64Digest
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

export default PrivateRoute;