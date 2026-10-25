import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  estoque?: number;
}

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

export type PerfilUsuario = 'cliente' | 'admin';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
}

interface AuthResponse {
  sucesso?: boolean;
  erro?: string;
  usuario?: Usuario;
}

interface AuthType {
  usuario: Usuario | null;
  carregandoSessao: boolean;
  carrinho: ItemCarrinho[];
  cadastrar: (nome: string, email: string, senha: string) => Promise<boolean>;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
  adicionar: (produto: Produto) => void;
  remover: (id: number) => void;
  alterarQuantidade: (id: number, quantidade: number) => void;
  limparCarrinho: () => void;
}

const AuthContext = createContext<AuthType | undefined>(undefined);
const CARRINHO = 'univblog_carrinho';
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost/univblog_api/api'}/auth.php`;

function ler<T>(chave: string, padrao: T): T {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) as T : padrao;
  } catch {
    return padrao;
  }
}

async function requisicaoAuth(acao: string, dados?: Record<string, string>): Promise<AuthResponse> {
  const url = `${API_URL}?acao=${encodeURIComponent(acao)}`;
  const resposta = await fetch(url, {
    method: dados ? 'POST' : 'GET',
    credentials: 'include',
    headers: dados ? { 'Content-Type': 'application/json' } : undefined,
    body: dados ? JSON.stringify(dados) : undefined,
  });
  const resultado = await resposta.json() as AuthResponse;
  if (!resposta.ok) throw new Error(resultado.erro || 'Não foi possível comunicar com o servidor.');
  return resultado;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>(() => ler<ItemCarrinho[]>(CARRINHO, []));

  useEffect(() => {
    let ativo = true;
    requisicaoAuth('me')
      .then((resultado) => { if (ativo) setUsuario(resultado.usuario || null); })
      .catch(() => { if (ativo) setUsuario(null); })
      .finally(() => { if (ativo) setCarregandoSessao(false); });
    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(CARRINHO, JSON.stringify(carrinho));
  }, [carrinho]);

  const cadastrar = async (nome: string, email: string, senha: string): Promise<boolean> => {
    try {
      const resultado = await requisicaoAuth('cadastrar', { nome, login: email, senha });
      if (!resultado.usuario) return false;
      setUsuario(resultado.usuario);
      return true;
    } catch {
      return false;
    }
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const resultado = await requisicaoAuth('login', { login: email, senha });
      if (!resultado.usuario) return false;
      setUsuario(resultado.usuario);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try { await requisicaoAuth('logout', {}); } catch { /* encerra a sessão visual mesmo se o servidor falhar */ }
    setUsuario(null);
  };

  const adicionar = (produto: Produto) => {
    setCarrinho((atual) => {
      const existente = atual.find((item) => item.produto.id === produto.id);
      if (existente) {
        return atual.map((item) => item.produto.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 } : item);
      }
      return [...atual, { produto, quantidade: 1 }];
    });
  };

  const remover = (id: number) => setCarrinho((atual) => atual.filter((item) => item.produto.id !== id));

  const alterarQuantidade = (id: number, quantidade: number) => {
    if (quantidade <= 0) { remover(id); return; }
    setCarrinho((atual) => atual.map((item) => item.produto.id === id ? { ...item, quantidade } : item));
  };

  const limparCarrinho = () => setCarrinho([]);

  return (
    <AuthContext.Provider value={{ usuario, carregandoSessao, carrinho, cadastrar, login, logout, adicionar, remover, alterarQuantidade, limparCarrinho }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return contexto;
}
