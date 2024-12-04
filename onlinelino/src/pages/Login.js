import React, { useState } from 'react';
import { SERVER_URL, BACKOFFICE_URL } from "../Utils";


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    let SESSION_TOKEN = '';

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            SESSION_TOKEN = data.token;
            sessionStorage.setItem('authorization', SESSION_TOKEN);
            if(SESSION_TOKEN){
                alert(`Bem Vindo ${username}!`);
                window.location.href = '/';
            }else{
                alert(data.error);
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
