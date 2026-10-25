
import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { useAuth } from './AuthContext';
import './App.css';

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const Carrinho: React.FC = () => {
  const {
    usuario,
    carrinho,
    remover,
    alterarQuantidade,
    limparCarrinho,
  } = useAuth();

  const total = carrinho.reduce(
    (soma, item) => soma + item.produto.preco * item.quantidade,
    0
  );

  if (!usuario) {
    return (
      <div className="app-page">
        <Header />

        <main className="cart-page">
          <section className="empty-cart">
            <h1>Entre na sua conta</h1>
            <p>Faça login para acessar seu carrinho.</p>
            <Link to="/login?redirect=/carrinho" className="gold-button">
              Fazer login
            </Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-page">
      <Header />

      <main className="cart-page">
        <div className="cart-container">
          <div className="cart-heading">
            <div>
              <h1>MEU CARRINHO</h1>
              <p>Confira os materiais que você selecionou.</p>
            </div>

            <Link to="/sos-aluno" className="back-link">
              Continuar comprando
            </Link>
          </div>

          {carrinho.length === 0 ? (
            <section className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>Seu carrinho está vazio</h2>
              <p>Encontre materiais para acompanhar seus estudos.</p>

              <Link to="/sos-aluno" className="gold-button">
                Explorar produtos
              </Link>
            </section>
          ) : (
            <div className="cart-layout">
              <section className="cart-items">
                {carrinho.map(({ produto, quantidade }) => (
                  <article className="cart-item" key={produto.id}>
                    <img src={produto.imagem} alt={produto.nome} />

                    <div className="cart-item-info">
                      <h2>{produto.nome}</h2>
                      <p>{produto.descricao}</p>
                      <strong>{moeda(produto.preco)}</strong>

                      <div className="quantity-control">
                        <button
                          type="button"
                          aria-label="Diminuir quantidade"
                          onClick={() =>
                            alterarQuantidade(produto.id, quantidade - 1)
                          }
                        >
                          −
                        </button>

                        <span>{quantidade}</span>

                        <button
                          type="button"
                          aria-label="Aumentar quantidade"
                          onClick={() =>
                            alterarQuantidade(produto.id, quantidade + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-end">
                      <strong>{moeda(produto.preco * quantidade)}</strong>

                      <button
                        type="button"
                        className="remove-button"
                        onClick={() => remover(produto.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </article>
                ))}

                <button
                  type="button"
                  className="clear-cart-button"
                  onClick={limparCarrinho}
                >
                  Limpar carrinho
                </button>
              </section>

              <aside className="cart-summary">
                <h2>Resumo do pedido</h2>

                <div className="summary-line">
                  <span>Quantidade de itens</span>
                  <span>
                    {carrinho.reduce(
                      (soma, item) => soma + item.quantidade,
                      0
                    )}
                  </span>
                </div>

                <div className="summary-line summary-total">
                  <span>Total</span>
                  <strong>{moeda(total)}</strong>
                </div>

                <Link
                  to="/sos-aluno"
                  className="gold-button checkout-button"
                >
                  Continuar comprando
                </Link>

                <p className="checkout-note">
                  Esta versão é demonstrativa. O pagamento ainda não está integrado.
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Carrinho;
