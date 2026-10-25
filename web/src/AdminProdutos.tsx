import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import './AdminProdutos.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost/univblog_api/api';
type ProdutoAdmin = { id_prod: number; prod_desc: string; prod_cat: string; prod_compra: number | string; prod_venda: number | string; prod_qnt_est: number | string };
const moeda = (valor: number | string) => Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const AdminProdutos: React.FC = () => {
  const [pesquisa, setPesquisa] = useState('');
  const [produtos, setProdutos] = useState<ProdutoAdmin[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [compra, setCompra] = useState('');
  const [venda, setVenda] = useState('');
  const [estoque, setEstoque] = useState('0');

  const buscarProdutos = useCallback(async (termo: string) => {
    setCarregando(true); setErro('');
    try {
      const url = new URL(`${API_BASE}/produtos.php`);
      url.searchParams.set('admin', '1');
      url.searchParams.set('pesquisa', termo);
      const resposta = await fetch(url, { credentials: 'include' });
      const dados = await resposta.json();
      if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível pesquisar produtos.');
      setProdutos(Array.isArray(dados) ? dados : []);
    } catch (e) { setErro(e instanceof Error ? e.message : 'Erro ao pesquisar produtos.'); }
    finally { setCarregando(false); }
  }, []);

  useEffect(() => { void buscarProdutos(''); }, [buscarProdutos]);

  const cadastrarProduto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setErro(''); setSucesso('');
    const dados = {
      prod_desc: descricao.trim(), prod_cat: categoria.trim(),
      prod_compra: Number(compra), prod_venda: Number(venda), prod_qnt_est: Number(estoque),
    };
    if (!dados.prod_desc || !dados.prod_cat || !compra || !venda || !estoque || dados.prod_compra < 0 || dados.prod_venda < 0 || dados.prod_qnt_est < 0 || !Number.isInteger(dados.prod_qnt_est)) {
      setErro('Preencha todos os campos com valores válidos. O estoque deve ser um número inteiro igual ou maior que zero.'); return;
    }
    try {
      const resposta = await fetch(`${API_BASE}/produtos.php`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados),
      });
      const resultado = await resposta.json();
      if (!resposta.ok) throw new Error(resultado.erro || 'Não foi possível cadastrar o produto.');
      setSucesso('Produto cadastrado com sucesso no banco de dados.');
      setDescricao(''); setCategoria(''); setCompra(''); setVenda(''); setEstoque('0');
      await buscarProdutos(pesquisa);
    } catch (e) { setErro(e instanceof Error ? e.message : 'Erro ao cadastrar produto.'); }
  };

  return (
    <div className="app-page">
      <Header />
      <main className="admin-products-page">
        <div className="admin-products-container">
          <div className="admin-products-hero">
            <div className="admin-badge">ÁREA RESTRITA • ADMINISTRADOR</div>
            <h1>GESTÃO DE PRODUTOS</h1>
            <p>Cadastre e pesquise os materiais universitários exibidos na vitrine SOS Aluno.</p>
          </div>

          <div className="admin-info-strip"><span>🔒</span><div><strong>Acesso administrativo</strong><p>Somente contas com perfil de administrador podem cadastrar ou pesquisar pela ferramenta de gestão. Nenhuma compra é processada nesta demonstração.</p></div></div>

          <div className="admin-products-grid">
            <section className="admin-panel">
              <div className="admin-panel-heading"><span className="admin-panel-icon">＋</span><div><h2>Adicionar produto</h2><p>Os dados serão gravados no MySQL.</p></div></div>
              <form className="admin-product-form" onSubmit={cadastrarProduto}>
                <label htmlFor="prod-desc">Nome / descrição do produto</label>
                <input id="prod-desc" value={descricao} onChange={e => setDescricao(e.target.value)} maxLength={150} required />
                <label htmlFor="prod-cat">Categoria</label>
                <input id="prod-cat" value={categoria} onChange={e => setCategoria(e.target.value)} maxLength={80} required />
                <div className="admin-form-row">
                  <div><label htmlFor="prod-compra">Valor de compra (R$)</label><input id="prod-compra" type="number" min="0" step="0.01" value={compra} onChange={e => setCompra(e.target.value)} required /></div>
                  <div><label htmlFor="prod-venda">Valor de venda (R$)</label><input id="prod-venda" type="number" min="0" step="0.01" value={venda} onChange={e => setVenda(e.target.value)} required /></div>
                </div>
                <label htmlFor="prod-estoque">Quantidade em estoque</label>
                <input id="prod-estoque" type="number" min="0" step="1" value={estoque} onChange={e => setEstoque(e.target.value)} required />
                {erro && <p className="admin-alert admin-alert-error" role="alert">{erro}</p>}
                {sucesso && <p className="admin-alert admin-alert-success" role="status">{sucesso}</p>}
                <button className="gold-button admin-submit" type="submit">Cadastrar produto</button>
              </form>
            </section>

            <section className="admin-panel admin-search-panel">
              <div className="admin-panel-heading"><span className="admin-panel-icon">⌕</span><div><h2>Pesquisar produtos</h2><p>Busque por nome ou categoria.</p></div></div>
              <form className="admin-search-form" onSubmit={e => { e.preventDefault(); void buscarProdutos(pesquisa); }}>
                <input aria-label="Pesquisar produto ou categoria" placeholder="Ex.: caderno, papelaria..." value={pesquisa} onChange={e => setPesquisa(e.target.value)} />
                <button className="gold-button" type="submit">Pesquisar</button>
              </form>
              {carregando && <p className="admin-empty">Carregando produtos...</p>}
              {!carregando && !erro && produtos.length === 0 && <p className="admin-empty">Nenhum produto encontrado.</p>}
              <div className="admin-table-wrap">
                {produtos.length > 0 && <table className="admin-products-table"><thead><tr><th>Produto</th><th>Categoria</th><th>Compra</th><th>Venda</th><th>Estoque</th></tr></thead><tbody>
                  {produtos.map(p => <tr key={p.id_prod}><td>{p.prod_desc}</td><td>{p.prod_cat}</td><td>{moeda(p.prod_compra)}</td><td>{moeda(p.prod_venda)}</td><td>{p.prod_qnt_est}</td></tr>)}
                </tbody></table>}
              </div>
              <p className="admin-results-count">{produtos.length} produto(s) nesta pesquisa.</p>
            </section>
          </div>
          <div className="admin-footer-links"><Link to="/sos-aluno">Ver vitrine pública</Link><span>•</span><Link to="/">Voltar à página inicial</Link></div>
        </div>
      </main>
    </div>
  );
};

export default AdminProdutos;
