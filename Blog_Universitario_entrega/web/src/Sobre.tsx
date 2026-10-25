
import React from 'react';
import Header from './Header';
import './Sobre.css';

const Sobre: React.FC = () => {
  return (
    <div className="page-container">
      <Header />

      <main className="main-content">
        <div className="content-overlay">
          <div className="left-column">
            <h2 className="section-title">BASICAMENTE</h2>

            <div className="info-card">
              <p className="highlight-text">
                <strong>
                  Somos um blog feito por universitários, para universitários.
                </strong>
              </p>

              <p>
                Aqui, a vida acadêmica vai muito além da sala de aula.
                Falamos sobre faculdade, estudos, carreira, oportunidades,
                experiências, desafios e tudo aquilo que faz parte da jornada
                universitária.
              </p>

              <p>
                <strong>Nosso objetivo</strong> é criar um espaço de informação,
                troca e identificação, onde estudantes possam encontrar
                conteúdos úteis, descobrir novas oportunidades e também se
                reconhecer nas histórias e experiências de outros universitários.
              </p>

              <p>
                <strong>Acreditamos</strong> que a universidade é uma fase de
                descobertas — e que ninguém precisa passar por ela sozinho.
              </p>

              <p>
                <strong>
                  Este é o nosso espaço para aprender, compartilhar e crescer juntos.
                </strong>
              </p>

              <div className="action-button" />
            </div>
          </div>

          <div className="right-column">
            <div className="image-frame">
              <div className="image-overlay-text">
                <span className="text-sobre">SOBRE</span>
                <span className="text-nos">NÓS</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sobre;
