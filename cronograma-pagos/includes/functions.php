<?php
// Archivo: includes/functions.php
require_once 'config.php';

function obtenerCronograma() {
    global $conn;
    $stmt = $conn->query("SELECT * FROM dias_cronograma ORDER BY fecha ASC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function inicializarCronograma($fecha_inicio, $total_dias, $excluir_domingo = true) {
    global $conn;
    
    // Limpiar tabla existente
    $conn->exec("TRUNCATE TABLE dias_cronograma");
    
    $fecha_actual = new DateTime($fecha_inicio);
    $dias_agregados = 0;
    
    while ($dias_agregados < $total_dias) {
        if (!$excluir_domingo || $fecha_actual->format('N') != 7) {
            $fecha = $fecha_actual->format('Y-m-d');
            $dia_semana = $fecha_actual->format('l');
            
            $stmt = $conn->prepare("INSERT INTO dias_cronograma (fecha, dia_semana, estado) VALUES (?, ?, 'pendiente')");
            $stmt->execute([$fecha, $dia_semana]);
            
            $dias_agregados++;
        }
        $fecha_actual->add(new DateInterval('P1D'));
    }
    
    // Guardar configuración
    $stmt = $conn->prepare("INSERT INTO configuracion (fecha_inicio, total_dias, excluir_domingo) VALUES (?, ?, ?)
                            ON DUPLICATE KEY UPDATE fecha_inicio = VALUES(fecha_inicio), total_dias = VALUES(total_dias), excluir_domingo = VALUES(excluir_domingo)");
    $stmt->execute([$fecha_inicio, $total_dias, $excluir_domingo ? 1 : 0]);
}
?>