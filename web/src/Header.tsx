
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Header.css';

const Header: React.FC = () => {
  const { usuario, carrinho, logout } = useAuth();
  const navigate = useNavigate();

  const quantidade = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  const sair = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <Link to="/" className="logo-container">
        <div className="star-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
        <span className="logo-text">UNIV.BLOG</span>
      </Link>

      <nav className="nav-menu">
        <Link to="/" className="nav-link">HOME</Link>
        <Link to="/sobre" className="nav-link">SOBRE NÓS</Link>
        <Link to="/sos-aluno" className="nav-link">SOS ALUNO</Link>
        <Link to="/forum" className="nav-link">FÓRUM</Link>
        {usuario?.perfil === 'admin' && <Link to="/admin/produtos" className="nav-link admin-nav-link">ADMIN</Link>}
      </nav>

      <div className="header-account">
        {usuario && (
          <>
            <Link to="/carrinho" className="header-cart" aria-label="Carrinho">
              🛒 <span>{quantidade}</span>
            </Link>

            <span className="header-username">
              {usuario.nome.split(' ')[0]}
            </span>
          </>
        )}

        <Link
          to={usuario ? '/sos-aluno' : '/login'}
          className="user-avatar"
          title={usuario ? 'Minha conta' : 'Fazer login'}
          aria-label={usuario ? 'Minha conta' : 'Fazer login'}
        >
          {usuario ? usuario.nome.charAt(0).toUpperCase() : 'AU'}
        </Link>

        {usuario && (
          <button className="logout-button" onClick={sair} type="button">
            Sair
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
