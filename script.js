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

        // Evitar números mayores a 9
        input.addEventListener("input", () => {
            if (input.value > 9) input.value = "";
        });

        boardElement.appendChild(input);
    }
}

/* =========================
   SUDOKU BASE
========================= */
const sudokuBase = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
];

/* =========================
   NUEVO JUEGO
========================= */
function nuevoJuego() {

    mensaje.style.opacity = 0;
    boardElement.classList.remove("ganador");

    const nivel = document.getElementById("nivel").value;

    tableroInicial = JSON.parse(JSON.stringify(sudokuBase));
    tableroSolucion = JSON.parse(JSON.stringify(sudokuBase));

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

    mensaje.innerText = "✨ Sudoku Resuelto Automáticamente ✨";
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

