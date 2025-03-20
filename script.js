document.addEventListener('DOMContentLoaded', () => {
    const inputTarea = document.getElementById('tarea');
    const botonAgregarTarea = document.getElementById('botonAgregarTarea');
    const listaTareas = document.getElementById('listaTareas');
    const localStorageKey = 'listaDeTareas'; // Cambia la clave del localStorage

    // Cargar tareas guardadas al iniciar
    function cargarTarea() {
        const tareasGuardadas = localStorage.getItem(localStorageKey);
        if (tareasGuardadas) {
            tareasGuardadas.split(',').forEach(tarea => {
                const [tareaTexto, marcado] = tarea.split('|');
                crearTarea(tareaTexto, marcado === 'true');
            });
        }
    }

    // Agregar una nueva tarea
    function agregarTarea() {
        const nuevaTarea = inputTarea.value.trim();
        if (nuevaTarea) {
            crearTarea(nuevaTarea);
            guardarTarea(nuevaTarea);
            inputTarea.value = '';
            inputTarea.placeholder = 'Otra tarea';
        } else {
            alert('Por favor, ingresa una tarea válida.');
        }
        inputTarea.focus();
    }

    // Crear una tarea en la lista
    function crearTarea(tareaTexto, marcado = false) {
        const tareaCreada = document.createElement('li');
        tareaCreada.textContent = tareaTexto;
        tareaCreada.setAttribute('data-texto', tareaTexto); // Guardar el texto en un atributo
        tareaCreada.classList.add('tareaCreada');

        // Botón para marcar/desmarcar tarea
        const botonMarcar = document.createElement('button');
        botonMarcar.textContent = '✓';
        botonMarcar.classList.add(marcado ? 'botonMarcado' : 'botonDesmarcado');
        botonMarcar.addEventListener('click', () => {
            botonMarcar.classList.toggle('botonMarcado');
            botonMarcar.classList.toggle('botonDesmarcado');
            actualizarTareaEnLocalStorage(tareaTexto, botonMarcar.classList.contains('botonMarcado'));
        });

        // Botón para eliminar tarea
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'X';
        botonEliminar.classList.add('botonEliminar');
        botonEliminar.addEventListener('click', () => {
            tareaCreada.remove();
            eliminarTareaDeLocalStorage(tareaTexto);
        });

        // Botón para subir tarea
        const botonSubir = document.createElement('button');
        botonSubir.textContent = '▲';
        botonSubir.classList.add('botonSubir');
        botonSubir.addEventListener('click', () => {
            const elementoAnterior = tareaCreada.previousElementSibling;
            if (elementoAnterior) {
                listaTareas.insertBefore(tareaCreada, elementoAnterior);
                guardarOrdenEnLocalStorage();
            }
        });

        // Botón para bajar tarea
        const botonBajar = document.createElement('button');
        botonBajar.textContent = '▼';
        botonBajar.classList.add('botonBajar');
        botonBajar.addEventListener('click', () => {
            const elementoSiguiente = tareaCreada.nextElementSibling;
            if (elementoSiguiente) {
                listaTareas.insertBefore(elementoSiguiente, tareaCreada);
                guardarOrdenEnLocalStorage();
            }
        });

        // Contenedor de botones
        const divBotones = document.createElement('div');
        divBotones.append(botonMarcar, botonEliminar, botonSubir, botonBajar);

        // Agregar botones a la tarea
        tareaCreada.appendChild(divBotones);
        listaTareas.appendChild(tareaCreada);
    }

    // Guardar una tarea en el localStorage
    function guardarTarea(tareaTexto) {
        const tareasGuardadas = localStorage.getItem(localStorageKey);
        const listaTareas = tareasGuardadas ? tareasGuardadas.split(',') : [];
        listaTareas.push(`${tareaTexto}|false`);
        localStorage.setItem(localStorageKey, listaTareas.join(','));
    }

    // Actualizar el estado de una tarea en el localStorage
    function actualizarTareaEnLocalStorage(tareaTexto, marcado) {
        const tareasGuardadas = localStorage.getItem(localStorageKey);
        if (tareasGuardadas) {
            const listaTareas = tareasGuardadas.split(',').map(tarea => {
                const [texto, estado] = tarea.split('|');
                return texto === tareaTexto ? `${texto}|${marcado}` : tarea;
            });
            localStorage.setItem(localStorageKey, listaTareas.join(','));
        }
    }

    // Eliminar una tarea del localStorage
    function eliminarTareaDeLocalStorage(tareaTexto) {
        const tareasGuardadas = localStorage.getItem(localStorageKey);
        if (tareasGuardadas) {
            const listaTareas = tareasGuardadas.split(',').filter(tarea => {
                const [texto] = tarea.split('|');
                return texto !== tareaTexto;
            });
            localStorage.setItem(localStorageKey, listaTareas.join(','));
        }
    }

    // Guardar el orden de las tareas en el localStorage
    function guardarOrdenEnLocalStorage() {
        const tareas = Array.from(listaTareas.children).map(li => {
            const texto = li.getAttribute('data-texto'); // Obtener el texto desde el atributo
            const marcado = li.querySelector('.botonMarcado') !== null;
            return `${texto}|${marcado}`;
        });
        localStorage.setItem(localStorageKey, tareas.join(','));
    }

    // Cargar tareas al iniciar
    cargarTarea();
    inputTarea.focus();

    // Eventos
    botonAgregarTarea.addEventListener('click', agregarTarea);
    inputTarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            agregarTarea();
        }
    });
});