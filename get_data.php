<?php
header('Content-Type: application/json');

$filePath = 'data/rifa_data.json';

if (file_exists($filePath)) {
    $data = file_get_contents($filePath);
    echo $data;
} else {
    echo json_encode(['participants' => [], 'winners' => []]);
}
?>