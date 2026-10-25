
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import { useAuth } from './AuthContext';
import './App.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const entrar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro('');

    const entrou = await login(email, senha);
    if (!entrou) {
      setErro('E-mail ou senha incorretos, ou não foi possível conectar ao servidor.');
      return;
    }

    const parametros = new URLSearchParams(location.search);
    const destino = parametros.get('redirect');

    const destinosPermitidos = ['/sos-aluno', '/carrinho'];
    const rota = destinosPermitidos.includes(destino || '')
      ? destino!
      : '/sos-aluno';

    // A rota administrativa é verificada novamente pelo servidor; a leitura do perfil será atualizada pelo contexto.
    const perfil = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost/univblog_api/api'}/auth.php?acao=me`, { credentials: 'include' }).then(r => r.json()).then(d => d.usuario?.perfil).catch(() => 'cliente');
    navigate(perfil === 'admin' ? '/admin/produtos' : rota, { replace: true });
  };

  return (
    <div className="app-page">
      <Header />

      <main className="auth-main">
        <h1 className="auth-title">LOGIN</h1>

        <form className="auth-card" onSubmit={entrar}>
          <label htmlFor="login-email">Email/RA</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="login-senha">Senha</label>
          <input
            id="login-senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          {erro && <p className="form-error">{erro}</p>}

          <Link className="forgot-link" to="/cadastro">
            Esqueceu a senha?
          </Link>

          <button className="gold-button" type="submit">
            Entrar
          </button>

          <Link
            className="gold-button secondary-button"
            to="/cadastro"
          >
            Fazer Cadastro
          </Link>
        </form>
      </main>
    </div>
  );
};

export default Login;
