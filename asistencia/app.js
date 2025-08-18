// La constante que define el límite de inasistencias.
const LIMITE_INASISTENCIAS_PORCENTAJE = 0.30;
// La constante que define el número de semanas del ciclo.
const SEMANAS_DEL_CICLO = 16;
// Límite de asistencias virtuales para cursos híbridos.
const LIMITE_ASISTENCIAS_VIRTUALES = 0.50;

// La fecha de inicio del ciclo, que el usuario mencionó en un mensaje previo.
const FECHA_INICIO_CICLO = new Date('2025-08-18T00:00:00');

const container = document.getElementById('clases-container');
const cursoActualContainer = document.getElementById('curso-actual-container');
const noCursoContainer = document.getElementById('no-curso-container');
const cursoActualInfo = document.getElementById('curso-actual-info');
const cursosModal = document.getElementById('cursos-modal');
const menuBtn = document.getElementById('menu-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const editModal = document.getElementById('edit-modal');
const editModalContent = document.getElementById('edit-modal-content');
const closeEditModalBtn = document.getElementById('close-edit-modal-btn');
const shareBtn = document.getElementById('share-btn');
const pasteBtn = document.getElementById('paste-btn');
const pasteModal = document.getElementById('paste-modal');
const closePasteModalBtn = document.getElementById('close-paste-modal-btn');
const jsonInput = document.getElementById('json-input');
const importBtn = document.getElementById('import-btn');
const clearBtn = document.getElementById('clear-btn');
const semanaActualDisplay = document.getElementById('semana-actual-display');

// Simulamos los datos del JSON
const data = {
    "nombre_horario": "Horario de Clases",
    "estudiante": {
        "nombre": "Kraut",
        "carrera": "Software Engineer",
        "universidad": "USIL"
    },
    "cursos": [
        {
            "nombre": "Gerenciamiento de Datos I",
            "dias": ["Martes", "Miércoles"],
            "horario_inicio": "07:00",
            "horario_fin": "08:40",
            "frecuencia_semanal": 2,
            "modalidad": "Remoto",
            "ubicacion_aula": "C1X488"
        },
        {
            "nombre": "Ética y Ciudadanía",
            "dias": ["Martes"],
            "horario_inicio": "09:50",
            "horario_fin": "12:40",
            "frecuencia_semanal": 1,
            "modalidad": "Remoto",
            "ubicacion_aula": "C1X461"
        },
        {
            "nombre": "Física General",
            "dias": ["Martes", "Jueves", "Viernes"],
            "horario_inicio": "15:00",
            "horario_fin": "16:40",
            "frecuencia_semanal": 3,
            "modalidad": "Híbrido",
            "ubicacion_aula": "C2D202"
        },
        {
            "nombre": "Inferencia Estadística",
            "dias": ["Martes", "Jueves"],
            "horario_inicio": "17:00",
            "horario_fin": "18:40",
            "frecuencia_semanal": 2,
            "modalidad": "Híbrido",
            "ubicacion_aula": {
                "Martes": "C2D202",
                "Jueves": "C2A702"
            }
        },
        {
            "nombre": "Reto de Ingeniería",
            "dias": ["Martes"],
            "horario_inicio": "19:00",
            "horario_fin": "22:40",
            "frecuencia_semanal": 1,
            "modalidad": "Presencial",
            "ubicacion_aula": "C2A805"
        },
        {
            "nombre": "Ingeniería de Software I",
            "dias": ["Miércoles"],
            "horario_inicio": "15:00",
            "horario_fin": "18:40",
            "frecuencia_semanal": 1,
            "modalidad": "Híbrido",
            "ubicacion_aula": "C2A504"
        },
        {
            "nombre": "Fundamentos del Método Científico",
            "dias": ["Viernes"],
            "horario_inicio": "17:50",
            "horario_fin": "19:50",
            "frecuencia_semanal": 1,
            "modalidad": "Híbrido",
            "ubicacion_aula": "C2C401"
        }
    ]
};

// Guardamos los datos de asistencia en localStorage
let asistenciasData = JSON.parse(localStorage.getItem('asistencias')) || {};

// Función para obtener el día de la semana y la hora actuales
function getFechaHoraActual() {
    const ahora = new Date();
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diaActual = diasSemana[ahora.getDay()];
    const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    return { diaActual, horaActual };
}

// Función para encontrar el curso que se está dando en este momento
function encontrarCursoActual() {
    const { diaActual, horaActual } = getFechaHoraActual();
    return data.cursos.find(curso => {
        const estaEnDia = curso.dias.includes(diaActual);
        const estaEnHorario = horaActual >= curso.horario_inicio && horaActual <= curso.horario_fin;
        return estaEnDia && estaEnHorario;
    });
}

// Función para calcular la semana actual
function getSemanaActual() {
    const ahora = new Date();
    const diferenciaMs = ahora.getTime() - FECHA_INICIO_CICLO.getTime();
    const semanas = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24 * 7)) + 1;
    return semanas;
}

// Función para renderizar la pantalla principal del curso actual
function renderizarPantallaPrincipal() {
    const cursoActual = encontrarCursoActual();
    semanaActualDisplay.textContent = getSemanaActual();
    if (cursoActual) {
        cursoActualContainer.classList.remove('hidden');
        noCursoContainer.classList.add('hidden');
        renderizarCursoActual(cursoActual);
    } else {
        cursoActualContainer.classList.add('hidden');
        noCursoContainer.classList.remove('hidden');
    }
}

// Función para renderizar el curso actual si lo hay
function renderizarCursoActual(cursoActual) {
    const semanaActual = getSemanaActual();
    const totalClasesTeoricas = cursoActual.frecuencia_semanal * SEMANAS_DEL_CICLO;
    
    // Obtener los datos de asistencias para el curso actual
    if (!asistenciasData[cursoActual.nombre]) {
        asistenciasData[cursoActual.nombre] = { asistencias: 0, inasistencias: 0, virtuales: 0, presenciales: 0, registros: [] };
    }
    const { virtuales, asistencias, inasistencias, presenciales } = asistenciasData[cursoActual.nombre];
    
    const totalClasesHastaHoy = asistencias + inasistencias;

    const totalVirtualesPermitidas = cursoActual.modalidad === 'Híbrido' ? Math.ceil(totalClasesTeoricas * LIMITE_ASISTENCIAS_VIRTUALES) : 0;
    const virtualesRestantes = totalVirtualesPermitidas - virtuales;
    const puedeAsistirVirtual = cursoActual.modalidad === 'Híbrido' && virtuales < totalVirtualesPermitidas;
    
    let ubicacion = 'N/A';
    if (typeof cursoActual.ubicacion_aula === 'string') {
        ubicacion = cursoActual.ubicacion_aula;
    } else if (typeof cursoActual.ubicacion_aula === 'object') {
        const { diaActual } = getFechaHoraActual();
        ubicacion = cursoActual.ubicacion_aula[diaActual] || 'N/A';
    }

    const inasistenciasMaximas = Math.floor(totalClasesTeoricas * LIMITE_INASISTENCIAS_PORCENTAJE);

    // Calcular porcentajes para la barra de progreso
    const totalParaBarra = totalClasesTeoricas;

    let porcentajePresencial = 0;
    let porcentajeVirtual = 0;
    let porcentajeInasistencia = 0;
    let statsHTML = '';

    if (cursoActual.modalidad === 'Remoto') {
        porcentajeVirtual = (virtuales / totalParaBarra) * 100;
        porcentajeInasistencia = (inasistencias / totalParaBarra) * 100;
        statsHTML = `
            <div class="flex flex-col items-center">
                <span class="text-blue-500">${virtuales} Virtuales</span>
                <span class="text-blue-500">(${porcentajeVirtual.toFixed(1)}%)</span>
            </div>
            <div class="flex flex-col items-center">
                <span class="text-red-500">${inasistencias} Faltas</span>
                <span class="text-red-500">(${porcentajeInasistencia.toFixed(1)}%)</span>
            </div>
        `;
    } else if (cursoActual.modalidad === 'Presencial') {
        porcentajePresencial = (presenciales / totalParaBarra) * 100;
        porcentajeInasistencia = (inasistencias / totalParaBarra) * 100;
        statsHTML = `
            <div class="flex flex-col items-center">
                <span class="text-green-500">${presenciales} Presenciales</span>
                <span class="text-green-500">(${porcentajePresencial.toFixed(1)}%)</span>
            </div>
            <div class="flex flex-col items-center">
                <span class="text-red-500">${inasistencias} Faltas</span>
                <span class="text-red-500">(${porcentajeInasistencia.toFixed(1)}%)</span>
            </div>
        `;
    } else if (cursoActual.modalidad === 'Híbrido') {
        porcentajePresencial = (presenciales / totalParaBarra) * 100;
        porcentajeVirtual = (virtuales / totalParaBarra) * 100;
        porcentajeInasistencia = (inasistencias / totalParaBarra) * 100;
        statsHTML = `
            <div class="flex flex-col items-center">
                <span class="text-blue-500">${virtuales} Virtuales</span>
                <span class="text-blue-500">(${porcentajeVirtual.toFixed(1)}%)</span>
            </div>
            <div class="flex flex-col items-center">
                <span class="text-green-500">${presenciales} Presenciales</span>
                <span class="text-green-500">(${porcentajePresencial.toFixed(1)}%)</span>
            </div>
            <div class="flex flex-col items-center">
                <span class="text-red-500">${inasistencias} Faltas</span>
                <span class="text-red-500">(${porcentajeInasistencia.toFixed(1)}%)</span>
            </div>
        `;
    }

    let botonesHTML = `
        <button onclick="registrarAsistencia('${cursoActual.nombre}', 'asistencia', 'presencial', true)" class="bg-green-500 hover:bg-green-600 text-white font-bold p-4 rounded-full transition-colors w-16 h-16 flex items-center justify-center shadow-lg">
            <span class="iconify w-8 h-8" data-icon="ph:check-circle-bold"></span>
        </button>
        <button onclick="registrarAsistencia('${cursoActual.nombre}', 'inasistencia', null, true)" class="bg-red-500 hover:bg-red-600 text-white font-bold p-4 rounded-full transition-colors w-16 h-16 flex items-center justify-center shadow-lg">
            <span class="iconify w-8 h-8" data-icon="mdi:close-circle-outline"></span>
        </button>
    `;
    
    if (cursoActual.modalidad === 'Híbrido') {
        botonesHTML = `
            <button onclick="registrarAsistencia('${cursoActual.nombre}', 'asistencia', 'virtual', true)" class="bg-blue-500 hover:bg-blue-600 text-white font-bold p-4 rounded-full transition-colors w-16 h-16 flex items-center justify-center shadow-lg ${!puedeAsistirVirtual ? 'opacity-50 cursor-not-allowed' : ''}" ${!puedeAsistirVirtual ? 'disabled' : ''}>
                <span class="iconify w-8 h-8" data-icon="mdi:laptop"></span>
            </button>
            <button onclick="registrarAsistencia('${cursoActual.nombre}', 'asistencia', 'presencial', true)" class="bg-green-500 hover:bg-green-600 text-white font-bold p-4 rounded-full transition-colors w-16 h-16 flex items-center justify-center shadow-lg">
                <span class="iconify w-8 h-8" data-icon="ph:house-simple-bold"></span>
            </button>
            <button onclick="registrarAsistencia('${cursoActual.nombre}', 'inasistencia', null, true)" class="bg-red-500 hover:bg-red-600 text-white font-bold p-4 rounded-full transition-colors w-16 h-16 flex items-center justify-center shadow-lg">
                <span class="iconify w-8 h-8" data-icon="mdi:close-circle-outline"></span>
            </button>
        `;
    } else if (cursoActual.modalidad === 'Remoto') {
         botonesHTML = `
            <button onclick="registrarAsistencia('${cursoActual.nombre}', 'asistencia', 'virtual', true)" class="bg-blue-500 hover:bg-blue-600 text-white font-bold p-4 rounded-full transition-colors w-16 h-16 flex items-center justify-center shadow-lg">
                <span class="iconify w-8 h-8" data-icon="mdi:laptop"></span>
            </button>
            <button onclick="registrarAsistencia('${cursoActual.nombre}', 'inasistencia', null, true)" class="bg-red-500 hover:bg-red-600 text-white font-bold p-4 rounded-full transition-colors w-16 h-16 flex items-center justify-center shadow-lg">
                <span class="iconify w-8 h-8" data-icon="mdi:close-circle-outline"></span>
            </button>
         `;
    }

    cursoActualInfo.innerHTML = `
        <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full">
            <h2 class="text-3xl font-bold">${cursoActual.nombre}</h2>
            <p class="mt-2 text-gray-600 dark:text-gray-400 text-lg">${cursoActual.dias.join(', ')} | ${cursoActual.horario_inicio} - ${cursoActual.horario_fin}</p>
            <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">Modalidad: ${cursoActual.modalidad} | Aula: ${ubicacion}</p>
        </div>

        <div class="mt-6 w-full text-center">
            <h3 class="font-semibold text-lg mb-2">
                Progreso del Ciclo <span class="text-sm font-bold text-gray-500 dark:text-gray-400">(${totalClasesHastaHoy} / ${totalClasesTeoricas})</span>
            </h3>
            <div class="flex items-center space-x-2 w-full max-w-lg mx-auto">
                <div class="relative w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div class="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-500" style="width: ${porcentajeVirtual}%;"></div>
                    <div class="absolute inset-y-0 left-0 bg-green-500 transition-all duration-500" style="left: ${porcentajeVirtual}%; width: ${porcentajePresencial}%;"></div>
                    <div class="absolute inset-y-0 left-0 bg-red-500 transition-all duration-500" style="left: ${porcentajeVirtual + porcentajePresencial}%; width: ${porcentajeInasistencia}%;"></div>
                </div>
            </div>
            <div class="flex justify-between w-full max-w-lg mx-auto mt-2 text-xs font-semibold">
                ${statsHTML}
            </div>
        </div>
        <div class="mt-6 flex flex-wrap justify-center space-x-4">
            ${botonesHTML}
        </div>
    `;
}

// Función principal para renderizar todos los cursos en el modal
function renderizarCursos() {
    container.innerHTML = '';
    
    data.cursos.forEach((curso) => {
        if (!asistenciasData[curso.nombre]) {
            asistenciasData[curso.nombre] = { asistencias: 0, inasistencias: 0, virtuales: 0, presenciales: 0, registros: [] };
        }
        
        const { asistencias, inasistencias, virtuales, presenciales } = asistenciasData[curso.nombre];
        const totalClasesTeoricas = curso.frecuencia_semanal * SEMANAS_DEL_CICLO;
        const totalClasesHastaHoy = asistencias + inasistencias;
        
        const inasistenciasMaximas = Math.floor(totalClasesTeoricas * LIMITE_INASISTENCIAS_PORCENTAJE);
        
        const totalVirtualesPermitidas = curso.modalidad === 'Híbrido' ? Math.ceil(totalClasesTeoricas * LIMITE_ASISTENCIAS_VIRTUALES) : 0;
        const virtualesRestantes = totalVirtualesPermitidas - virtuales;
        const puedeAsistirVirtual = curso.modalidad === 'Híbrido' && virtuales < totalVirtualesPermitidas;

        // Cálculos para la barra de progreso
        const totalParaBarra = totalClasesTeoricas;

        let porcentajePresencial = 0;
        let porcentajeVirtual = 0;
        let porcentajeInasistencia = (inasistencias / totalParaBarra) * 100;
        let statsHTML = '';
        let botonesHTML = '';
        let contadoresHTML = '';

        if (curso.modalidad === 'Remoto') {
            porcentajeVirtual = (virtuales / totalParaBarra) * 100;
            contadoresHTML = `
                <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Asistencias Virtuales</p>
                    <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">${virtuales} / ${totalClasesTeoricas - inasistenciasMaximas}</p>
                </div>
            `;
            statsHTML = `
                <div class="flex flex-col items-center">
                    <span class="text-blue-500">${porcentajeVirtual.toFixed(1)}%</span>
                    <span class="text-blue-500">Virtual</span>
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-red-500">${porcentajeInasistencia.toFixed(1)}%</span>
                    <span class="text-red-500">Inasistencia</span>
                </div>
            `;
            botonesHTML = `
                <button onclick="registrarAsistencia('${curso.nombre}', 'asistencia', 'virtual')" class="bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded-full transition-colors w-12 h-12 flex items-center justify-center shadow-lg">
                    <span class="iconify w-6 h-6" data-icon="mdi:laptop"></span>
                </button>
            `;
        } else if (curso.modalidad === 'Presencial') {
            porcentajePresencial = (asistencias / totalParaBarra) * 100;
            contadoresHTML = `
                <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Asistencias Presenciales</p>
                    <p class="text-2xl font-bold text-green-600 dark:text-green-400">${presenciales} / ${totalClasesTeoricas - inasistenciasMaximas}</p>
                </div>
            `;
            statsHTML = `
                <div class="flex flex-col items-center">
                    <span class="text-green-500">${porcentajePresencial.toFixed(1)}%</span>
                    <span class="text-green-500">Presencial</span>
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-red-500">${porcentajeInasistencia.toFixed(1)}%</span>
                    <span class="text-red-500">Inasistencia</span>
                </div>
            `;
            botonesHTML = `
                <button onclick="registrarAsistencia('${curso.nombre}', 'asistencia')" class="bg-green-500 hover:bg-green-600 text-white font-bold p-3 rounded-full transition-colors w-12 h-12 flex items-center justify-center shadow-lg">
                    <span class="iconify w-6 h-6" data-icon="ph:check-circle-bold"></span>
                </button>
            `;
        } else if (curso.modalidad === 'Híbrido') {
            porcentajePresencial = (presenciales / totalParaBarra) * 100;
            porcentajeVirtual = (virtuales / totalParaBarra) * 100;
            contadoresHTML = `
                <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Virtual</p>
                    <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">${virtuales} / ${totalVirtualesPermitidas}</p>
                </div>
                <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Presencial</p>
                    <p class="text-2xl font-bold text-green-600 dark:text-green-400">${presenciales} / ${totalClasesTeoricas - totalVirtualesPermitidas}</p>
                </div>
            `;
            statsHTML = `
                <div class="flex flex-col items-center">
                    <span class="text-blue-500">${porcentajeVirtual.toFixed(1)}%</span>
                    <span class="text-blue-500">Virtual</span>
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-green-500">${porcentajePresencial.toFixed(1)}%</span>
                    <span class="text-green-500">Presencial</span>
                </div>
                <div class="flex flex-col items-center">
                    <span class="text-red-500">${porcentajeInasistencia.toFixed(1)}%</span>
                    <span class="text-red-500">Inasistencia</span>
                </div>
            `;
            botonesHTML = `
                <button onclick="registrarAsistencia('${curso.nombre}', 'asistencia', 'virtual')" class="bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded-full transition-colors w-12 h-12 flex items-center justify-center shadow-lg ${!puedeAsistirVirtual ? 'opacity-50 cursor-not-allowed' : ''}" ${!puedeAsistirVirtual ? 'disabled' : ''}>
                    <span class="iconify w-6 h-6" data-icon="mdi:laptop"></span>
                </button>
                <button onclick="registrarAsistencia('${curso.nombre}', 'asistencia', 'presencial')" class="bg-green-500 hover:bg-green-600 text-white font-bold p-3 rounded-full transition-colors w-12 h-12 flex items-center justify-center shadow-lg">
                    <span class="iconify w-6 h-6" data-icon="ph:house-simple-bold"></span>
                </button>
            `;
        }

        const ubicacionHTML = typeof curso.ubicacion_aula === 'string'
            ? `<span class="text-xs font-semibold text-gray-500 dark:text-gray-400">Aula: ${curso.ubicacion_aula}</span>`
            : ``;
        
        const cursoCard = document.createElement('div');
        cursoCard.className = `bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 ${inasistencias >= inasistenciasMaximas ? 'border-red-500' : 'border-blue-500'}`;
        cursoCard.innerHTML = `
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-bold">${curso.nombre}</h2>
                <span class="text-sm font-semibold text-gray-500 dark:text-gray-400">${curso.modalidad}</span>
            </div>
            <div class="mt-2 flex justify-between items-center">
                <p class="text-gray-600 dark:text-gray-400">
                    ${curso.dias.join(', ')} | ${curso.horario_inicio} - ${curso.horario_fin}
                </p>
                ${ubicacionHTML}
            </div>
            <div class="mt-4 grid grid-cols-2 gap-4 text-center">
                ${contadoresHTML}
                <div>
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Inasistencias</p>
                    <p class="text-2xl font-bold text-red-600 dark:text-red-400">${inasistencias} / ${inasistenciasMaximas}</p>
                </div>
            </div>

            <div class="mt-6">
                <h3 class="font-semibold text-sm mb-2">
                    Progreso del Ciclo <span class="text-sm font-bold text-gray-500 dark:text-gray-400">(${totalClasesHastaHoy} / ${totalClasesTeoricas})</span>
                </h3>
                <div class="flex items-center space-x-2 w-full">
                    <div class="relative w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div class="absolute inset-y-0 left-0 bg-green-500 transition-all duration-500" style="width: ${porcentajePresencial}%;"></div>
                        <div class="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-500" style="left: ${porcentajePresencial}%; width: ${porcentajeVirtual}%;"></div>
                        <div class="absolute inset-y-0 left-0 bg-red-500 transition-all duration-500" style="left: ${porcentajePresencial + porcentajeVirtual}%; width: ${porcentajeInasistencia}%;"></div>
                    </div>
                </div>
                <div class="flex justify-between w-full mt-2 text-xs font-semibold">
                    ${statsHTML}
                </div>
            </div>
            
            <div class="mt-6 flex justify-center space-x-4">
                <button onclick="showEditModal('${curso.nombre}')" class="bg-gray-500 hover:bg-gray-600 text-white font-bold p-3 rounded-full transition-colors w-12 h-12 flex items-center justify-center shadow-lg">
                    <span class="iconify w-6 h-6" data-icon="fluent:edit-48-regular"></span>
                </button>
                ${botonesHTML}
                <button onclick="registrarAsistencia('${curso.nombre}', 'inasistencia')" class="bg-red-500 hover:bg-red-600 text-white font-bold p-3 rounded-full transition-colors w-12 h-12 flex items-center justify-center shadow-lg">
                    <span class="iconify w-6 h-6" data-icon="mdi:close-circle-outline"></span>
                </button>
            </div>
        `;
        container.appendChild(cursoCard);
    });
}

// Función para registrar asistencia o inasistencia
function registrarAsistencia(nombreCurso, tipo, modalidadAsistencia = null, esDesdeCursoActual = false) {
    if (!asistenciasData[nombreCurso]) {
        asistenciasData[nombreCurso] = { asistencias: 0, inasistencias: 0, virtuales: 0, presenciales: 0, registros: [] };
    }

    if (tipo === 'asistencia') {
        asistenciasData[nombreCurso].asistencias += 1;
        if (modalidadAsistencia === 'virtual') {
            asistenciasData[nombreCurso].virtuales += 1;
        } else { // Presencial o Normal
            asistenciasData[nombreCurso].presenciales += 1;
        }
    } else if (tipo === 'inasistencia') {
        asistenciasData[nombreCurso].inasistencias += 1;
    }

    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // Guardamos la fecha y hora en el registro
    asistenciasData[nombreCurso].registros.push({
        tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
        fecha: fecha,
        hora: hora,
        modalidad: modalidadAsistencia || 'Normal'
    });

    // Guardamos los cambios en localStorage
    localStorage.setItem('asistencias', JSON.stringify(asistenciasData));
    
    // Volvemos a renderizar
    renderizarCursos();
    if (esDesdeCursoActual) {
        renderizarPantallaPrincipal();
    }
}

// Función para mostrar el modal de edición
function showEditModal(nombreCurso) {
    const cursoData = asistenciasData[nombreCurso];
    
    let registrosHTML = cursoData && cursoData.registros.length > 0 ? cursoData.registros.map((reg, index) => `
        <li class="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded-md mb-2">
            <span>${index + 1}. ${reg.tipo} ${reg.modalidad !== 'Normal' ? `(${reg.modalidad})` : ''} - ${reg.fecha} ${reg.hora}</span>
            <button onclick="editarAsistencia('${nombreCurso}', ${index})" class="text-red-500 hover:text-red-700 transition-colors">
                <span class="iconify w-5 h-5" data-icon="mdi:undo"></span>
            </button>
        </li>
    `).join('') : '<p class="text-center text-gray-500 dark:text-gray-400">No hay registros para editar.</p>';

    editModalContent.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">Editar Asistencias de ${nombreCurso}</h3>
            <button onclick="editModal.classList.add('hidden')" class="text-gray-500 hover:text-red-500 transition-colors">
                <span class="iconify w-6 h-6" data-icon="mdi:close-circle-outline"></span>
            </button>
        </div>
        <ul class="max-h-64 overflow-y-auto custom-scrollbar">
            ${registrosHTML}
        </ul>
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">Presiona el botón de deshacer para borrar un registro de asistencia o inasistencia.</p>
        </div>
    `;
    editModal.classList.remove('hidden');
}

// Función para editar/deshacer una asistencia
function editarAsistencia(nombreCurso, index) {
    const registro = asistenciasData[nombreCurso].registros[index];
    if (registro) {
        // Deshacemos el registro
        if (registro.tipo === 'Asistencia') {
            asistenciasData[nombreCurso].asistencias -= 1;
            if (registro.modalidad === 'virtual') {
                asistenciasData[nombreCurso].virtuales -= 1;
            } else { // Presencial o Normal
                asistenciasData[nombreCurso].presenciales -= 1;
            }
        } else if (registro.tipo === 'Inasistencia') {
            asistenciasData[nombreCurso].inasistencias -= 1;
        }
        
        // Eliminamos el registro del array
        asistenciasData[nombreCurso].registros.splice(index, 1);
        
        // Guardamos y actualizamos la UI
        localStorage.setItem('asistencias', JSON.stringify(asistenciasData));
        renderizarCursos();
        renderizarPantallaPrincipal();
        showEditModal(nombreCurso); // Volvemos a mostrar el modal actualizado
    }
}

// Event Listeners
menuBtn.addEventListener('click', () => {
    renderizarCursos();
    cursosModal.classList.remove('hidden');
});

// Cierran los modales al hacer clic en el fondo
cursosModal.addEventListener('click', (e) => {
    if (e.target === cursosModal) {
        cursosModal.classList.add('hidden');
    }
});
closeModalBtn.addEventListener('click', () => {
    cursosModal.classList.add('hidden');
});

editModal.addEventListener('click', (e) => {
    if (e.target === editModal || e.target.closest('#close-edit-modal-btn')) {
        editModal.classList.add('hidden');
    }
});

pasteModal.addEventListener('click', (e) => {
    if (e.target === pasteModal || e.target.closest('#close-paste-modal-btn')) {
        pasteModal.classList.add('hidden');
    }
});

shareBtn.addEventListener('click', () => {
    const dataToShare = JSON.stringify(asistenciasData, null, 2);
    const text = `¡Mis datos de asistencia del ciclo! Pega esto en la app para sincronizar:\n\n` + dataToShare;
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
    navigator.clipboard.writeText(dataToShare).then(() => {
        alert('JSON copiado al portapapeles y preparando para compartir en WhatsApp.');
        window.open(whatsappUrl, '_blank');
    }).catch(err => {
        alert('No se pudo copiar el JSON. Por favor, inténtalo de nuevo.');
        console.error('Error al copiar el JSON: ', err);
    });
});

pasteBtn.addEventListener('click', () => {
    pasteModal.classList.remove('hidden');
});

importBtn.addEventListener('click', () => {
    try {
        const pastedData = JSON.parse(jsonInput.value);
        if (typeof pastedData === 'object' && !Array.isArray(pastedData)) {
            asistenciasData = pastedData;
            localStorage.setItem('asistencias', JSON.stringify(asistenciasData));
            alert('¡Datos importados con éxito!');
            pasteModal.classList.add('hidden');
            renderizarPantallaPrincipal();
            renderizarCursos();
        } else {
            alert('El formato del JSON es inválido. Asegúrate de pegar los datos correctamente.');
        }
    } catch (e) {
        alert('Error al procesar el JSON. Asegúrate de que el formato sea correcto.');
        console.error(e);
    }
});

clearBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro que quieres borrar todos los datos de asistencias? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('asistencias');
        asistenciasData = {};
        renderizarPantallaPrincipal();
        renderizarCursos();
        alert('¡Todos los datos de asistencias han sido borrados!');
    }
});

// Inicializamos la app
renderizarPantallaPrincipal();

// Actualizar la vista cada 60 segundos para el curso actual
setInterval(() => {
    renderizarPantallaPrincipal();
}, 60000);