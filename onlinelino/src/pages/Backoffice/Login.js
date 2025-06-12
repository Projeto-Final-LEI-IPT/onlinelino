import React, { useState } from 'react';
import { SERVER_URL, BACKOFFICE_URL } from "../../Utils";
import { useNavigate } from 'react-router-dom';
import '../../style/Login.css';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

const Login = () => {
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();


    const validateEmail = (email) => {
        return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    };

    const handleEmailBlur = () => {
        if (!email) {
            setEmailError('O campo não pode estar vazio');
        } else if (!validateEmail(email)) {
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


        if (!email) {
            setEmailError('O campo não pode estar vazio');
            isValid = false;
        } else if (!validateEmail(email)) {
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
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                const SESSION_TOKEN = data.token;
                localStorage.setItem('authorization', SESSION_TOKEN);

                navigate('../Backoffice/ProjectB/DescriptionB');
            } else {
                setPasswordError(data.error || 'Credenciais inválidas');
            }
        } catch (error) {
            console.error('Login failed', error);
            setPasswordError('Erro ao tentar realizar o login');
        }
    }

    return (
        <div
            className="login-container"
            style={{
                backgroundImage: "url('/img/fundo_descricao.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                flexDirection: "column",
            }}
        >
            <h2>Login</h2>
            <form className="login-form" onSubmit={validateInputs}>
                <div className="input-container">
                    <label htmlFor="email" className="input-label">E-mail</label>
                    <input
                        type="text"
                        id="email"
                        placeholder="Digite o seu e-mail"
                        className={`input-field ${emailError ? 'error-border' : ''}`}
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        onBlur={handleEmailBlur}
                    />
                    {emailError && <span className="error-message">{emailError}</span>}
                </div>

                <div className="input-container" style={{ position: 'relative' }}>
                    <label htmlFor="password" className="input-label">Palavra Passe</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className={`input-field ${passwordError ? 'error-border' : ''}`}
                        placeholder="Digite sua palavra passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={handlePasswordBlur}
                        style={{ paddingRight: '40px' }} // espaço para o ícone
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0
                        }}
                        tabIndex={-1} 
                    >
                        {showPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />} 
                    </button>
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
