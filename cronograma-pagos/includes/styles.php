<?php
// Archivo: includes/styles.php
?>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet"/>
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap" rel="stylesheet">
<link rel="icon" href="/cronograma-pagos/favicon.svg" type="image/svg+xml">
<style>
  * {
    font-family: 'Montserrat', sans-serif;
  }
  
  /* Estilos para tablas responsivas */
  .table-container {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; /* Suavizado en iOS */
  }
  
  .responsive-table {
    min-width: 100%;
    width: auto;
  }
  
  /* Estilos para botones */
  .btn-pendiente {
    border: 2px solid #EF4444;
    color: #EF4444;
    white-space: nowrap;
  }
  .btn-pendiente.active {
    background-color: #EF4444;
    color: white;
  }
  .btn-pagado {
    border: 2px solid #10B981;
    color: #10B981;
    white-space: nowrap;
  }
  .btn-pagado.active {
    background-color: #10B981;
    color: white;
  }
  
  /* Ajustes para móviles */
  @media (max-width: 640px) {
    .mobile-text {
      font-size: 0.875rem;
    }
    .mobile-px {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
    .mobile-py {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }
  }
</style>
<?php
function diaEnEspanol($diaIngles) {
    $dias = [
        'Monday' => 'Lunes',
        'Tuesday' => 'Martes',
        'Wednesday' => 'Miércoles',
        'Thursday' => 'Jueves',
        'Friday' => 'Viernes',
        'Saturday' => 'Sábado',
        'Sunday' => 'Domingo'
    ];
    return $dias[$diaIngles] ?? $diaIngles;
}
?>