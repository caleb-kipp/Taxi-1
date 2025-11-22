<?php
// webhook.php - simple skeleton to receive provider callbacks
$raw = file_get_contents('php://input');
file_put_contents('webhook.log', date('c') . "\n" . $raw . "\n\n", FILE_APPEND);
http_response_code(200);
echo json_encode(['received'=>true]);
?>