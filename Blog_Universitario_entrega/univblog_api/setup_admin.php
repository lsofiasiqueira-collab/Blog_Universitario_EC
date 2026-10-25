<?php
require_once __DIR__ . '/conexao.php';

// Inicialização local: bloqueia acessos vindos de outros computadores.
$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';
if ($ip !== '127.0.0.1' && $ip !== '::1') {
    http_response_code(403);
    exit('Este assistente só pode ser aberto localmente no computador do USBWebServer.');
}

$consulta = $conexao->query("SELECT COUNT(*) AS total FROM usuarios WHERE perfil = 'admin'");
$linha = $consulta ? $consulta->fetch_assoc() : array('total' => 0);
$existeAdmin = (int)$linha['total'] > 0;
$mensagem = '';
$sucesso = false;

if (!$existeAdmin && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = isset($_POST['nome']) ? trim($_POST['nome']) : 'Administrador';
    $login = isset($_POST['login']) ? strtolower(trim($_POST['login'])) : '';
    $senha = isset($_POST['senha']) ? (string)$_POST['senha'] : '';

    if ($nome === '' || $login === '' || $senha === '') {
        $mensagem = 'Preencha todos os campos.';
    } else {
        $perfil = 'admin';
        $stmt = $conexao->prepare('INSERT INTO usuarios (nome, login, senha, perfil) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('ssss', $nome, $login, $senha, $perfil);
        if ($stmt->execute()) {
            $existeAdmin = true;
            $sucesso = true;
            $mensagem = 'Administrador criado. Apague o arquivo setup_admin.php agora, por segurança.';
        } else {
            $mensagem = 'Não foi possível criar o administrador. O login pode já estar cadastrado.';
        }
        $stmt->close();
    }
}
?>
<!doctype html>
<html lang="pt-br">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Configurar administrador • UNIV.BLOG</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:20px;background:#f8f5ee;font-family:Arial,sans-serif;color:#765313}.card{width:min(100%,460px);padding:30px;border-radius:18px;background:#fff;box-shadow:0 12px 35px #0002;border:1px solid #e8ddc8}.brand{display:inline-block;padding:8px 12px;background:#efa624;color:#000;font-weight:900;border-radius:8px}.card h1{font-size:25px;margin:18px 0 8px}.card p{font-size:13px;line-height:1.6}label{display:block;margin:14px 0 6px;font-size:12px;font-weight:bold}input{width:100%;padding:12px;border:1px solid #d8c8a7;border-radius:8px}button{width:100%;margin-top:20px;padding:13px;border:0;border-radius:8px;background:#efa624;color:#000;font-weight:900;cursor:pointer}.msg{padding:12px;border-radius:8px;font-size:12px;line-height:1.5;background:#fff0ee;color:#a33225}.ok{background:#eaf8ee;color:#206a36}
</style></head><body><main class="card"><span class="brand">UNIV.BLOG</span><h1>Configurar administrador</h1>
<?php if ($existeAdmin) { ?><p>Já existe uma conta de administrador. Apague o arquivo <strong>setup_admin.php</strong> e entre pela tela de login do site.</p><?php } else { ?>
<p>Crie a primeira conta administrativa do site. Este formulário só pode ser aberto localmente no computador que executa o USBWebServer.</p>
<?php if ($mensagem !== '') { ?><div class="msg <?php echo $sucesso ? 'ok' : ''; ?>"><?php echo htmlspecialchars($mensagem, ENT_QUOTES, 'UTF-8'); ?></div><?php } ?>
<form method="post"><label for="nome">Nome</label><input id="nome" name="nome" maxlength="120" required><label for="login">Login (e-mail)</label><input id="login" name="login" type="email" maxlength="190" required><label for="senha">Senha</label><input id="senha" name="senha" type="password" required><button type="submit">Criar administrador</button></form>
<?php } ?><p><strong>Nota:</strong> este projeto foi configurado para guardar senhas em texto puro conforme solicitado. Não use senhas reais ou reutilizadas.</p></main></body></html>
