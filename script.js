// ==========================================
// CONFIGURAÇÃO DO SUPABASE
// ==========================================

const SUPABASE_URL = "COLOQUE_AQUI_A_URL_DO_SEU_SUPABASE";

const SUPABASE_KEY = "COLOQUE_AQUI_SUA_PUBLISHABLE_KEY";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

const nomeInput = document.getElementById("nome");
const btnEntrada = document.getElementById("btnEntrada");
const mensagem = document.getElementById("mensagem");
const relogio = document.getElementById("relogio");


// ==========================================
// RELÓGIO
// ==========================================

function atualizarRelogio() {

    const agora = new Date();

    const horas = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");
    const segundos = String(agora.getSeconds()).padStart(2, "0");

    relogio.textContent = `${horas}:${minutos}:${segundos}`;
}

setInterval(atualizarRelogio, 1000);

atualizarRelogio();


// ==========================================
// REGISTRAR ENTRADA
// ==========================================

btnEntrada.addEventListener("click", async () => {

    const nome = nomeInput.value.trim();

    // Verifica se o funcionário digitou o nome
    if (!nome) {

        mensagem.textContent = "Digite o nome do funcionário.";

        return;
    }

    // Desativa o botão para evitar cliques duplicados
    btnEntrada.disabled = true;

    mensagem.textContent = "Registrando ponto...";


    // Data e hora atuais
    const agora = new Date();

    const data = agora.toISOString().split("T")[0];

    const hora = agora.toTimeString().split(" ")[0];


    // ======================================
    // ENVIA PARA O SUPABASE
    // ======================================

    const { error } = await supabaseClient
        .from("pontos")
        .insert([
            {
                funcionario_nome: nome,
                data: data,
                hora_entrada: hora
            }
        ]);


    // ======================================
    // VERIFICAÇÃO DO RESULTADO
    // ======================================

    if (error) {

        console.error("Erro ao registrar ponto:", error);

        mensagem.textContent =
            "Erro ao registrar o ponto.";

        btnEntrada.disabled = false;

        return;
    }


    // Registro realizado
    mensagem.textContent =
        `Entrada registrada com sucesso às ${hora}!`;

    nomeInput.value = "";

    btnEntrada.disabled = false;
});
