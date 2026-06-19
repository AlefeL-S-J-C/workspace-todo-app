let tarefas = [];
let termoPesquisa = "";
let tarefaSelecionadaId = null;
let paginaAtivaId = null;

const API_URL = "http://localhost:5152/tarefas";
const API_URGENCIAS_URL = "http://localhost:5152/urgencias";
const API_TAGS_URL = "http://localhost:5152/tags";
const API_SUBTAREFAS_URL = "http://localhost:5152/subtarefas";
const API_NOTAS_URL = "http://localhost:5152/anotacoes";

let arrUrgencia = [];
let arrTags = [];

let notaEditandoId = null;
let paginasDaNota = [""];
let paginaAtualIndex = 0;

const formModalTarefa = document.getElementById("formModalTarefa");
const inputTituloModal = document.getElementById("inputTituloModal");
const inputDataInicioModal = document.getElementById("inputDataInicioModal");
const inputDataFimModal = document.getElementById("inputDataFimModal");
const inputDescricaoModal = document.getElementById("inputDescricaoModal");
const btnLimparTodas = document.getElementById("btnLimparTodas");
const contadorTarefas = document.getElementById("contadorTarefas");
const btnFecharModal = document.getElementById("btnFecharModal");
const formModalEditarTarefa = document.getElementById("formModalEditarTarefa");
const inputEditarId = document.getElementById("inputEditarId");
const inputEditarTitulo = document.getElementById("inputEditarTitulo");
const selectEditarStatus = document.getElementById("selectEditarStatus");
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
const formNovaSubtarefa = document.getElementById("formNovaSubtarefa");
const inputTextoSubtarefa = document.getElementById("inputTextoSubtarefa");
const listaSubtarefas = document.getElementById("listaSubtarefas");

const colAFazer = document.getElementById("colAFazer");
const colEmAndamento = document.getElementById("colEmAndamento");
const colConcluido = document.getElementById("colConcluido");

const countAFazer = document.getElementById("countAFazer");
const countEmAndamento = document.getElementById("countEmAndamento");
const countConcluido = document.getElementById("countConcluido");

const listaPaginas = document.getElementById("listaPaginas");
const tituloPaginaAtiva = document.getElementById("tituloPaginaAtiva");
const btnCriarPagina = document.getElementById("btnCriarPagina");
const btnAbrirModalCriar = document.getElementById("btnAbrirModalCriar");

const modalGaleriaNotas = document.getElementById("modalGaleriaNotas");
const listaNotas = document.getElementById("listaNotas");
const inputTituloNota = document.getElementById("inputTituloNota");
const selectTipoFolha = document.getElementById("selectTipoFolha");
const btnSalvarNota = document.getElementById("btnSalvarNota");
const btnAbrirGaleriaNotas = document.getElementById("btnAbrirGaleriaNotas");
const btnNovaNota = document.getElementById('btnNovaNota');

const canvas = document.getElementById("drawCanvas");
const ctx = canvas?.getContext("2d");
const corCaneta = document.getElementById("corCaneta");
const espessuraCaneta = document.getElementById("espessuraCaneta");
const btnBorracha = document.getElementById("btnBorracha");
const btnLimparCanvas = document.getElementById("btnLimparCanvas");

const btnPaginaAnterior = document.getElementById("btnPaginaAnterior");
const btnProximaPagina = document.getElementById("btnProximaPagina");
const btnNovaPaginaNota = document.getElementById("btnNovaPaginaNota");
const lblPaginaAtual = document.getElementById("lblPaginaAtual");

const btnAlternarSidebar = document.getElementById("btnAlternarSidebar");
const btnFecharSidebarMenu = document.getElementById("btnFecharSidebarMenu");
const sidebarMenu = document.getElementById("sidebarMenu");
const sidebarOverlay = document.getElementById("sidebarOverlay");

let isDrawing = false;
let isEraser = false;

const swalWithBootstrapButtons = Swal.mixin({
    customClass: { confirmButton: "btn btn-success ms-2", cancelButton: "btn btn-danger" },
    buttonsStyling: false
});

const hojeCompleto = new Date();
const dataMinimaFormatada = hojeCompleto.toISOString().split('T')[0];
if (inputDataInicioModal) inputDataInicioModal.min = dataMinimaFormatada;
if (inputEditarDataInicio) inputEditarDataInicio.min = dataMinimaFormatada;

function alternarMenuMovel() {
    if (sidebarMenu && sidebarOverlay) {
        sidebarMenu.classList.toggle("show");
    }
}
if (btnAlternarSidebar) btnAlternarSidebar.addEventListener("click", alternarMenuMovel);
if (btnFecharSidebarMenu) btnFecharSidebarMenu.addEventListener("click", alternarMenuMovel);
if (sidebarOverlay) sidebarOverlay.addEventListener("click", alternarMenuMovel);

function inicializarSistema() {
    fetch(API_URGENCIAS_URL)
        .then(res => res.json())
        .then(dadosUrg => {
            arrUrgencia = dadosUrg;
            renderizarUrgencias();
            return fetch(API_TAGS_URL);
        })
        .then(res => res.json())
        .then(dadosTags => {
            arrTags = dadosTags;
            if (arrTags.length > 0 && paginaAtivaId === null) {
                paginaAtivaId = arrTags[0].id;
            }
            renderizarMenuLateral();
            carregarTarefas();
        })
        .catch(err => console.error(err));
}

function atualizarCorSelect(selectElement) {
    const selecionado = arrUrgencia.find(u => u.id == selectElement.value);
    if (selecionado) {
        selectElement.style.backgroundColor = selecionado.cor;
        selectElement.style.color = "#ffffff";
    } else {
        selectElement.style.backgroundColor = "";
        selectElement.style.color = "";
    }
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
        const textoComPrazo = `${urg.descricao} - ${urg.prazo}`;

        const optNova = document.createElement("option");
        optNova.value = urg.id;
        optNova.textContent = textoComPrazo;
        optNova.style.backgroundColor = urg.cor;
        optNova.style.color = "#ffffff";
        selectUrgenciaModal.appendChild(optNova);

        const optEditar = document.createElement("option");
        optEditar.value = urg.id;
        optEditar.textContent = textoComPrazo;
        optEditar.style.backgroundColor = urg.cor;
        optEditar.style.color = "#ffffff";
        selectEditarUrgencia.appendChild(optEditar);
    });
}

function calcularPrazoAutomatico(selectElement, inputInicio, inputFim) {
    let dataInicioStr = inputInicio.value;
    const urgencyId = selectElement.value;

    if (!dataInicioStr && urgencyId) {
        const hoje = new Date();
        dataInicioStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
        inputInicio.value = dataInicioStr;
    }

    if (!dataInicioStr || !urgencyId) return;

    const dataAlvo = new Date(dataInicioStr + "T00:00:00");
    const agora = new Date();
    dataAlvo.setHours(agora.getHours(), agora.getMinutes());

    const urgency = arrUrgencia.find(u => u.id == urgencyId);
    if (!urgency) return;

    let diasAdicionar = 0;
    switch (urgency.descricao) {
        case "Não Urgente": diasAdicionar = 24; break;
        case "Pouco Urgente": diasAdicionar = 12; break;
        case "Urgente": diasAdicionar = 6; break;
        case "Muito Urgente": diasAdicionar = 1; break;
        case "Imediato": diasAdicionar = 0; break;
    }

    dataAlvo.setDate(dataAlvo.getDate() + diasAdicionar);
    
    const ano = dataAlvo.getFullYear();
    const mes = String(dataAlvo.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAlvo.getDate()).padStart(2, '0');
    const hora = String(dataAlvo.getHours()).padStart(2, '0');
    const minuto = String(dataAlvo.getMinutes()).padStart(2, '0');

    inputFim.value = `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}

selectUrgenciaModal.addEventListener("change", function() {
    atualizarCorSelect(this);
    calcularPrazoAutomatico(this, inputDataInicioModal, inputDataFimModal);
});
inputDataInicioModal.addEventListener("change", () => {
    calcularPrazoAutomatico(selectUrgenciaModal, inputDataInicioModal, inputDataFimModal);
});

selectEditarUrgencia.addEventListener("change", function() {
    atualizarCorSelect(this);
    calcularPrazoAutomatico(this, inputEditarDataInicio, inputEditarDataFim);
});
inputEditarDataInicio.addEventListener("change", () => {
    calcularPrazoAutomatico(selectEditarUrgencia, inputEditarDataInicio, inputEditarDataFim);
});

function renderizarMenuLateral() {
    listaPaginas.innerHTML = "";
    if (arrTags.length === 0) {
        listaPaginas.innerHTML = `<small class="text-muted d-block text-center py-3">Nenhuma página criada.</small>`;
        tituloPaginaAtiva.textContent = "Crie uma página";
        btnAbrirModalCriar.disabled = true;
        return;
    }
    btnAbrirModalCriar.disabled = false;
    arrTags.forEach(tag => {
        const item = document.createElement("div");
        item.className = `page-item ${tag.id === paginaAtivaId ? 'active' : ''}`;
        const spanNome = document.createElement("span");
        spanNome.textContent = `📄 ${tag.nome}`;
        item.appendChild(spanNome);
        if (tag.id === paginaAtivaId) {
            tituloPaginaAtiva.textContent = tag.nome;
        }
        item.addEventListener("click", () => {
            paginaAtivaId = tag.id;
            if (sidebarMenu && sidebarMenu.classList.contains("show")) {
                alternarMenuMovel();
            }
            renderizarMenuLateral();
            renderizarTarefas();
        });
        listaPaginas.appendChild(item);
    });
}

btnCriarPagina.addEventListener("click", () => {
    Swal.fire({
        title: 'Nova Página',
        input: 'text',
        inputPlaceholder: 'Digite o nome da página (Ex: Faculdade)',
        showCancelButton: true,
        confirmButtonText: 'Criar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed && result.value.trim() !== "") {
            const coresAleatorias = ["#686b6e", "#2471a3", "#229954", "#ca6f1e", "#ba4a00", "#7d3c98"];
            const novaTag = {
                nome: result.value.trim(),
                cor: coresAleatorias[Math.floor(Math.random() * coresAleatorias.length)]
            };
            fetch(API_TAGS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaTag)
            }).then(() => {
                paginaAtivaId = null;
                inicializarSistema();
            });
        }
    });
});

function carregarTarefas() {
    fetch(API_URL)
        .then(res => res.json())
        .then(dados => {
            tarefas = dados;
            renderizarTarefas();
            if (tarefaSelecionadaId !== null) {
                const atualizada = tarefas.find(t => t.id === tarefaSelecionadaId);
                if (atualizada) {
                    renderizarSubtarefas(atualizada.subtarefas);
                }
            }
        })
        .catch(err => console.error(err));
}

function formatarDataBR(dataString, incluirHora = false) {
    if (!dataString) return "";
    const data = new Date(dataString);
    if (incluirHora) {
        return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    }
    return data.toLocaleDateString('pt-BR');
}

function renderizarTarefas() {
    colAFazer.innerHTML = "";
    colEmAndamento.innerHTML = "";
    colConcluido.innerHTML = "";

    let cAFazer = 0;
    let cEmAndamento = 0;
    let cConcluido = 0;

    let tarefasFiltradas = tarefas.filter(t => t.tagId === paginaAtivaId);
    if (termoPesquisa !== "") {
        tarefasFiltradas = tarefasFiltradas.filter(t => t.texto.toLowerCase().includes(termoPesquisa.toLowerCase()));
    }

    tarefasFiltradas.forEach(tarefa => {
        const urgenciaDados = arrUrgencia.find(u => u.id === tarefa.urgenciaId) || { cor: "#6c757d", descricao: "Padrão" };
        const card = document.createElement("div");
        let classeAlertaPrazo = "";
        let badgeAlertaTexto = "";

        if (tarefa.status !== "Concluído" && tarefa.dataFim) {
            const agora = new Date();
            const dataPrazo = new Date(tarefa.dataFim);
            if (dataPrazo < agora) {
                classeAlertaPrazo = "bg-danger bg-opacity-10 animate-pulse";
                badgeAlertaTexto = `<span class="badge bg-danger extra-small ms-1">⚠️ ATRASADA</span>`;
            } else if (dataPrazo.toDateString() === agora.toDateString()) {
                classeAlertaPrazo = "bg-warning bg-opacity-25";
                badgeAlertaTexto = `<span class="badge bg-warning text-dark extra-small ms-1">⏰ HOJE</span>`;
            }
        }

        card.className = `kanban-card d-flex flex-column gap-2 ${classeAlertaPrazo}`;
        card.style.borderLeft = `5px solid ${urgenciaDados.cor}`;
        card.setAttribute("draggable", "true");
        card.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", tarefa.id);
        });

        const divHeader = document.createElement("div");
        divHeader.className = "d-flex align-items-start justify-content-between gap-1";

        const titleSpan = document.createElement("span");
        titleSpan.textContent = tarefa.texto;
        titleSpan.className = "fw-bold small";
        if (tarefa.status === "Concluído") titleSpan.className = "concluida fw-bold small";

        const divAcoes = document.createElement("div");
        divAcoes.className = "d-flex gap-1";

        const btnVer = document.createElement("button");
        btnVer.className = "btn btn-sm p-0 border-0 bg-transparent";
        btnVer.innerHTML = `<img width="16" height="16" src="https://img.icons8.com/material-outlined/24/visible--v1.png"/>`;
        btnVer.setAttribute("data-bs-toggle", "modal");
        btnVer.setAttribute("data-bs-target", "#modalVerTarefa");
        btnVer.addEventListener("click", (e) => {
            e.stopPropagation();
            tarefaSelecionadaId = tarefa.id;
            verTarefaTitulo.textContent = tarefa.texto;
            verTarefaDataInicio.textContent = formatarDataBR(tarefa.dataInicio);
            verTarefaDataFim.textContent = formatarDataBR(tarefa.dataFim, true);
            verTarefaDescricao.textContent = tarefa.descricao || "Sem descrição.";
            verTarefaUrgenciaBadge.textContent = urgenciaDados.descricao;
            verTarefaUrgenciaBadge.style.backgroundColor = urgenciaDados.cor;
            renderizarSubtarefas(tarefa.subtarefas);
        });

        const btnEditar = document.createElement("button");
        btnEditar.className = "btn btn-sm p-0 border-0 bg-transparent";
        btnEditar.innerHTML = `<img width="16" height="16" src="https://img.icons8.com/ios-glyphs/30/edit--v1.png"/>`;
        btnEditar.setAttribute("data-bs-toggle", "modal");
        btnEditar.setAttribute("data-bs-target", "#modalEditarTarefa");
        btnEditar.addEventListener("click", (e) => {
            e.stopPropagation();
            inputEditarId.value = tarefa.id;
            inputEditarTitulo.value = tarefa.texto;
            selectEditarStatus.value = tarefa.status || "A Fazer";
            inputEditarDataInicio.value = tarefa.dataInicio;
            inputEditarDataFim.value = tarefa.dataFim;
            inputEditarDescricao.value = tarefa.descricao || "";
            selectEditarUrgencia.value = tarefa.urgenciaId;
            atualizarCorSelect(selectEditarUrgencia);
        });

        const btnDeletar = document.createElement("button");
        btnDeletar.className = "btn btn-sm p-0 border-0 bg-transparent text-danger fw-bold fs-6";
        btnDeletar.innerHTML = "&times;";
        btnDeletar.addEventListener("click", (e) => {
            e.stopPropagation();
            swalWithBootstrapButtons.fire({
                title: "Excluir?",
                text: `Apagar permanentemente: "${tarefa.texto}"`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sim",
                cancelButtonText: "Não"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`${API_URL}/${tarefa.id}`, { method: "DELETE" })
                        .then(() => carregarTarefas());
                }
            });
        });

        divAcoes.appendChild(btnVer);
        divAcoes.appendChild(btnEditar);
        divAcoes.appendChild(btnDeletar);
        divHeader.appendChild(titleSpan);
        divHeader.appendChild(divAcoes);
        card.appendChild(divHeader);

        const divBadges = document.createElement("div");
        divBadges.className = "d-flex gap-1 flex-wrap align-items-center";

        const subConcluidas = tarefa.subtarefas.filter(s => s.concluida).length;
        const totalSubs = tarefa.subtarefas.length;
        if (totalSubs > 0) {
            const bSubs = document.createElement("span");
            bSubs.className = "badge extra-small bg-secondary text-white";
            bSubs.textContent = `📋 ${subConcluidas}/${totalSubs}`;
            divBadges.appendChild(bSubs);
        }
        if (badgeAlertaTexto) {
            const divAlertaWrapper = document.createElement("div");
            divAlertaWrapper.innerHTML = badgeAlertaTexto;
            divBadges.appendChild(divAlertaWrapper.firstChild);
        }
        card.appendChild(divBadges);

        const pPrazo = document.createElement("small");
        pPrazo.className = "text-muted extra-small";
        pPrazo.innerHTML = `🏁 Prazo: ${formatarDataBR(tarefa.dataFim, true)}`;
        card.appendChild(pPrazo);

        if (tarefa.status === "Em Andamento") {
            colEmAndamento.appendChild(card);
            cEmAndamento++;
        } else if (tarefa.status === "Concluído") {
            colConcluido.appendChild(card);
            cConcluido++;
        } else {
            colAFazer.appendChild(card);
            cAFazer++;
        }
    });

    countAFazer.textContent = cAFazer;
    countEmAndamento.textContent = cEmAndamento;
    countConcluido.textContent = cConcluido;

    const pendentesTotais = cAFazer + cEmAndamento;
    contadorTarefas.textContent = `${pendentesTotais} ${pendentesTotais === 1 ? 'tarefa pendente' : 'tarefas pendentes'}`;
}

function renderizarSubtarefas(lista) {
    listaSubtarefas.innerHTML = "";
    if (!lista || lista.length === 0) {
        listaSubtarefas.innerHTML = `<li class="list-group-item text-center text-muted py-2 small">Nenhuma subtarefa adicionada.</li>`;
        return;
    }
    lista.forEach(sub => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex align-items-center justify-content-between py-2 small";
        const divEsq = document.createElement("div");
        divEsq.className = "d-flex align-items-center gap-2";

        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.className = "form-check-input form-check-input-sm";
        chk.checked = sub.concluida;

        const txt = document.createElement("span");
        txt.textContent = sub.texto;
        if (sub.concluida) txt.className = "concluida";

        chk.addEventListener("change", () => {
            sub.concluida = chk.checked;
            fetch(`${API_SUBTAREFAS_URL}/${sub.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sub)
            }).then(() => carregarTarefas());
        });

        divEsq.appendChild(chk);
        divEsq.appendChild(txt);

        const btnDel = document.createElement("button");
        btnDel.className = "btn btn-sm text-danger p-0 border-0 bg-transparent fw-bold";
        btnDel.innerHTML = "&times;";
        btnDel.addEventListener("click", () => {
            fetch(`${API_SUBTAREFAS_URL}/${sub.id}`, { method: "DELETE" }).then(() => carregarTarefas());
        });

        li.appendChild(divEsq);
        li.appendChild(btnDel);
        listaSubtarefas.appendChild(li);
    });
}

inputPesquisa.addEventListener("input", function () {
    termoPesquisa = this.value.trim();
    renderizarTarefas();
});

formNovaSubtarefa.addEventListener("submit", function (e) {
    e.preventDefault();
    const texto = inputTextoSubtarefa.value.trim();
    if (!texto || !tarefaSelecionadaId) return;

    const novaSub = { texto: texto, concluida: false, tarefaId: tarefaSelecionadaId };
    fetch(API_SUBTAREFAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaSub)
    }).then(() => {
        inputTextoSubtarefa.value = "";
        carregarTarefas();
    });
});

formModalTarefa.addEventListener("submit", function (event) {
    event.preventDefault();
    const texto = inputTituloModal.value.trim();
    const dataInicio = inputDataInicioModal.value;
    const dataFim = inputDataFimModal.value;
    const genericDescricao = inputDescricaoModal.value.trim();
    const urgenciaId = Number(selectUrgenciaModal.value);
    const tagId = paginaAtivaId;

    if (texto === "" || !dataInicio || !dataFim || !urgenciaId || !tagId) return;

    const novaTarefa = {
        texto: texto,
        concluida: false,
        status: "A Fazer",
        dataInicio: dataInicio,
        dataFim: dataFim,
        descricao: genericDescricao,
        urgenciaId: urgenciaId,
        tagId: tagId
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaTarefa)
    }).then(() => {
        btnFecharModal.click();
        formModalTarefa.reset();
        selectUrgenciaModal.style.backgroundColor = "";
        selectUrgenciaModal.style.color = "";
        carregarTarefas();
    });
});

formModalEditarTarefa.addEventListener("submit", function (event) {
    event.preventDefault();
    const idParaEditar = Number(inputEditarId.value);
    const textoAtualizado = inputEditarTitulo.value.trim();
    const statusAtualizado = selectEditarStatus.value;
    const dataInicioAtualizada = inputEditarDataInicio.value;
    const dataFimAtualizada = inputEditarDataFim.value;
    const descricaoAtualizada = inputEditarDescricao.value.trim();
    const urgenciaAtualizada = Number(selectEditarUrgencia.value);
    const tagAtualizada = paginaAtivaId;

    const tOriginal = tarefas.find(item => item.id === idParaEditar);
    const mudouParaConcluido = (statusAtualizado === "Concluído" && (!tOriginal || tOriginal.status !== "Concluído"));

    const tarefaEditada = {
        id: idParaEditar,
        texto: textoAtualizado,
        status: statusAtualizado,
        concluida: statusAtualizado === "Concluído",
        dataInicio: dataInicioAtualizada,
        dataFim: dataFimAtualizada,
        descricao: descricaoAtualizada,
        urgenciaId: urgenciaAtualizada,
        tagId: tagAtualizada
    };

    fetch(`${API_URL}/${idParaEditar}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefaEditada)
    }).then(() => {
        btnFecharModalEditar.click();
        if (mudouParaConcluido && typeof confetti === "function") {
            confetti();
        }
        carregarTarefas();
    });
});

btnLimparTodas.addEventListener("click", () => {
    swalWithBootstrapButtons.fire({
        title: "Apagar todas as tarefas desta página?",
        icon: "warning",
        showCancelButton: true
    }).then((result) => {
        if (result.isConfirmed) {
            const tarefasDaPagina = tarefas.filter(t => t.tagId === paginaAtivaId);
            const promessas = tarefasDaPagina.map(t => fetch(`${API_URL}/${t.id}`, { method: "DELETE" }));
            Promise.all(promessas).then(() => carregarTarefas());
        }
    });
});

const modalVerTarefaEl = document.getElementById('modalVerTarefa');
if (modalVerTarefaEl) {
    modalVerTarefaEl.addEventListener('hidden.bs.modal', () => { tarefaSelecionadaId = null; });
}

if (modalGaleriaNotas) {
    modalGaleriaNotas.addEventListener('show.bs.modal', (e) => {
        if (!paginaAtivaId) {
            e.preventDefault();
            Swal.fire("Atenção", "Selecione ou crie uma página primeiro!", "warning");
            return;
        }
        carregarNotas();
    });
}

if (selectTipoFolha) {
    selectTipoFolha.addEventListener('change', (e) => {
        canvas.className = e.target.value;
    });
}

if (btnLimparCanvas) {
    btnLimparCanvas.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
}

if (btnBorracha) {
    btnBorracha.addEventListener('click', () => {
        isEraser = !isEraser;
        btnBorracha.classList.toggle('btn-secondary');
        btnBorracha.classList.toggle('btn-outline-secondary');
    });
}

function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
}

function startPosition(e) {
    isDrawing = true;
    ctx.beginPath();
    const { x, y } = getCoordinates(e);
    ctx.moveTo(x, y);
    if (e && e.pointerId) canvas.setPointerCapture(e.pointerId);
}

function endPosition(e) {
    isDrawing = false;
    ctx.beginPath();
    if (e && e.pointerId) canvas.releasePointerCapture(e.pointerId);
}

function draw(e) {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    ctx.lineWidth = espessuraCaneta.value;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (isEraser) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
    } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = corCaneta.value;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
}

if (canvas) {
    canvas.addEventListener("pointerdown", startPosition);
    canvas.addEventListener("pointerup", endPosition);
    canvas.addEventListener("pointermove", draw);
    canvas.addEventListener("pointerleave", endPosition);
    canvas.addEventListener("pointercancel", endPosition);
}

function salvarCanvasNoArray() {
    paginasDaNota[paginaAtualIndex] = canvas.toDataURL("image/png");
}

function carregarCanvasDoArray() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lblPaginaAtual.textContent = `Página ${paginaAtualIndex + 1} de ${paginasDaNota.length}`;
    if (paginasDaNota[paginaAtualIndex] && paginasDaNota[paginaAtualIndex] !== "") {
        const img = new Image();
        img.onload = () => {
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(img, 0, 0);
        };
        img.src = paginasDaNota[paginaAtualIndex];
    }
}

if (btnNovaPaginaNota) {
    btnNovaPaginaNota.addEventListener("click", () => {
        salvarCanvasNoArray();
        paginasDaNota.push("");
        paginaAtualIndex = paginasDaNota.length - 1;
        carregarCanvasDoArray();
    });
}

if (btnPaginaAnterior) {
    btnPaginaAnterior.addEventListener("click", () => {
        if (paginaAtualIndex > 0) {
            salvarCanvasNoArray();
            paginaAtualIndex--;
            carregarCanvasDoArray();
        }
    });
}

if (btnProximaPagina) {
    btnProximaPagina.addEventListener("click", () => {
        if (paginaAtualIndex < paginasDaNota.length - 1) {
            salvarCanvasNoArray();
            paginaAtualIndex++;
            carregarCanvasDoArray();
        }
    });
}

if (btnNovaNota) {
    btnNovaNota.addEventListener('click', () => {
        notaEditandoId = null;
        paginasDaNota = [""];
        paginaAtualIndex = 0;
        inputTituloNota.value = "";
        selectTipoFolha.value = "paper-blank";
        canvas.className = "paper-blank";
        carregarCanvasDoArray();
        isEraser = false;
        btnBorracha.classList.remove('btn-secondary');
        btnBorracha.classList.add('btn-outline-secondary');
    });
}

if (btnSalvarNota) {
    btnSalvarNota.addEventListener('click', () => {
        salvarCanvasNoArray();
        const titulo = inputTituloNota.value.trim() || "Nota sem título";
        const imagensJson = JSON.stringify(paginasDaNota);
        const tipoFolha = selectTipoFolha.value;

        const dadosNota = {
            titulo: titulo,
            imagemBase64: imagensJson,
            tipoFolha: tipoFolha,
            tagId: paginaAtivaId
        };

        if (notaEditandoId) {
            dadosNota.id = notaEditandoId;
            fetch(`${API_NOTAS_URL}/${notaEditandoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosNota)
            }).then(() => finalizaSalvamento());
        } else {
            fetch(API_NOTAS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosNota)
            }).then(() => finalizaSalvamento());
        }
    });
}

function finalizaSalvamento() {
    document.getElementById('btnFecharCanvas').click();
    carregarNotas();
    Swal.fire("Sucesso!", "Nota digital salva.", "success");
}

function carregarNotas() {
    if (!paginaAtivaId) return;
    fetch(`${API_NOTAS_URL}/${paginaAtivaId}`)
        .then(res => res.json())
        .then(notas => renderizarNotas(notas))
        .catch(err => console.error(err));
}

function renderizarNotas(notas) {
    listaNotas.innerHTML = "";
    if (notas.length === 0) {
        listaNotas.innerHTML = `<span class="text-muted small">Nenhuma anotação nesta página.</span>`;
        return;
    }

    notas.forEach(nota => {
        let arrayDestaNota = [];
        try {
            arrayDestaNota = JSON.parse(nota.imagemBase64);
        } catch(e) {
            arrayDestaNota = [nota.imagemBase64];
        }

        const card = document.createElement("div");
        card.className = `nota-card ${nota.tipoFolha} d-flex flex-column`;
        card.style.width = "200px";
        card.style.height = "160px";
        card.style.position = "relative";

        const img = document.createElement("img");
        img.src = arrayDestaNota[0];
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
        img.style.position = "absolute";
        img.style.top = "0";
        img.style.left = "0";
        img.style.zIndex = "1";

        const divTitulo = document.createElement("div");
        divTitulo.className = "mt-auto bg-dark bg-opacity-75 text-white p-2 rounded small fw-bold text-center d-flex flex-column gap-2";
        divTitulo.style.position = "relative";
        divTitulo.style.zIndex = "2";

        const headerCard = document.createElement("div");
        headerCard.className = "d-flex justify-content-between align-items-center w-100";
        headerCard.innerHTML = `<span class="text-truncate" style="max-width: 100px;">${nota.titulo}</span> <span class="badge bg-secondary">${arrayDestaNota.length} pág</span>`;

        const divAcoes = document.createElement("div");
        divAcoes.className = "d-flex justify-content-between align-items-center w-100 mt-1";

        const btnVer = document.createElement("button");
        btnVer.className = "btn btn-sm p-0 border-0 bg-transparent";
        btnVer.innerHTML = `<img width="16" height="16" src="https://img.icons8.com/material-outlined/24/visible--v1.png"/>`;
        btnVer.onclick = (e) => {
            e.stopPropagation();
            visualizarNota(nota.titulo, arrayDestaNota, nota.tipoFolha);
        };

        const btnEditar = document.createElement("button");
        btnEditar.className = "btn btn-sm p-0 border-0 bg-transparent";
        btnEditar.innerHTML = `<img width="16" height="16" src="https://img.icons8.com/ios-glyphs/30/edit--v1.png"/>`;
        btnEditar.onclick = (e) => {
            e.stopPropagation();
            notaEditandoId = nota.id;
            paginasDaNota = [...arrayDestaNota];
            paginaAtualIndex = 0;
            inputTituloNota.value = nota.titulo;
            selectTipoFolha.value = nota.tipoFolha;
            canvas.className = nota.tipoFolha;

            const modalCanvasBootstrap = new bootstrap.Modal(document.getElementById('modalCanvas'));
            modalCanvasBootstrap.show();
            setTimeout(carregarCanvasDoArray, 300);
        };

        const btnDel = document.createElement("button");
        btnDel.className = "btn btn-sm p-0 border-0 bg-transparent text-danger fw-bold fs-5";
        btnDel.innerHTML = "&times;";
        btnDel.style.lineHeight = "1";
        btnDel.onclick = (e) => {
            e.stopPropagation();
            fetch(`${API_NOTAS_URL}/${nota.id}`, { method: "DELETE" }).then(() => carregarNotas());
        };

        divAcoes.appendChild(btnVer);
        divAcoes.appendChild(btnEditar);
        divAcoes.appendChild(btnDel);

        divTitulo.appendChild(headerCard);
        divTitulo.appendChild(divAcoes);
        card.appendChild(img);
        card.appendChild(divTitulo);
        listaNotas.appendChild(card);
    });
}

function visualizarNota(titulo, arrayImagens, tipoFolha) {
    let paginaView = 0;
    function mostrarSweetAlert() {
        Swal.fire({
            title: `${titulo} (Pág ${paginaView + 1}/${arrayImagens.length})`,
            imageUrl: arrayImagens[paginaView],
            imageWidth: 600,
            imageAlt: 'Anotação',
            showDenyButton: arrayImagens.length > 1,
            showCancelButton: arrayImagens.length > 1,
            confirmButtonText: 'Fechar',
            denyButtonText: '< Anterior',
            cancelButtonText: 'Próxima >',
            customClass: { popup: tipoFolha }
        }).then((result) => {
            if (result.isDenied && paginaView > 0) {
                paginaView--;
                mostrarSweetAlert();
            } else if (result.dismiss === Swal.DismissReason.cancel && paginaView < arrayImagens.length - 1) {
                paginaView++;
                mostrarSweetAlert();
            }
        });
    }
    mostrarSweetAlert();
}

[colAFazer, colEmAndamento, colConcluido].forEach(col => {
    col.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    col.addEventListener("drop", (e) => {
        e.preventDefault();
        const id = Number(e.dataTransfer.getData("text/plain"));
        const t = tarefas.find(item => item.id === id);
        if (!t) return;
        let s = "A Fazer";
        if (col === colEmAndamento) s = "Em Andamento";
        if (col === colConcluido) s = "Concluído";
        if (t.status === s) return;
        const mudouParaConcluido = (s === "Concluído" && t.status !== "Concluído");
        t.status = s;
        t.concluida = (s === "Concluído");
        fetch(`${API_URL}/${t.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(t)
        }).then(() => {
            if (mudouParaConcluido && typeof confetti === "function") {
                confetti();
            }
            carregarTarefas();
        });
    });
});

const switchDarkMode = document.getElementById("switchDarkMode");
if (switchDarkMode) {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        switchDarkMode.checked = true;
    }
    switchDarkMode.addEventListener("change", () => {
        if (switchDarkMode.checked) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("theme", "light");
        }
    });
}

inicializarSistema();