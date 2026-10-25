import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Header from './Header';
import Home from './Home';
import Sobre from './Sobre';
import Login from './Login';
import Cadastro from './Cadastro';
import SosAluno from './SosAluno';
import Carrinho from './Carrinho';
import AdminProdutos from './AdminProdutos';
import './App.css';

const Forum: React.FC = () => (
  <div className="app-page">
    <Header />
    <main className="simple-page">
      <section className="simple-card">
        <h1>FÓRUM</h1>
        <p>Em breve, um espaço para compartilhar experiências universitárias.</p>
        <Link to="/" className="gold-button">Voltar para Home</Link>
      </section>
    </main>
  </div>
);

const AdminProtegido: React.FC = () => {
  const { usuario, carregandoSessao } = useAuth();
  if (carregandoSessao) return <div className="auth-loading">Verificando acesso...</div>;
  if (!usuario) return <Navigate to="/login?redirect=/admin/produtos" replace />;
  if (usuario.perfil !== 'admin') return <Navigate to="/sos-aluno" replace />;
  return <AdminProdutos />;
};

const AppRotas: React.FC = () => (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/sos-aluno" element={<SosAluno />} />
      <Route path="/carrinho" element={<Carrinho />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/admin/produtos" element={<AdminProtegido />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
);

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRotas />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
