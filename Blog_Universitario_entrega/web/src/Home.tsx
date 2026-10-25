import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { useAuth } from './AuthContext';

const Home: React.FC = () => {
  const { usuario } = useAuth();
  return (
    <div className="app-container">

      {/* Cabeçalho */}
      <header className="header">

        <div className="logo-container">
          <div className="star-icon">★</div>
          <h1>UNIV.BLOG</h1>
        </div>

        <nav className="nav-menu">
          <Link to="/" className="nav-btn active">
            HOME
          </Link>

          <Link to="/sobre" className="nav-btn">
            SOBRE NÓS
          </Link>

          <Link to="/sos-aluno" className="nav-btn">
            SOS ALUNO
          </Link>

          {usuario?.perfil === 'admin' && <Link to="/admin/produtos" className="nav-btn">ADMIN</Link>}

          <button
            type="button"
            className="nav-btn"
            onClick={() => window.location.assign('/forum')}
          >
            FÓRUM
          </button>
        </nav>

        <Link to={usuario ? (usuario.perfil === 'admin' ? '/admin/produtos' : '/sos-aluno') : '/login'} className="user-profile" aria-label="Entrar na minha conta" title="Minha conta">
          <span>{usuario ? usuario.nome.charAt(0).toUpperCase() : 'AU'}</span>
        </Link>

      </header>

      {/* Conteúdo Principal */}
      <main className="main-content">

        <div className="content-wrapper">

          {/* Coluna da Esquerda */}
          <section className="text-section">

            <h2 className="pre-title">
              SUA VIDA NA
            </h2>

            <div className="content-card">

              <h3 className="card-title">
                UNIVERSIDADE...
              </h3>

              <div className="card-text">

                <p>
                  Será uma fase cheia de descobertas, desafios e, claro,
                  muitos momentos inesquecíveis.
                </p>

                <p>
                  Não se resume apenas a assistir às aulas, fazer trabalhos
                  e estudar para provas, mas também envolve conhecer pessoas
                  novas, fazer amizades, participar de atividades e aprender
                  coisas que vão muito além dos livros.
                </p>

                <p>
                  É um período em que começamos a ter mais responsabilidade
                  e liberdade para fazer nossas próprias escolhas, enquanto
                  descobrimos melhor quem somos e o que queremos para o futuro.
                </p>

                <p>
                  Entre correria, trabalhos de última hora, risadas e alguns
                  momentos de estresse, a universidade acaba sendo uma
                  experiência que contribui tanto para nossa formação
                  profissional quanto para nosso crescimento pessoal.
                </p>

              </div>

              <div className="card-button-placeholder"></div>

            </div>

          </section>

          {/* Coluna da Direita */}
          <section className="image-section">

            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85"
              alt="Estudante olhando para a sala de aula"
              className="hero-image"
            />

          </section>

        </div>

      </main>

    </div>
  );
};

export default Home;