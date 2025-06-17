<?php
header('Content-Type: application/json');

// Verifica se o diretório existe, se não, cria
if (!file_exists('data')) {
    mkdir('data', 0755, true);
}

$data = json_decode(file_get_contents('php://input'), true);

if ($data === null) {
    echo json_encode(['success' => false, 'error' => 'Dados inválidos']);
    exit;
}

// Salva os dados em um arquivo JSON
$filePath = 'data/rifa_data.json';
$result = file_put_contents($filePath, json_encode($data));

if ($result === false) {
    echo json_encode(['success' => false, 'error' => 'Erro ao salvar dados']);
} else {
    echo json_encode(['success' => true]);
}
?>