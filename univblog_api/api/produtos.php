<?php
require_once __DIR__ . '/comum.php';
require_once __DIR__ . '/../conexao.php';

$metodo = $_SERVER['REQUEST_METHOD'];
$modoAdmin = isset($_GET['admin']) && $_GET['admin'] === '1';

if ($metodo === 'GET') {
    $pesquisa = isset($_GET['pesquisa']) ? trim($_GET['pesquisa']) : '';
    // A vitrine pública pode listar os produtos, mas a pesquisa/consulta administrativa exige login admin.
    if ($modoAdmin || $pesquisa !== '') exigir_admin();
    $termo = '%' . $pesquisa . '%';

    if ($modoAdmin) {
        $sql = 'SELECT id_prod, prod_desc, prod_cat, prod_compra, prod_venda, prod_qnt_est FROM cad_produtos WHERE prod_desc LIKE ? OR prod_cat LIKE ? ORDER BY prod_desc ASC';
        $stmt = $conexao->prepare($sql);
        if (!$stmt) responder_json(array('erro' => 'Não foi possível preparar a pesquisa.'), 500);
        $stmt->bind_param('ss', $termo, $termo);
        $stmt->execute();
        $stmt->bind_result($id, $desc, $cat, $compra, $venda, $estoque);
        $produtos = array();
        while ($stmt->fetch()) {
            $produtos[] = array('id_prod' => (int)$id, 'prod_desc' => $desc, 'prod_cat' => $cat, 'prod_compra' => (float)$compra, 'prod_venda' => (float)$venda, 'prod_qnt_est' => (int)$estoque);
        }
    } else {
        $sql = 'SELECT id_prod, prod_desc, prod_cat, prod_venda, prod_qnt_est FROM cad_produtos ORDER BY prod_desc ASC';
        $stmt = $conexao->prepare($sql);
        if (!$stmt) responder_json(array('erro' => 'Não foi possível carregar os produtos.'), 500);
        $stmt->execute();
        $stmt->bind_result($id, $desc, $cat, $venda, $estoque);
        $produtos = array();
        while ($stmt->fetch()) {
            $produtos[] = array('id_prod' => (int)$id, 'prod_desc' => $desc, 'prod_cat' => $cat, 'prod_venda' => (float)$venda, 'prod_qnt_est' => (int)$estoque);
        }
    }
    $stmt->close();
    responder_json($produtos, 200);
}

if ($metodo === 'POST') {
    exigir_admin();
    $dados = ler_corpo_json();
    $desc = isset($dados['prod_desc']) ? trim($dados['prod_desc']) : '';
    $cat = isset($dados['prod_cat']) ? trim($dados['prod_cat']) : '';
    $compra = isset($dados['prod_compra']) && is_numeric($dados['prod_compra']) ? (float)$dados['prod_compra'] : -1;
    $venda = isset($dados['prod_venda']) && is_numeric($dados['prod_venda']) ? (float)$dados['prod_venda'] : -1;
    $estoque = isset($dados['prod_qnt_est']) ? filter_var($dados['prod_qnt_est'], FILTER_VALIDATE_INT) : false;

    if ($desc === '' || $cat === '' || strlen($desc) > 150 || strlen($cat) > 80 || $compra < 0 || $venda < 0 || $estoque === false || $estoque < 0) {
        responder_json(array('erro' => 'Dados inválidos. Confira descrição, categoria, valores e estoque.'), 400);
    }
    $stmt = $conexao->prepare('INSERT INTO cad_produtos (prod_desc, prod_cat, prod_compra, prod_venda, prod_qnt_est) VALUES (?, ?, ?, ?, ?)');
    if (!$stmt) responder_json(array('erro' => 'Não foi possível preparar o cadastro do produto.'), 500);
    $stmt->bind_param('ssddi', $desc, $cat, $compra, $venda, $estoque);
    if (!$stmt->execute()) {
        $stmt->close();
        responder_json(array('erro' => 'Não foi possível cadastrar. Confira se já existe um produto com essa descrição.'), 409);
    }
    $id = $conexao->insert_id;
    $stmt->close();
    responder_json(array('sucesso' => true, 'id_prod' => (int)$id, 'mensagem' => 'Produto cadastrado com sucesso.'), 201);
}

responder_json(array('erro' => 'Método não permitido.'), 405);
?>
