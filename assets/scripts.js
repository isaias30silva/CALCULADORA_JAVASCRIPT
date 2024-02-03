const result = document.querySelector(".result");
const buttons = document.querySelectorAll(".buttons button");

let numeroAtual = "";
let primeiroOperando = null;
let operador = null;
let reinicio = false;

/* Atualiza o visor da calculadora com a expressão acumulada,
substituindo vírgulas por pontos para garantir a representação
correta de casas decimais em JavaScript. Se `inicioLimpo` for
true, reinicia o visor para "0".*/
function atualizarResultado(inicioLimpo = false) {
    if (inicioLimpo) {
        result.innerText = "0";
    } else {
        const expressaoMatematica = primeiroOperando !== null ? `${primeiroOperando} ${operador} ${numeroAtual}` : numeroAtual;
        result.innerText = expressaoMatematica.replace(".", ",");
    }
}

/**
 * Adiciona um dígito ao número atual na calculadora.
 * Evita adicionar múltiplas vírgulas consecutivas e
 * reinicia o número se necessário. Atualiza o visor.
 */
function adicionarDigito(digito) {
    if(digito === "," && (numeroAtual.includes(",") || !numeroAtual)) return;

    if(reinicio) {
        numeroAtual = digito;
        reinicio = false;
    } else {
        numeroAtual += digito;
    }
    atualizarResultado();
}

/**
 * Define um novo operador na calculadora e atualiza o primeiro operando
 * com o número atual, se existir. Reinicia o número atual.
 */
function definirOperador(novoOperador) {
    if(numeroAtual) {
        primeiroOperando = parseFloat(numeroAtual.replace(",", "."));
        numeroAtual = "";
    }
    operador = novoOperador;
}

/**
 * Realiza o cálculo com base no operador atual, atualiza o visor
 * com o resultado e reinicia as variáveis relacionadas às operações.
 */
function calcular() {
    if(operador === null || primeiroOperando === null) return;
    let segundoOperador = parseFloat(numeroAtual.replace(",", "."));
    let resultado;

    switch(operador) {
        case "+":
            resultado = primeiroOperando + segundoOperador;
        break;
        case "-":
            resultado = primeiroOperando - segundoOperador;
        break;
        case "x":
            resultado = primeiroOperando * segundoOperador;
        break;
        case "÷":
            resultado = primeiroOperando / segundoOperador;
        break;
        default:
            return;
    }

    if(resultado.toString().split(".")[1]?.length > 2) {
        numeroAtual = parseFloat(resultado.toFixed(2)).toString();
    } else {
        numeroAtual = resultado.toString();
    }

    operador = null;
    primeiroOperando = null;
    reinicio = true;
    atualizarResultado();
}   

function limparCalculadora() {
    numeroAtual = "0";
    primeiroOperando = null;
    operador = null;
    atualizarResultado();
}

/**
 * Adiciona eventos de clique a todos os botões da calculadora.
 * Ao clicar em um botão, executa a função correspondente com base no texto do botão.
 */
buttons.forEach((botao) => {
    botao.addEventListener("click", () => {
        const textoBotao = botao.innerText;
        if(/^[0-9,]+$/.test(textoBotao)) {
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