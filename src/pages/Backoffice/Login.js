import { useNavigate } from 'react-router-dom';
import '../../style/Login.css';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form">
        <div className="input-container">
          <label htmlFor="email" className="input-label">E-mail</label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu e-mail"
            className="input-field"
          />
        </div>
        <div className="input-container">
          <label htmlFor="password" className="input-label">Senha</label>
          <input
            type="password"
            id="password"
            placeholder="Digite sua senha"
            className="input-field"
          />
        </div>
        <div className="button-container">
          <button type="submit" onClick={() => navigate('../Backoffice/BiographyB/AboutB')} className="login-button">Login</button>
          <button type="button" onClick={() => navigate('/')} className="back-button">Voltar à Página Inicial</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
