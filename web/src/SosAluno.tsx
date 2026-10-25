import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import { useAuth } from './AuthContext';
import type { Produto } from './AuthContext';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost/univblog_api/api';
const IMAGEM_PADRAO = 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80';
const moeda = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

type ProdutoApi = { id_prod: number | string; prod_desc: string; prod_cat: string; prod_venda: number | string; prod_qnt_est: number | string };

const SosAluno: React.FC = () => {
  const { usuario, adicionar, carrinho } = useAuth();
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;
    fetch(`${API_BASE}/produtos.php`, { credentials: 'include' })
      .then(async (resposta) => {
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível carregar os produtos.');
        if (!Array.isArray(dados)) throw new Error('A API de produtos retornou dados inválidos.');
        return dados as ProdutoApi[];
      })
      .then((dados) => {
        if (!ativo) return;
        setProdutos(dados.map((p) => ({
          id: Number(p.id_prod),
          nome: p.prod_desc,
          descricao: p.prod_cat || 'Material universitário',
          preco: Number(p.prod_venda),
          imagem: IMAGEM_PADRAO,
          estoque: Number(p.prod_qnt_est),
        })));
        setErro('');
      })
      .catch((e: Error) => { if (ativo) setErro(e.message); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, []);

  const comprar = (produto: Produto) => {
    if (!usuario) { navigate('/login?redirect=/sos-aluno'); return; }
    // Carrinho demonstrativo: não cria pedido, não reserva estoque e não processa pagamento.
    adicionar(produto);
    navigate('/carrinho');
  };

  const quantidade = carrinho.reduce((total, item) => total + item.quantidade, 0);

  return (
    <div className="app-page">
      <Header />
      <main className="shop-page">
        <section className="shop-hero-banner">
          <div className="shop-banner-copy">
            <p>TUDO PARA SUA ROTINA UNIVERSITÁRIA</p>
            <h1>SOS ALUNO</h1>
            <span>Materiais para acompanhar sua jornada acadêmica.</span>
          </div>
        </section>
        <div className="shop-subtitle">TUDO QUE VOCÊ PRECISA, A GENTE TEM</div>
        <section className="shop-content">
          <div className="shop-heading">
            <div>
              <h2>Materiais universitários</h2>
              <p>Produtos cadastrados no banco de dados do UNIV.BLOG.</p>
            </div>
            {usuario && <Link to="/carrinho" className="gold-button">🛒 Carrinho ({quantidade})</Link>}
          </div>
          {carregando && <p className="api-message">Carregando produtos...</p>}
          {!carregando && erro && <div className="api-error"><strong>Não foi possível carregar a vitrine.</strong><p>{erro}</p><small>Confira se o USBWebServer está ativo e se VITE_API_URL aponta para a pasta da API.</small></div>}
          {!carregando && !erro && produtos.length === 0 && <div className="api-message">Ainda não há produtos cadastrados.</div>}
          <div className="product-grid">
            {produtos.map((produto) => (
              <article className="product-card" key={produto.id}>
                <img className="product-image" src={produto.imagem} alt={produto.nome} />
                <h3>{produto.nome}</h3>
                <p>{produto.descricao}{produto.estoque !== undefined ? ` • Estoque: ${produto.estoque}` : ''}</p>
                <button className="price-button" type="button" onClick={() => comprar(produto)}>
                  {moeda(produto.preco)} — adicionar ao carrinho
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SosAluno;
