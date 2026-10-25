<?php
$origem = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
$origensPermitidas = array('http://localhost:5173', 'http://127.0.0.1:5173');
if (in_array($origem, $origensPermitidas, true)) {
    header('Access-Control-Allow-Origin: ' . $origem);
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function responder_json($dados, $status) {
    http_response_code($status);
    echo json_encode($dados);
    exit;
}

function ler_corpo_json() {
    $texto = file_get_contents('php://input');
    $dados = json_decode($texto, true);
    return is_array($dados) ? $dados : array();
}

function exigir_admin() {
    if (!isset($_SESSION['usuario'])) {
        responder_json(array('erro' => 'Faça login para continuar.'), 401);
    }
    if (!isset($_SESSION['usuario']['perfil']) || $_SESSION['usuario']['perfil'] !== 'admin') {
        responder_json(array('erro' => 'Acesso permitido somente ao administrador.'), 403);
    }
}
?>
