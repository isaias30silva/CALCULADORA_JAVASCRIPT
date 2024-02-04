const result = document.querySelector(".result");
const buttons = document.querySelectorAll(".buttons button");

let numerosEOperadores = [];
let numeroAtual = "";
let reinicio = false;

function atualizarResultado(inicioLimpo = false) {
    if (inicioLimpo) {
        result.innerText = "0";
    } else {
        const expressaoMatematica = numerosEOperadores.join(" ") + " " + numeroAtual;
        result.innerText = expressaoMatematica.replace(".", ",");
    }
}

function adicionarDigito(digito) {
    if (digito === "," && (numeroAtual.includes(",") || !numeroAtual)) return;

    if (reinicio) {
        numeroAtual = digito;
        reinicio = false;
    } else {
        numeroAtual += digito;
    }
    atualizarResultado();
}

function definirOperador(novoOperador) {
    if (numeroAtual) {
        numerosEOperadores.push(numeroAtual);
        numerosEOperadores.push(novoOperador);
        numeroAtual = "";
    }
}

function calcular() {
    if (!numeroAtual && numerosEOperadores.length === 0) return;

    if (numeroAtual) {
        numerosEOperadores.push(numeroAtual);
    }

    try {
        let resultado = parseFloat(numerosEOperadores[0]);

        for (let i = 1; i < numerosEOperadores.length; i += 2) {
            const operador = numerosEOperadores[i];
            const proximoNumero = parseFloat(numerosEOperadores[i + 1]);

            if (isNaN(proximoNumero) || !isFinite(proximoNumero)) {
                throw new Error("Operação inválida");
            }

            switch (operador) {
                case "+":
                    resultado += proximoNumero;
                    break;
                case "-":
                    resultado -= proximoNumero;
                    break;
                case "x":
                    resultado *= proximoNumero;
                    break;
                case "÷":
                    resultado /= proximoNumero;
                    break;
                default:
                    throw new Error("Operação inválida");
            }
        }

        if (isNaN(resultado) || !isFinite(resultado)) {
            throw new Error("Operação inválida");
        }

        numeroAtual = resultado.toFixed(2);
        numerosEOperadores = [];
        reinicio = true;
        atualizarResultado();
    } catch (error) {
        console.error(error.message);
        limparCalculadora();
        result.innerText = "Erro";
    }
}

function limparCalculadora() {
    numerosEOperadores = [];
    numeroAtual = "";
    atualizarResultado(true);
}

buttons.forEach((botao) => {
    botao.addEventListener("click", () => {
        const textoBotao = botao.innerText;
        if (/^[0-9,]+$/.test(textoBotao)) {
            adicionarDigito(textoBotao);
        } else if (["+", "-", "x", "÷"].includes(textoBotao)) {
            definirOperador(textoBotao);
        } else if (textoBotao === "=") {
            calcular();
        } else if (textoBotao === "C") {
            limparCalculadora();
        }
    });
});
