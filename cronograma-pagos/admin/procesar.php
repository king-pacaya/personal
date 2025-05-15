<?php
// Archivo: admin/procesar.php
require_once '../includes/config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['id'], $_POST['estado'])) {
    $id = $_POST['id'];
    $estado = $_POST['estado'];
    
    // Validar que el estado sea uno de los permitidos
    if (in_array($estado, ['pendiente', 'pagado'])) {
        $stmt = $conn->prepare("UPDATE dias_cronograma SET estado = ? WHERE id = ?");
        $stmt->execute([$estado, $id]);
    }
}

header("Location: index.php");
exit;
?>