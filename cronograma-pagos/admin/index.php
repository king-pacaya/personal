<?php
// Archivo: admin/index.php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/styles.php';

if (isset($_GET['inicializar'])) {
    inicializarCronograma('2024-05-14', 24, true);
    header("Location: index.php");
    exit;
}

$dias = obtenerCronograma();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Cronograma de Pagos</title>
</head>
<body class="bg-[#0D0D0D] p-2 sm:p-4 md:p-6">
    <div class="max-w-6xl mx-auto bg-[#F2F2F2] p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-[#0D0D0D]">Administrar Cronograma de Pagos</h1>
        <p class="text-center text-sm sm:text-base md:text-lg text-[#0D0D0D] mb-3 sm:mb-4 md:mb-6">
            Prestataria: <strong>MIRTHA LILIANA SALGADO CACERES</strong>
        </p>
        
        <div class="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <a href="index.php?inicializar=1" class="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg transition w-full sm:w-auto text-center text-sm sm:text-base">
                <i class="fas fa-sync-alt mr-1 sm:mr-2"></i>Reiniciar Cronograma
            </a>
            <div class="text-xs sm:text-sm text-gray-600 text-center sm:text-right">
                <i class="fas fa-info-circle mr-1"></i> Haz clic en los estados para cambiarlos
            </div>
        </div>
        
        <div class="table-container">
            <table class="responsive-table w-full bg-white rounded-lg overflow-hidden">
                <thead>
                    <tr class="bg-[#0D0D0D] text-[#F2F2F2]">
                        <th class="border border-[#0D0D0D] px-2 sm:px-3 py-1 sm:py-2 text-center text-xs sm:text-sm md:text-base"># Día</th>
                        <th class="border border-[#0D0D0D] px-2 sm:px-3 py-1 sm:py-2 text-center text-xs sm:text-sm md:text-base">Fecha</th>
                        <th class="border border-[#0D0D0D] px-2 sm:px-3 py-1 sm:py-2 text-center text-xs sm:text-sm md:text-base">Día</th>
                        <th class="border border-[#0D0D0D] px-2 sm:px-3 py-1 sm:py-2 text-center text-xs sm:text-sm md:text-base">Estatus</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($dias as $index => $dia): ?>
                    <tr class="hover:bg-gray-50">
                        <td class="border border-gray-200 px-2 sm:px-3 py-1 sm:py-2 text-center text-xs sm:text-sm md:text-base"><?= $index + 1 ?></td>
                        <td class="border border-gray-200 px-2 sm:px-3 py-1 sm:py-2 text-center text-xs sm:text-sm md:text-base"><?= date('d/m/Y', strtotime($dia['fecha'])) ?></td>
                        <td class="border border-gray-200 px-2 sm:px-3 py-1 sm:py-2 text-center text-xs sm:text-sm md:text-base"><?= diaEnEspanol($dia['dia_semana']) ?></td>
                        <td class="border border-gray-200 px-2 sm:px-3 py-1 sm:py-2 text-center text-xs sm:text-sm md:text-base">
                            <form action="procesar.php" method="post" class="flex justify-center gap-1 sm:gap-2">
                                <input type="hidden" name="id" value="<?= $dia['id'] ?>">
                                <button type="submit" name="estado" value="pendiente" 
                                    class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium btn-pendiente <?= $dia['estado'] == 'pendiente' ? 'active' : '' ?>">
                                    Pendiente
                                </button>
                                <button type="submit" name="estado" value="pagado" 
                                    class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium btn-pagado <?= $dia['estado'] == 'pagado' ? 'active' : '' ?>">
                                    Pagado
                                </button>
                            </form>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>