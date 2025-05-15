<?php
// Archivo: public/index.php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/styles.php';

$dias = obtenerCronograma();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cronograma de Pagos</title>
</head>
<body class="bg-[#0D0D0D] p-2 sm:p-4 md:p-6">
    <div class="max-w-4xl mx-auto bg-[#F2F2F2] p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
        <h1 class="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-[#0D0D0D]">Cronograma de Pagos</h1>
        <p class="text-center text-sm sm:text-base md:text-lg text-[#0D0D0D] mt-2">
            Prestataria: <strong>MIRTHA LILIANA SALGADO CACERES</strong>
        </p>

        <?php
        $total = count($dias);
        $pagados = count(array_filter($dias, fn($d) => $d['estado'] == 'pagado'));
        $pendientes = $total - $pagados;
        ?>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 sm:mt-6 mb-4 sm:mb-6">
            <div class="bg-white p-2 sm:p-3 rounded-lg shadow text-center">
                <div class="text-lg sm:text-xl md:text-2xl font-bold"><?= $total ?></div>
                <div class="text-xs sm:text-sm">Total días</div>
            </div>
            <div class="bg-green-100 p-2 sm:p-3 rounded-lg shadow text-center">
                <div class="text-lg sm:text-xl md:text-2xl font-bold"><?= $pagados ?></div>
                <div class="text-xs sm:text-sm">Pagados</div>
            </div>
            <div class="bg-red-100 p-2 sm:p-3 rounded-lg shadow text-center">
                <div class="text-lg sm:text-xl md:text-2xl font-bold"><?= $pendientes ?></div>
                <div class="text-xs sm:text-sm">Pendientes</div>
            </div>
        </div>

        <div class="mt-4 sm:mt-6">
            <h2 class="text-base sm:text-lg md:text-xl font-semibold text-[#0D0D0D] mb-2 sm:mb-3">Tabla de Pagos</h2>
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
                                <span class="inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium 
                                    <?= $dia['estado'] == 'pagado' ? 'bg-green-500 text-white' : 'bg-red-500 text-white' ?>">
                                    <?= $dia['estado'] == 'pagado' ? 'Pagado' : 'Pendiente' ?>
                                </span>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>