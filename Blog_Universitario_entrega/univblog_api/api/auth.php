<?php
require_once __DIR__ . '/comum.php';
require_once __DIR__ . '/../conexao.php';

$acao = isset($_GET['acao']) ? $_GET['acao'] : '';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $acao === 'me') {
    responder_json(array('usuario' => isset($_SESSION['usuario']) ? $_SESSION['usuario'] : null), 200);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder_json(array('erro' => 'Método não permitido.'), 405);
}
$dados = ler_corpo_json();

if ($acao === 'cadastrar') {
    $nome = isset($dados['nome']) ? trim($dados['nome']) : '';
    $login = isset($dados['login']) ? strtolower(trim($dados['login'])) : '';
    $senha = isset($dados['senha']) ? (string)$dados['senha'] : '';

    if ($nome === '' || $login === '' || $senha === '' || strlen($senha) < 6) {
        responder_json(array('erro' => 'Informe nome, login e senha com pelo menos 6 caracteres.'), 400);
    }

    $consulta = $conexao->prepare('SELECT id_usuario FROM usuarios WHERE login = ? LIMIT 1');
    if (!$consulta) responder_json(array('erro' => 'Não foi possível validar o login.'), 500);
    $consulta->bind_param('s', $login);
    $consulta->execute();
    $consulta->store_result();
    $existe = $consulta->num_rows > 0;
    $consulta->close();
    if ($existe) responder_json(array('erro' => 'Este login já está cadastrado.'), 409);

    // Todo cadastro feito pelo site recebe perfil cliente. O formulário não aceita perfil enviado pelo navegador.
    $perfil = 'cliente';
    $inserir = $conexao->prepare('INSERT INTO usuarios (nome, login, senha, perfil) VALUES (?, ?, ?, ?)');
    if (!$inserir) responder_json(array('erro' => 'Não foi possível preparar o cadastro.'), 500);
    $inserir->bind_param('ssss', $nome, $login, $senha, $perfil);
    if (!$inserir->execute()) {
        $inserir->close();
        responder_json(array('erro' => 'Não foi possível criar a conta.'), 500);
    }
    $id = $conexao->insert_id;
    $inserir->close();
    session_regenerate_id(true);
    $_SESSION['usuario'] = array('id' => (int)$id, 'nome' => $nome, 'email' => $login, 'perfil' => 'cliente');
    responder_json(array('sucesso' => true, 'usuario' => $_SESSION['usuario']), 201);
}

if ($acao === 'login') {
    $login = isset($dados['login']) ? strtolower(trim($dados['login'])) : '';
    $senhaInformada = isset($dados['senha']) ? (string)$dados['senha'] : '';
    if ($login === '' || $senhaInformada === '') responder_json(array('erro' => 'Informe login e senha.'), 400);

    $consulta = $conexao->prepare('SELECT id_usuario, nome, login, senha, perfil FROM usuarios WHERE login = ? LIMIT 1');
    if (!$consulta) responder_json(array('erro' => 'Não foi possível consultar o usuário.'), 500);
    $consulta->bind_param('s', $login);
    $consulta->execute();
    $consulta->bind_result($id, $nome, $loginBanco, $senhaBanco, $perfilBanco);
    $encontrado = $consulta->fetch();
    $consulta->close();

    if (!$encontrado || $senhaInformada !== $senhaBanco) {
        responder_json(array('erro' => 'Login ou senha incorretos.'), 401);
    }

    session_regenerate_id(true);
    $_SESSION['usuario'] = array('id' => (int)$id, 'nome' => $nome, 'email' => $loginBanco, 'perfil' => $perfilBanco);
    responder_json(array('sucesso' => true, 'usuario' => $_SESSION['usuario']), 200);
}

if ($acao === 'logout') {
    $_SESSION = array();
    if (ini_get('session.use_cookies')) {
        $parametros = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $parametros['path'], $parametros['domain'], $parametros['secure'], $parametros['httponly']);
    }
    session_destroy();
    responder_json(array('sucesso' => true), 200);
}

responder_json(array('erro' => 'Ação não reconhecida.'), 400);
?>
