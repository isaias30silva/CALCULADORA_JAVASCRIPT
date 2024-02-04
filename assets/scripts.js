const result = document.querySelector(".result");
const buttons = document.querySelectorAll(".buttons button");

let numerosEOperadores = [];
let numeroAtual = "";
let reinicio = false;

/**
 * Atualiza o visor da calculadora com a expressão acumulada.
 * Se `inicioLimpo` for true, reinicia o visor para exibir "0".
 * @param {boolean} inicioLimpo - Indica se o visor deve ser reiniciado.
 */
function atualizarResultado(inicioLimpo = false) {
    // Se `inicioLimpo` for true, reinicia o visor para exibir "0"
    if (inicioLimpo) {
        result.innerText = "0";
    } else {
        // Cria uma expressão matemática unindo números e operadores, adiciona o número atual
        const expressaoMatematica = numerosEOperadores.join(" ") + " " + numeroAtual;
        // Exibe a expressão formatada no visor, substituindo ponto por vírgula se necessário
        result.innerText = expressaoMatematica.replace(".", ",");
    }
}

/**
 * Adiciona um dígito ao número atual na calculadora.
 * Evita adicionar múltiplas vírgulas consecutivas e reinicia o número se necessário.
 * Atualiza o visor após a adição do dígito.
 * @param {string} digito - O dígito a ser adicionado.
 */
function adicionarDigito(digito) {
    // Se o dígito for uma vírgula e já existir uma vírgula no número atual ou o número atual estiver vazio, retorna.
    if (digito === "," && (numeroAtual.includes(",") || !numeroAtual)) return;

    // Se a calculadora estiver em estado de reinício, atribui o dígito como o novo número atual e indica que não está mais em reinício.
    if (reinicio) {
        numeroAtual = digito;
        reinicio = false;
    } else {
        // Caso contrário, concatena o dígito ao número atual.
        numeroAtual += digito;
    }

    // Atualiza o visor da calculadora após adicionar o dígito.
    atualizarResultado();
}

/**
 * Define um novo operador na calculadora.
 * Atualiza a lista de números e operadores, adiciona o número atual e o novo operador.
 * Reinicia o número atual.
 * @param {string} novoOperador - O novo operador a ser definido.
 */
function definirOperador(novoOperador) {
    // Se houver um número atual, adiciona o número atual e o novo operador à lista de números e operadores.
    // Reinicia o número atual.
    if (numeroAtual) {
        numerosEOperadores.push(numeroAtual);
        numerosEOperadores.push(novoOperador);
        numeroAtual = "";
    }
}

/**
 * Executa as operações acumuladas na calculadora e atualiza o visor com o resultado.
 * Realiza as operações na ordem da lista de números e operadores.
 */
function calcular() {
    // Se não houver número atual e a lista de números e operadores estiver vazia, retorna.
    if (!numeroAtual && numerosEOperadores.length === 0) return;

    // Se houver número atual, adiciona-o à lista de números e operadores.
    if (numeroAtual) {
        numerosEOperadores.push(numeroAtual);
    }

    try {
        // Inicializa o resultado com o primeiro número da lista.
        let resultado = parseFloat(numerosEOperadores[0]);

        // Itera sobre a lista de números e operadores, realizando as operações.
        for (let i = 1; i < numerosEOperadores.length; i += 2) {
            const operador = numerosEOperadores[i];
            const proximoNumero = parseFloat(numerosEOperadores[i + 1]);

            // Verifica se o próximo número é válido.
            if (isNaN(proximoNumero) || !isFinite(proximoNumero)) {
                throw new Error("Operação inválida");
            }

            // Realiza a operação com base no operador.
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

        // Verifica se o resultado é um número válido.
        if (isNaN(resultado) || !isFinite(resultado)) {
            throw new Error("Operação inválida");
        }

        // Formata o resultado para exibir apenas duas casas decimais.
        numeroAtual = resultado.toFixed(2);
        
        // Limpa a lista de números e operadores, reinicia a calculadora e atualiza o visor.
        numerosEOperadores = [];
        reinicio = true;
        atualizarResultado();
    } catch (error) {
        // Em caso de erro, exibe uma mensagem de erro, limpa a calculadora e exibe "Erro" no visor.
        console.error(error.message);
        limparCalculadora();
        result.innerText = "Erro";
    }
}


/**
 * Reinicia o estado da calculadora.
 * Zera a lista de números e operadores, limpa o número atual e, opcionalmente, reinicia o visor.
 * @param {boolean} reiniciarVisor - Indica se o visor deve ser reiniciado para exibir "0".
 */
function limparCalculadora(reiniciarVisor = true) {
    // Zera a lista de números e operadores.
    numerosEOperadores = [];

    // Limpa o número atual.
    numeroAtual = "";

    // Se `reiniciarVisor` for true, chama a função para reiniciar o visor exibindo "0".
    if (reiniciarVisor) {
        atualizarResultado(true);
    }
}

// Adiciona um evento de clique a cada botão da calculadora.
buttons.forEach((botao) => {
    botao.addEventListener("click", () => {
        // Obtém o texto do botão clicado.
        const textoBotao = botao.innerText;

        // Verifica se o texto do botão é um número ou uma vírgula e executa a função para adicionar dígito.
        if (/^[0-9,]+$/.test(textoBotao)) {
            adicionarDigito(textoBotao);
        } 
        // Verifica se o texto do botão é um dos operadores e executa a função para definir o operador.
        else if (["+", "-", "x", "÷"].includes(textoBotao)) {
            definirOperador(textoBotao);
        } 
        // Verifica se o texto do botão é "=" e executa a função para calcular o resultado.
        else if (textoBotao === "=") {
            calcular();
        } 
        // Verifica se o texto do botão é "C" e executa a função para limpar a calculadora.
        else if (textoBotao === "C") {
            limparCalculadora();
        }
    });
});

