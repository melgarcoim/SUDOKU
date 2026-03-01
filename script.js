document.addEventListener("DOMContentLoaded", function () {

const boardElement = document.getElementById("sudoku-board");
const mensaje = document.getElementById("mensaje");

let tableroInicial = [];
let tableroSolucion = [];

/* =========================
   CREAR TABLERO
========================= */
function crearTablero() {
    boardElement.innerHTML = "";

    for (let i = 0; i < 81; i++) {
        const input = document.createElement("input");
        input.type = "number";
        input.min = 1;
        input.max = 9;

        input.addEventListener("input", () => {
            if (input.value > 9) input.value = "";
        });

        boardElement.appendChild(input);
    }
}

/* =========================
   GENERAR TABLERO VACÍO
========================= */
function crearTableroVacio() {
    let tablero = [];
    for (let i = 0; i < 9; i++) {
        tablero[i] = [];
        for (let j = 0; j < 9; j++) {
            tablero[i][j] = 0;
        }
    }
    return tablero;
}

/* =========================
   VALIDAR MOVIMIENTO
========================= */
function esValido(tablero, fila, col, num) {

    for (let x = 0; x < 9; x++) {
        if (tablero[fila][x] === num) return false;
        if (tablero[x][col] === num) return false;
    }

    let inicioFila = fila - fila % 3;
    let inicioCol = col - col % 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (tablero[inicioFila + i][inicioCol + j] === num) {
                return false;
            }
        }
    }

    return true;
}

/* =========================
   BACKTRACKING REAL
========================= */
function resolverBacktracking(tablero) {

    for (let fila = 0; fila < 9; fila++) {
        for (let col = 0; col < 9; col++) {

            if (tablero[fila][col] === 0) {

                let numeros = [1,2,3,4,5,6,7,8,9];
                numeros.sort(() => Math.random() - 0.5);

                for (let num of numeros) {

                    if (esValido(tablero, fila, col, num)) {

                        tablero[fila][col] = num;

                        if (resolverBacktracking(tablero)) {
                            return true;
                        }

                        tablero[fila][col] = 0; // retroceso
                    }
                }

                return false;
            }
        }
    }

    return true;
}

/* =========================
   NUEVO JUEGO
========================= */
function nuevoJuego() {

    mensaje.style.opacity = 0;
    boardElement.classList.remove("ganador");

    let tablero = crearTableroVacio();
    resolverBacktracking(tablero);

    tableroSolucion = JSON.parse(JSON.stringify(tablero));
    tableroInicial = JSON.parse(JSON.stringify(tablero));

    const nivel = document.getElementById("nivel").value;

    let celdasEliminar = 30;
    if (nivel === "medio") celdasEliminar = 40;
    if (nivel === "dificil") celdasEliminar = 50;

    while (celdasEliminar > 0) {
        let fila = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);

        if (tableroInicial[fila][col] !== 0) {
            tableroInicial[fila][col] = 0;
            celdasEliminar--;
        }
    }

    mostrarTablero(tableroInicial);
}

/* =========================
   MOSTRAR TABLERO
========================= */
function mostrarTablero(tablero) {
    const inputs = document.querySelectorAll("#sudoku-board input");

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {

            let input = inputs[i * 9 + j];
            input.classList.remove("celda-bloqueada", "error", "correcto");

            if (tablero[i][j] !== 0) {
                input.value = tablero[i][j];
                input.disabled = true;
                input.classList.add("celda-bloqueada");
            } else {
                input.value = "";
                input.disabled = false;
            }
        }
    }
}

/* =========================
   OBTENER TABLERO ACTUAL
========================= */
function obtenerTableroActual() {
    const inputs = document.querySelectorAll("#sudoku-board input");
    let tablero = [];

    for (let i = 0; i < 9; i++) {
        tablero[i] = [];
        for (let j = 0; j < 9; j++) {
            let input = inputs[i * 9 + j];
            tablero[i][j] = input.value ? parseInt(input.value) : 0;
        }
    }

    return tablero;
}

/* =========================
   VERIFICAR
========================= */
function verificar() {

    let tableroActual = obtenerTableroActual();
    const inputs = document.querySelectorAll("#sudoku-board input");
    let errores = 0;

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {

            let input = inputs[i * 9 + j];
            input.classList.remove("error", "correcto");

            if (!input.disabled && tableroActual[i][j] !== 0) {

                if (tableroActual[i][j] !== tableroSolucion[i][j]) {
                    input.classList.add("error");
                    errores++;
                } else {
                    input.classList.add("correcto");
                }
            }
        }
    }

    if (errores === 0) {

        if (verificarVictoria()) {
            mensaje.innerText = "🎉 ¡FELICIDADES! Sudoku Completado 🎉";
            mensaje.style.opacity = 1;
            boardElement.classList.add("ganador");
        } else {
            alert("Todo correcto hasta ahora.");
        }

    } else {
        alert("Tienes " + errores + " errores.");
    }
}

/* =========================
   PISTA
========================= */
function pista() {

    let tableroActual = obtenerTableroActual();
    const inputs = document.querySelectorAll("#sudoku-board input");

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {

            if (tableroActual[i][j] === 0) {
                inputs[i * 9 + j].value = tableroSolucion[i][j];
                inputs[i * 9 + j].classList.add("correcto");
                return;
            }
        }
    }

    alert("No hay más pistas disponibles.");
}

/* =========================
   VERIFICAR VICTORIA
========================= */
function verificarVictoria() {

    let tableroActual = obtenerTableroActual();

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (tableroActual[i][j] !== tableroSolucion[i][j]) {
                return false;
            }
        }
    }

    return true;
}

/* =========================
   RESOLVER
========================= */
function resolverSudoku() {

    mostrarTablero(tableroSolucion);

    mensaje.innerText = "✨ Sudoku Resuelto con Backtracking ✨";
    mensaje.style.opacity = 1;
    boardElement.classList.add("ganador");
}

/* =========================
   EVENTOS
========================= */
document.getElementById("btnNuevo").addEventListener("click", nuevoJuego);
document.getElementById("btnVerificar").addEventListener("click", verificar);
document.getElementById("btnPista").addEventListener("click", pista);
document.getElementById("btnResolver").addEventListener("click", resolverSudoku);

/* =========================
   INICIALIZAR
========================= */
crearTablero();
nuevoJuego();

});


