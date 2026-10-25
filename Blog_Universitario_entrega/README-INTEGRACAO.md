# UNIV.BLOG — integração React + PHP + MySQL

Esta versão mantém o front-end React/Vite e acrescenta uma API PHP para autenticação e gestão de produtos no banco `cadastro_produtos`.

## O que foi incluído

- Cadastro de clientes integrado à tabela `usuarios` no MySQL.
- Login e logout usando sessão PHP no servidor.
- Perfil `cliente` atribuído automaticamente a qualquer cadastro público.
- Página administrativa em `/admin/produtos`, com cadastro e pesquisa de produtos.
- Proteção de rota no React e, principalmente, validação de sessão/perfil no PHP antes de pesquisar ou inserir produtos.
- A vitrine SOS Aluno continua podendo listar produtos. A ferramenta de pesquisa administrativa exige login de administrador.
- O carrinho continua demonstrativo: não cria pedido, não reserva estoque e não processa pagamento.
- Senhas em texto puro conforme pedido. **Isso é inseguro**; use somente para demonstração local, com senhas fictícias e nunca reutilizadas.

## 1. Instalar a tabela de usuários sem apagar os produtos

1. Inicie Apache e MySQL pelo USBWebServer.
2. Abra o phpMyAdmin do USBWebServer.
3. Importe o arquivo `univblog_api/sql_instalacao.sql`.
4. O script usa o banco `cadastro_produtos`, preserva a tabela `cad_produtos` existente e cria a tabela `usuarios`.

A tabela `usuarios` tem `id_usuario`, `nome`, `login`, `senha`, `perfil` e `criado_em`. O campo `perfil` diferencia `cliente` e `admin`. Os cadastros feitos pelo site recebem sempre o perfil `cliente`.

## 2. Colocar a API no USBWebServer

1. Copie a pasta `univblog_api` para a pasta `root` do USBWebServer. O caminho esperado será, por exemplo, `USBWebServer/root/univblog_api/`.
2. Confira `univblog_api/conexao.php`. O padrão deste projeto é:
   - servidor: `127.0.0.1`
   - usuário: `root`
   - senha: `usbw`
   - banco: `cadastro_produtos`
3. Se sua instalação usar credenciais diferentes, altere esses valores no arquivo.
4. Teste a API acessando `http://localhost/univblog_api/api/produtos.php`. Deve retornar uma lista JSON (ou `[]` se não houver produtos).

Se o Apache do USBWebServer usar outra porta ou outro caminho, ajuste também o endereço em `web/.env`.

## 3. Criar a primeira conta de administrador

1. Com o USBWebServer ativo e depois de importar o SQL, abra `http://localhost/univblog_api/setup_admin.php` no mesmo computador.
2. Preencha nome, login/e-mail e senha para criar a primeira conta de administrador.
3. **Depois que a conta for criada, apague `setup_admin.php` da pasta `univblog_api`.** O arquivo só permite acesso local e deixa de criar contas quando já existe um administrador, mas deve ser removido.
4. Entre no site pela tela de login usando as credenciais administrativas. O login de administrador abrirá a área de produtos e mostrará o botão ADMIN no cabeçalho.

Não existe cadastro público de administrador. Todo cadastro realizado pela página de cadastro recebe `perfil = 'cliente'`.

## 4. Executar o React

1. Abra um terminal na pasta `web`.
2. Crie o arquivo `.env` copiando `.env.example` e confira o valor `VITE_API_URL`.
3. Instale as dependências e inicie o Vite:

```bash
npm install
npm run dev
```

4. Abra o endereço que o Vite mostrar, normalmente `http://localhost:5173`.

A API PHP permite CORS para `http://localhost:5173` e `http://127.0.0.1:5173`. Se o front-end for executado em outra origem, atualize a lista em `univblog_api/api/comum.php`.

## 5. Como funciona a restrição administrativa

- A página React `/admin/produtos` redireciona clientes para a vitrine.
- `api/produtos.php` exige uma sessão com `perfil = 'admin'` para pesquisa administrativa (`?admin=1`) e para cadastrar produtos (`POST`).
- Tentar chamar diretamente o endpoint sem sessão administrativa retorna erro HTTP 401/403; esconder o link no menu não é a única proteção.

## Observação sobre senhas em texto puro

A implementação compara a senha digitada com o valor guardado na coluna `senha`, sem hash, porque isso foi solicitado. Essa prática permite que qualquer pessoa que obtenha acesso ao banco veja as senhas. Para um sistema real, o correto é usar `password_hash()` e `password_verify()` e HTTPS.
