
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import { useAuth } from './AuthContext';
import './App.css';

const Cadastro: React.FC = () => {
  const { cadastrar } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');

  const criarConta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErro('');

    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmacao) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (!(await cadastrar(nome, email, senha))) {
      setErro('Esse e-mail já está cadastrado ou os dados são inválidos.');
      return;
    }

    navigate('/sos-aluno', { replace: true });
  };

  return (
    <div className="app-page">
      <Header />

      <main className="auth-main register-main">
        <h1 className="auth-title">CADASTRO</h1>

        <form className="auth-card register-card" onSubmit={criarConta}>
          <label htmlFor="cadastro-nome">Nome</label>
          <input
            id="cadastro-nome"
            type="text"
            autoComplete="name"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label htmlFor="cadastro-email">Email/RA</label>
          <input
            id="cadastro-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="cadastro-senha">Senha</label>
          <input
            id="cadastro-senha"
            type="password"
            autoComplete="new-password"
            minLength={6}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <label htmlFor="cadastro-confirmacao">Repita a Senha</label>
          <input
            id="cadastro-confirmacao"
            type="password"
            autoComplete="new-password"
            minLength={6}
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            required
          />

          {erro && <p className="form-error">{erro}</p>}

          <button className="gold-button register-submit" type="submit">
            Fazer Cadastro
          </button>

          <p className="auth-switch">
            Já possui uma conta? <Link to="/login">Fazer login</Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Cadastro;
