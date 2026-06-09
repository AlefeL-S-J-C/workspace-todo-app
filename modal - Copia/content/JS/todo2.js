let tarefas = [];
let filtroAtual = "todas";
let termoPesquisa = "";

const API_URL = "http://localhost:5152/tarefas";
const API_URGENCIAS_URL = "http://localhost:5152/urgencias";

let arrUrgencia = [];

const formModalTarefa = document.getElementById("formModalTarefa");
const inputTituloModal = document.getElementById("inputTituloModal");
const inputDataInicioModal = document.getElementById("inputDataInicioModal");
const inputDataFimModal = document.getElementById("inputDataFimModal");
const inputDescricaoModal = document.getElementById("inputDescricaoModal");
const listaTarefas = document.getElementById("ListaTarefas");
const btnFiltroTodas = document.getElementById("btnFiltroTodas");
const btnFiltroPendentes = document.getElementById("btnFiltroPendentes");
const btnFiltroConcluidos = document.getElementById("btnFiltroConcluidos");
const btnLimparTodas = document.getElementById("btnLimparTodas");
const contadorTarefas = document.getElementById("contadorTarefas");
const btnFecharModal = document.getElementById("btnFecharModal");
const formModalEditarTarefa = document.getElementById("formModalEditarTarefa");
const inputEditarId = document.getElementById("inputEditarId");
const inputEditarTitulo = document.getElementById("inputEditarTitulo");
const inputEditarDataInicio = document.getElementById("inputEditarDataInicio");
const inputEditarDataFim = document.getElementById("inputEditarDataFim");
const inputEditarDescricao = document.getElementById("inputEditarDescricao");
const btnFecharModalEditar = document.getElementById("btnFecharModalEditar");
const verTarefaTitulo = document.getElementById("verTarefaTitulo");
const verTarefaDataInicio = document.getElementById("verTarefaDataInicio");
const verTarefaDataFim = document.getElementById("verTarefaDataFim");
const verTarefaDescricao = document.getElementById("verTarefaDescricao");
const inputPesquisa = document.getElementById("inputPesquisa");
const selectUrgenciaModal = document.getElementById("selectUrgenciaModal");
const selectEditarUrgencia = document.getElementById("selectEditarUrgencia");
const verTarefaUrgenciaBadge = document.getElementById("verTarefaUrgenciaBadge");

const swalWithBootstrapButtons = Swal.mixin({
    customClass: { confirmButton: "btn btn-success ms-2", cancelButton: "btn btn-danger" },
    buttonsStyling: false
});

const hojeCompleto = new Date();
const dataMinimaFormatada = hojeCompleto.toISOString().split('T')[0];
if (inputDataInicioModal) inputDataInicioModal.min = dataMinimaFormatada;
if (inputEditarDataInicio) inputEditarDataInicio.min = dataMinimaFormatada;

function carregarUrgencias() {
    fetch(API_URGENCIAS_URL)
        .then(res => res.json())
        .then(dados => {
            arrUrgencia = dados;
            renderizarUrgencias();
            carregarTarefas();
        })
        .catch(err => console.error("Erro ao carregar urgências da API:", err));
}

function renderizarUrgencias() {
    selectUrgenciaModal.innerHTML = "";
    selectEditarUrgencia.innerHTML = "";

    const optDefault = document.createElement("option");
    optDefault.value = "";
    optDefault.disabled = true;
    optDefault.selected = true;
    optDefault.textContent = "Selecione a urgência...";
    selectUrgenciaModal.appendChild(optDefault);

    arrUrgencia.forEach(urg => {
        const optNova = document.createElement("option");
        optNova.value = urg.id;
        optNova.textContent = `${urg.descricao} (Prazo: ${urg.prazo})`;
        optNova.style.backgroundColor = urg.cor;
        optNova.style.color = urg.cor === "#ffc107" ? "#000000" : "#ffffff";
        optNova.style.fontWeight = "bold";
        selectUrgenciaModal.appendChild(optNova);

        const optEditar = document.createElement("option");
        optEditar.value = urg.id;
        optEditar.textContent = `${urg.descricao} (Prazo: ${urg.prazo})`;
        optEditar.style.backgroundColor = urg.cor;
        optEditar.style.color = urg.cor === "#ffc107" ? "#000000" : "#ffffff";
        optEditar.style.fontWeight = "bold";
        selectEditarUrgencia.appendChild(optEditar);
    });
}

function carregarTarefas() {
    fetch(API_URL)
        .then(res => res.json())
        .then(dados => {
            tarefas = dados;
            renderizarTarefas();
        })
        .catch(err => console.error("Erro ao carregar tarefas da API:", err));
}

function formatarDataBR(dataString, incluirHora = false) {
    if (!dataString) return "";
    if (incluirHora) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }
    const dataPura = new Date(dataString + 'T00:00:00');
    return dataPura.toLocaleDateString('pt-BR');
}

function renderizarTarefas() {
    listaTarefas.innerHTML = "";
    let tarefasFiltradas = tarefas;

    if (filtroAtual === "pendentes") {
        tarefasFiltradas = tarefas.filter(t => !t.concluida);
    } else if (filtroAtual === "concluidas") {
        tarefasFiltradas = tarefas.filter(t => t.concluida);
    }

    if (termoPesquisa !== "") {
        tarefasFiltradas = tarefasFiltradas.filter(t =>
            t.texto.toLowerCase().includes(termoPesquisa.toLowerCase())
        );
    }

    if (tarefasFiltradas.length === 0) {
        listaTarefas.innerHTML = `<li class="list-group-item text-center text-muted py-3">Nenhuma tarefa encontrada.</li>`;
        atualizarContador();
        return;
    }

    tarefasFiltradas.forEach(function (tarefa) {
        const urgenciaDados = arrUrgencia.find(u => u.id === tarefa.urgenciaId) || arrUrgencia[0] || { cor: "#6c757d", descricao: "Padrão" };
        
        const li = document.createElement("li");
        li.className = "list-group-item d-flex align-items-center justify-content-between py-3";
        li.style.borderLeft = `6px solid ${urgenciaDados.cor}`;
        
        const divEsquerda = document.createElement("div");
        divEsquerda.className = "d-flex align-items-center gap-2";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "form-check-input";
        checkbox.checked = tarefa.concluida;

        const divTexto = document.createElement("div");
        divTexto.className = "d-flex flex-column";

        const span = document.createElement("span");
        span.textContent = tarefa.texto;
        span.className = "fw-bold";
        if (tarefa.concluida) span.className = "concluida fw-bold";

        const pDatas = document.createElement("small");
        pDatas.className = "text-muted extra-small mt-1 d-flex align-items-center gap-1";
        pDatas.innerHTML = `<img width="16" height="16" src="https://img.icons8.com/android/24/calendar.png" alt="calendar"/> <b>Início:</b> ${formatarDataBR(tarefa.dataInicio)} | 🏁 <b>Prazo:</b> ${formatarDataBR(tarefa.dataFim, true)}`;

        divTexto.appendChild(span);
        divTexto.appendChild(pDatas);

        checkbox.addEventListener("change", function () {
            tarefa.concluida = checkbox.checked;
            
            fetch(`${API_URL}/${tarefa.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tarefa)
            })
            .then(() => carregarTarefas())
            .catch(err => console.error("Erro ao atualizar status:", err));
        });

        divEsquerda.appendChild(checkbox);
        divEsquerda.appendChild(divTexto);

        const divDireita = document.createElement("div");
        divDireita.className = "d-flex align-items-center gap-1";

        const btnVer = document.createElement("button");
        btnVer.className = "btn btn-sm btn-link p-0 me-1";
        btnVer.innerHTML = `<img width="20" height="20" src="https://img.icons8.com/material-outlined/24/visible--v1.png" alt="visible--v1"/>`;
        btnVer.setAttribute("data-bs-toggle", "modal");
        btnVer.setAttribute("data-bs-target", "#modalVerTarefa");
        btnVer.addEventListener("click", function () {
            verTarefaTitulo.textContent = tarefa.texto;
            verTarefaDataInicio.textContent = formatarDataBR(tarefa.dataInicio);
            verTarefaDataFim.textContent = formatarDataBR(tarefa.dataFim, true);
            verTarefaDescricao.textContent = tarefa.descricao || "Nenhuma descrição informada.";
            verTarefaUrgenciaBadge.textContent = `${urgenciaDados.descricao} (Prazo previsto: ${urgenciaDados.prazo})`;
            verTarefaUrgenciaBadge.style.backgroundColor = urgenciaDados.cor;
            verTarefaUrgenciaBadge.style.color = urgenciaDados.cor === "#ffc107" ? "#000000" : "#ffffff";
        });

        const btnEditar = document.createElement("button");
        btnEditar.className = "btn btn-sm btn-link p-0 me-1";
        btnEditar.innerHTML = `<img width="20" height="20" src="https://img.icons8.com/ios-glyphs/30/edit--v1.png" alt="Editar"/>`;
        btnEditar.setAttribute("data-bs-toggle", "modal");
        btnEditar.setAttribute("data-bs-target", "#modalEditarTarefa");
        btnEditar.addEventListener("click", function () {
            inputEditarId.value = tarefa.id;
            inputEditarTitulo.value = tarefa.texto;
            inputEditarDataInicio.value = tarefa.dataInicio;
            inputEditarDataFim.value = tarefa.dataFim;
            inputEditarDescricao.value = tarefa.descricao || "";
            selectEditarUrgencia.value = tarefa.urgenciaId;
        });

        const btnDeletar = document.createElement("button");
        btnDeletar.className = "btn btn-sm btn-link text-danger text-decoration-none fw-bold fs-5";
        btnDeletar.innerHTML = "&times;";
        btnDeletar.addEventListener("click", function () {
            swalWithBootstrapButtons.fire({
                title: "Tem certeza?",
                text: `Você apagará a tarefa "${tarefa.texto}" permanentemente!`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sim, apagar!",
                cancelButtonText: "Não, cancelar!",
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`${API_URL}/${tarefa.id}`, { method: "DELETE" })
                        .then(() => {
                            carregarTarefas();
                            swalWithBootstrapButtons.fire("Deletada!", "Sua tarefa foi excluída com sucesso.", "success");
                        })
                        .catch(err => console.error("Erro ao deletar tarefa:", err));
                }
            });
        });

        divDireita.appendChild(btnVer);
        divDireita.appendChild(btnEditar);
        divDireita.appendChild(btnDeletar);
        li.appendChild(divEsquerda);
        li.appendChild(divDireita);
        listaTarefas.appendChild(li);
    });

    atualizarContador();
}

function atualizarContador() {
    const pendentes = tarefas.filter(t => !t.concluida).length;
    contadorTarefas.textContent = `${pendentes} ${pendentes === 1 ? 'tarefa pendente' : 'tarefas pendentes'}`;
}

function alterarFiltroAtivo(botaoAtivo, tipoFiltro) {
    [btnFiltroTodas, btnFiltroPendentes, btnFiltroConcluidos].forEach(b => b.classList.remove("active"));
    botaoAtivo.classList.add("active");
    filtroAtual = tipoFiltro;
    renderizarTarefas();
}

inputPesquisa.addEventListener("input", function () {
    termoPesquisa = this.value.trim();
    renderizarTarefas();
});

formModalTarefa.addEventListener("submit", function (event) {
    event.preventDefault(); 
    
    const texto = inputTituloModal.value.trim();
    const dataInicio = inputDataInicioModal.value;
    const dataFim = inputDataFimModal.value;
    const descricao = inputDescricaoModal.value.trim();
    const urgenciaId = Number(selectUrgenciaModal.value);

    if (texto === "" || !dataInicio || !dataFim || !urgenciaId) {
        Swal.fire({ icon: 'warning', title: 'Campos obrigatórios!', text: 'Por favor, preencha todos os campos e selecione a urgência.', confirmButtonColor: '#3085d6' });
        return;
    }

    const dataAtualPura = new Date().toISOString().split('T')[0];
    if (dataInicio < dataAtualPura) {
        Swal.fire({ icon: 'error', title: 'Data Inválida!', text: 'Não é permitido selecionar uma data de início retroativa.', confirmButtonColor: '#d33' });
        return;
    }

    if (new Date(dataFim) < new Date(dataInicio + 'T00:00:00')) {
        Swal.fire({ icon: 'error', title: 'Erro nas datas!', text: 'A data final com horário não pode ser inferior à data inicial.', confirmButtonColor: '#d33' });
        return;
    }

    const novaTarefa = {
        texto: texto,
        concluida: false,
        dataInicio: dataInicio,
        dataFim: dataFim,
        descricao: descricao,
        urgenciaId: urgenciaId
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaTarefa)
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro na resposta do servidor");
        return res.json();
    })
    .then(() => {
        btnFecharModal.click();
        formModalTarefa.reset();

        setTimeout(() => {
            Swal.fire({ 
                icon: "success", 
                title: "Tarefa adicionada!", 
                text: "Salva com sucesso.",
                showConfirmButton: false, 
                timer: 1500,
                timerProgressBar: true
            }).then(() => {
                carregarTarefas();
            });
        }, 400);
    })
    .catch(err => {
        console.error(err);
        Swal.fire({ 
            icon: 'error', 
            title: 'Não foi possível salvar!', 
            text: 'Verifique se o backend C# está ativo no terminal.',
            confirmButtonColor: '#d33'
        });
    });
});

formModalEditarTarefa.addEventListener("submit", function (event) {
    event.preventDefault(); 
    
    const idParaEditar = Number(inputEditarId.value);
    const textoAtualizado = inputEditarTitulo.value.trim();
    const dataInicioAtualizada = inputEditarDataInicio.value;
    const dataFimAtualizada = inputEditarDataFim.value;
    const descricaoAtualizada = inputEditarDescricao.value.trim();
    const urgenciaAtualizada = Number(selectEditarUrgencia.value);

    if (textoAtualizado === "" || !dataInicioAtualizada || !dataFimAtualizada || !urgenciaAtualizada) {
        Swal.fire({ icon: 'warning', title: 'Campos obrigatórios!', text: 'Por favor, preencha todos os campos antes de salvar.', confirmButtonColor: '#3085d6' });
        return;
    }

    const dataAtualPura = new Date().toISOString().split('T')[0];
    if (dataInicioAtualizada < dataAtualPura) {
        Swal.fire({ icon: 'error', title: 'Data Inválida!', text: 'Não é permitido selecionar uma data de início retroativa.', confirmButtonColor: '#d33' });
        return;
    }

    if (new Date(dataFimAtualizada) < new Date(dataInicioAtualizada + 'T00:00:00')) {
        Swal.fire({ icon: 'error', title: 'Erro nas datas!', text: 'A data final com horário não pode ser inferior à data inicial.', confirmButtonColor: '#d33' });
        return;
    }

    const tarefaEditada = {
        id: idParaEditar,
        texto: textoAtualizado,
        concluida: false, 
        dataInicio: dataInicioAtualizada,
        dataFim: dataFimAtualizada,
        descricao: descricaoAtualizada,
        urgenciaId: urgenciaAtualizada
    };

    fetch(`${API_URL}/${idParaEditar}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefaEditada)
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro na resposta do servidor");
        return res;
    })
    .then(() => {
        btnFecharModalEditar.click();
        
        setTimeout(() => {
            Swal.fire({ 
                icon: "success", 
                title: "Tarefa atualizada!", 
                text: "Modificações salvas com sucesso.",
                showConfirmButton: false, 
                timer: 1500,
                timerProgressBar: true
            }).then(() => {
                carregarTarefas();
            });
        }, 400);
    })
    .catch(err => {
        console.error(err);
        Swal.fire({ 
            icon: 'error', 
            title: 'Erro ao atualizar!', 
            text: 'Verifique se o backend C# está ativo no terminal.',
            confirmButtonColor: '#d33'
        });
    });
});

btnFiltroTodas.addEventListener("click", function () { alterarFiltroAtivo(this, "todas"); });
btnFiltroPendentes.addEventListener("click", function () { alterarFiltroAtivo(this, "pendentes"); });
btnFiltroConcluidos.addEventListener("click", function () { alterarFiltroAtivo(this, "concluidas"); });

btnLimparTodas.addEventListener("click", function (event) {
    event.preventDefault();
    if (tarefas.length === 0) return;

    swalWithBootstrapButtons.fire({
        title: "Tem certeza absoluta?",
        text: "Isso apagará TODAS as tarefas permanentemente do Banco de Dados!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, apagar tudo!",
        cancelButtonText: "Não, cancelar!",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${API_URL}/todas`, { method: "DELETE" })
                .then(() => {
                    carregarTarefas();
                    swalWithBootstrapButtons.fire("Limpo!", "O banco de dados foi completamente limpo.", "success");
                })
                .catch(err => console.error("Erro ao limpar banco de dados:", err));
        }
    });
});

carregarUrgencias();