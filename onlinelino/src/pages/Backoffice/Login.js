import React, { useState } from 'react';
import { SERVER_URL, BACKOFFICE_URL } from "../../Utils";
import { useNavigate } from 'react-router-dom';
import '../../style/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();

    
    const validateEmail = (email) => {
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    };

    const handleEmailBlur = () => {
        if (!username) {
            setEmailError('O campo não pode estar vazio');
        } else if (!validateEmail(username)) {
            setEmailError('Email inválido');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordBlur = () => {
        if (!password) {
            setPasswordError('O campo não pode estar vazio');
        } else {
            setPasswordError('');
        }
    };

    const validateInputs = async (e) => {
        e.preventDefault();

        let isValid = true;

        
        if (!username) {
            setEmailError('O campo não pode estar vazio');
            isValid = false;
        } else if (!validateEmail(username)) {
            setEmailError('Email inválido');
            isValid = false;
        } else {
            setEmailError('');
        }

        // Validação da senha
        if (!password) {
            setPasswordError('O campo não pode estar vazio');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (isValid) {
            login(); 
        }
    };

    async function login() {
        try {
            const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                const SESSION_TOKEN = data.token;
                sessionStorage.setItem('authorization', SESSION_TOKEN);
                alert(`Bem Vindo ${username}!`);
                navigate('../Backoffice/BiographyB/AboutB');
            } else {
                alert(data.error || 'Falha no login');
            }
        } catch (error) {
            console.error('Login failed', error);
            alert('Erro ao tentar realizar o login');
        }
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={validateInputs}>
                <div className="input-container">
                    <label htmlFor="email" className="input-label">E-mail</label>
                    <input
                        type="text"
                        id="email"
                        placeholder="Digite seu e-mail"
                        className={`input-field ${emailError ? 'error-border' : ''}`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={handleEmailBlur}
                    />
                    {emailError && <span className="error-message">{emailError}</span>}
                </div>

                <div className="input-container">
                    <label htmlFor="password" className="input-label">Palavra Passe</label>
                    <input
                        type="password"
                        id="password"
                        className={`input-field ${passwordError ? 'error-border' : ''}`}
                        placeholder="Digite sua palavra passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={handlePasswordBlur}
                    />
                    {passwordError && <span className="error-message">{passwordError}</span>}
                </div>

                <div className="button-container">
                    <button type="submit" className="login-button">Login</button>
                    <button type="button" onClick={() => navigate('/')} className="back-button">Voltar à Página Inicial</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
