<?php
// Ajuste estes dados para os mesmos valores usados pela sua instalação do USBWebServer.
$servidor = '127.0.0.1';
$usuario = 'root';
$senha = 'usbw';
$banco = 'cadastro_produtos';

$conexao = @new mysqli($servidor, $usuario, $senha, $banco);
if ($conexao->connect_errno) {
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(500);
    }
    echo json_encode(array('erro' => 'Falha ao conectar ao MySQL. Confira univblog_api/conexao.php.'));
    exit;
}
if (!$conexao->set_charset('utf8mb4')) {
    $conexao->set_charset('utf8');
}
?>
