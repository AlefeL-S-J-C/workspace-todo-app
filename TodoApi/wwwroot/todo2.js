let tarefas = [];
let termoPesquisa = "";
let tarefaSelecionadaId = null;
let paginaAtivaId = null;

const API_URL = "http://localhost:5152/tarefas";
const API_URGENCIAS_URL = "http://localhost:5152/urgencias";
const API_TAGS_URL = "http://localhost:5152/tags";
const API_SUBTAREFAS_URL = "http://localhost:5152/subtarefas";
const API_NOTAS_URL = "http://localhost:5152/anotacoes";
const API_TRANSACOES_URL = "http://localhost:5152/transacoes";

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

const canvasWrapper = document.getElementById("canvasWrapper");
const canvas = document.getElementById("drawCanvas");
const ctx = canvas?.getContext("2d");
const corCaneta = document.getElementById("corCaneta");
const selectTextoFonte = document.getElementById("selectTextoFonte");
const selectTextoTamanho = document.getElementById("selectTextoTamanho");
const espessuraCaneta = document.getElementById("espessuraCaneta");
const btnCaneta = document.getElementById("btnCaneta");
const btnMarcaTexto = document.getElementById("btnMarcaTexto");
const btnTexto = document.getElementById("btnTexto");
const btnBorracha = document.getElementById("btnBorracha");
const btnUndo = document.getElementById("btnUndo");
const btnRedo = document.getElementById("btnRedo");
const btnLimparCanvas = document.getElementById("btnLimparCanvas");
const btnExportarNota = document.getElementById("btnExportarNota");

const btnPaginaAnterior = document.getElementById("btnPaginaAnterior");
const btnProximaPagina = document.getElementById("btnProximaPagina");
const btnNovaPaginaNota = document.getElementById("btnNovaPaginaNota");
const lblPaginaAtual = document.getElementById("lblPaginaAtual");

const btnAlternarSidebar = document.getElementById("btnAlternarSidebar");
const btnFecharSidebarMenu = document.getElementById("btnFecharSidebarMenu");
const sidebarMenu = document.getElementById("sidebarMenu");
const sidebarOverlay = document.getElementById("sidebarOverlay");

let isDrawing = false;
let currentTool = "pen";
let undoStack = [];
let redoStack = [];

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
            const tagAtiva = arrTags.find(t => t.id === paginaAtivaId);
            if (tagAtiva && tagAtiva.tipo === "financeiro") {
                mostrarFinanceiro();
            } else {
                carregarTarefas();
            }
        })
        .catch(err => console.error(err));
}

function atualizarCorSelect(selectElement) {
    if (!selectElement) return;
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
    if (selectUrgenciaModal) selectUrgenciaModal.innerHTML = "";
    if (selectEditarUrgencia) selectEditarUrgencia.innerHTML = "";

    const optDefault = document.createElement("option");
    optDefault.value = "";
    optDefault.disabled = true;
    optDefault.selected = true;
    optDefault.textContent = "Selecione a urgência...";
    if (selectUrgenciaModal) selectUrgenciaModal.appendChild(optDefault);

    arrUrgencia.forEach(urg => {
        const textoComPrazo = `${urg.descricao} - ${urg.prazo}`;

        const optNova = document.createElement("option");
        optNova.value = urg.id;
        optNova.textContent = textoComPrazo;
        optNova.style.backgroundColor = urg.cor;
        optNova.style.color = "#ffffff";
        if (selectUrgenciaModal) selectUrgenciaModal.appendChild(optNova);

        const optEditar = document.createElement("option");
        optEditar.value = urg.id;
        optEditar.textContent = textoComPrazo;
        optEditar.style.backgroundColor = urg.cor;
        optEditar.style.color = "#ffffff";
        if (selectEditarUrgencia) selectEditarUrgencia.appendChild(optEditar);
    });
}

function calcularPrazoAutomatico(selectElement, inputInicio, inputFim) {
    if (!selectElement || !inputInicio || !inputFim) return;
    
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

if (selectUrgenciaModal) {
    selectUrgenciaModal.addEventListener("change", function() {
        atualizarCorSelect(this);
        calcularPrazoAutomatico(this, inputDataInicioModal, inputDataFimModal);
    });
}

if (inputDataInicioModal) {
    inputDataInicioModal.addEventListener("change", () => {
        calcularPrazoAutomatico(selectUrgenciaModal, inputDataInicioModal, inputDataFimModal);
    });
}

if (selectEditarUrgencia) {
    selectEditarUrgencia.addEventListener("change", function() {
        atualizarCorSelect(this);
        calcularPrazoAutomatico(this, inputEditarDataInicio, inputEditarDataFim);
    });
}

if (inputEditarDataInicio) {
    inputEditarDataInicio.addEventListener("change", () => {
        calcularPrazoAutomatico(selectEditarUrgencia, inputEditarDataInicio, inputEditarDataFim);
    });
}

function renderizarMenuLateral() {
    if (!listaPaginas) return;
    listaPaginas.innerHTML = "";
    if (arrTags.length === 0) {
        listaPaginas.innerHTML = `<small class="text-muted d-block text-center py-3">Nenhuma página criada.</small>`;
        if (tituloPaginaAtiva) tituloPaginaAtiva.textContent = "Crie uma página";
        if (btnAbrirModalCriar) btnAbrirModalCriar.disabled = true;
        return;
    }
    if (btnAbrirModalCriar) btnAbrirModalCriar.disabled = false;
    
    arrTags.forEach(tag => {
        const item = document.createElement("div");
        item.className = `page-item ${tag.id === paginaAtivaId ? 'active' : ''}`;
        const spanNome = document.createElement("span");
        spanNome.textContent = `${tag.tipo === "financeiro" ? "💰" : "📄"} ${tag.nome}`;
        item.appendChild(spanNome);
        
        if (tag.id === paginaAtivaId && tituloPaginaAtiva) {
            tituloPaginaAtiva.textContent = tag.nome;
        }
        
        item.addEventListener("click", () => {
            paginaAtivaId = tag.id;
            if (sidebarMenu && sidebarMenu.classList.contains("show")) {
                alternarMenuMovel();
            }
            renderizarMenuLateral();
            if (tag.tipo === "financeiro") {
                mostrarFinanceiro();
            } else {
                mostrarKanban();
                renderizarTarefas();
            }
        });
        listaPaginas.appendChild(item);
    });
}

if (btnCriarPagina) {
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
}

function carregarTarefas() {
    fetch(API_URL)
        .then(res => res.json())
        .then(dados => {
            tarefas = dados;
            renderizarTarefas();
            if (tarefaSelecionadaId !== null) {
                const updated = tarefas.find(t => t.id === tarefaSelecionadaId);
                if (updated) {
                    renderizarSubtarefas(updated.subtarefas);
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
    if (!colAFazer || !colEmAndamento || !colConcluido) return;
    
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
            if (verTarefaTitulo) verTarefaTitulo.textContent = tarefa.texto;
            if (verTarefaDataInicio) verTarefaDataInicio.textContent = formatarDataBR(tarefa.dataInicio);
            if (verTarefaDataFim) verTarefaDataFim.textContent = formatarDataBR(tarefa.dataFim, true);
            if (verTarefaDescricao) verTarefaDescricao.textContent = tarefa.descricao || "Sem descrição.";
            if (verTarefaUrgenciaBadge) {
                verTarefaUrgenciaBadge.textContent = urgenciaDados.descricao;
                verTarefaUrgenciaBadge.style.backgroundColor = urgenciaDados.cor;
            }
            renderizarSubtarefas(tarefa.subtarefas);
        });

        const btnEditar = document.createElement("button");
        btnEditar.className = "btn btn-sm p-0 border-0 bg-transparent";
        btnEditar.innerHTML = `<img width="16" height="16" src="https://img.icons8.com/ios-glyphs/30/edit--v1.png"/>`;
        btnEditar.setAttribute("data-bs-toggle", "modal");
        btnEditar.setAttribute("data-bs-target", "#modalEditarTarefa");
        btnEditar.addEventListener("click", (e) => {
            e.stopPropagation();
            if (inputEditarId) inputEditarId.value = tarefa.id;
            if (inputEditarTitulo) inputEditarTitulo.value = tarefa.texto;
            if (selectEditarStatus) selectEditarStatus.value = tarefa.status || "A Fazer";
            if (inputEditarDataInicio) inputEditarDataInicio.value = tarefa.dataInicio;
            if (inputEditarDataFim) inputEditarDataFim.value = tarefa.dataFim;
            if (inputEditarDescricao) inputEditarDescricao.value = tarefa.descricao || "";
            if (selectEditarUrgencia) {
                selectEditarUrgencia.value = tarefa.urgenciaId;
                atualizarCorSelect(selectEditarUrgencia);
            }
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

    if (countAFazer) countAFazer.textContent = cAFazer;
    if (countEmAndamento) countEmAndamento.textContent = cEmAndamento;
    if (countConcluido) countConcluido.textContent = cConcluido;

    const pendentesTotais = cAFazer + cEmAndamento;
    if (contadorTarefas) contadorTarefas.textContent = `${pendentesTotais} ${pendentesTotais === 1 ? 'tarefa pendente' : 'tarefas pendentes'}`;
}

function renderizarSubtarefas(lista) {
    if (!listaSubtarefas) return;
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

if (inputPesquisa) {
    inputPesquisa.addEventListener("input", function () {
        termoPesquisa = this.value.trim();
        renderizarTarefas();
    });
}

if (formNovaSubtarefa) {
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
}

if (formModalTarefa) {
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
}

if (formModalEditarTarefa) {
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
}

if (btnLimparTodas) {
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
}

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
        if (canvas) canvas.className = e.target.value;
    });
}

if (btnLimparCanvas) {
    btnLimparCanvas.addEventListener('click', () => {
        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            document.querySelectorAll('.canvas-floating-text').forEach(e => e.remove());
            salvarEstadoCanvas();
        }
    });
}

function alternarFerramenta(ferramenta) {
    currentTool = ferramenta;
    if (btnCaneta) {
        btnCaneta.classList.toggle("btn-dark", ferramenta === "pen");
        btnCaneta.classList.toggle("btn-outline-secondary", ferramenta !== "pen");
    }
    if (btnMarcaTexto) {
        btnMarcaTexto.classList.toggle("btn-dark", ferramenta === "highlighter");
        btnMarcaTexto.classList.toggle("btn-outline-secondary", ferramenta !== "highlighter");
    }
    if (btnTexto) {
        btnTexto.classList.toggle("btn-dark", ferramenta === "text");
        btnTexto.classList.toggle("btn-outline-secondary", ferramenta !== "text");
    }
    if (btnBorracha) {
        btnBorracha.classList.toggle("btn-dark", ferramenta === "eraser");
        btnBorracha.classList.toggle("btn-outline-secondary", ferramenta !== "eraser");
    }
}

if (btnCaneta) btnCaneta.addEventListener("click", () => alternarFerramenta("pen"));
if (btnMarcaTexto) btnMarcaTexto.addEventListener("click", () => alternarFerramenta("highlighter"));
if (btnTexto) btnTexto.addEventListener("click", () => alternarFerramenta("text"));
if (btnBorracha) btnBorracha.addEventListener("click", () => alternarFerramenta("eraser"));

function hexParaRgba(hex, opacidade) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacidade})`;
}

function salvarEstadoCanvas() {
    if (canvas) {
        undoStack.push(canvas.toDataURL());
        redoStack = [];
    }
}

function desfazerAcao() {
    if (undoStack.length > 1 && ctx && canvas) {
        redoStack.push(undoStack.pop());
        const estadoAnterior = undoStack[undoStack.length - 1];
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(img, 0, 0);
        };
        img.src = estadoAnterior;
    }
}

function refazerAcao() {
    if (redoStack.length > 0 && ctx && canvas) {
        const proximoEstado = redoStack.pop();
        undoStack.push(proximoEstado);
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "source-over";
            ctx.drawImage(img, 0, 0);
        };
        img.src = proximoEstado;
    }
}

if (btnUndo) btnUndo.addEventListener("click", desfazerAcao);
if (btnRedo) btnRedo.addEventListener("click", refazerAcao);

window.addEventListener("keydown", (e) => {
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || document.activeElement.getAttribute("contenteditable") === "true") return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        desfazerAcao();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        refazerAcao();
    }
});

if (btnExportarNota) {
    btnExportarNota.addEventListener("click", () => {
        if (!canvas) return;
        
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tCtx = tempCanvas.getContext("2d");
        
        tCtx.fillStyle = '#ffffff';
        tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        const tipo = selectTipoFolha ? selectTipoFolha.value : "paper-blank";
        if (tipo === "paper-ruled") {
            tCtx.strokeStyle = "#cbd5e1";
            tCtx.lineWidth = 1;
            for(let y = 29; y < tempCanvas.height; y += 30) {
                tCtx.beginPath(); tCtx.moveTo(0, y); tCtx.lineTo(tempCanvas.width, y); tCtx.stroke();
            }
        } else if (tipo === "paper-grid") {
            tCtx.strokeStyle = "#cbd5e1";
            tCtx.lineWidth = 1;
            for(let x = 25; x < tempCanvas.width; x += 25) {
                tCtx.beginPath(); tCtx.moveTo(x, 0); tCtx.lineTo(x, tempCanvas.height); tCtx.stroke();
            }
            for(let y = 25; y < tempCanvas.height; y += 25) {
                tCtx.beginPath(); tCtx.moveTo(0, y); tCtx.lineTo(tempCanvas.width, y); tCtx.stroke();
            }
        } else if (tipo === "paper-dotted") {
            tCtx.fillStyle = "#94a3b8";
            for(let x = 25; x < tempCanvas.width; x += 25) {
                for(let y = 25; y < tempCanvas.height; y += 25) {
                    tCtx.beginPath(); tCtx.arc(x, y, 1.5, 0, Math.PI*2); tCtx.fill();
                }
            }
        }

        tCtx.drawImage(canvas, 0, 0);

        document.querySelectorAll('.canvas-floating-text').forEach(el => {
            tCtx.font = `${el.style.fontSize} ${el.style.fontFamily}`;
            tCtx.fillStyle = el.style.color;
            tCtx.textBaseline = "top";
            
            const left = parseFloat(el.style.left) || 0;
            const top = parseFloat(el.style.top) || 0;
            
            const linhas = el.innerText.split('\n');
            let curY = top + 2; 
            linhas.forEach(linha => {
                tCtx.fillText(linha, left + 4, curY); 
                curY += parseFloat(el.style.fontSize) * 1.2; 
            });
        });

        const link = document.createElement("a");
        link.download = `${inputTituloNota ? inputTituloNota.value.trim() : "nota"}.png`;
        link.href = tempCanvas.toDataURL("image/png");
        link.click();
    });
}

function getCoordinates(e) {
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
}

function startPosition(e) {
    if (!ctx || !canvas) return;

    document.querySelectorAll('.canvas-floating-text').forEach(t => t.blur());

    if (currentTool === "text") {
        if (e.button === 0) criarInputTexto(e);
        return;
    }

    const { x, y } = getCoordinates(e);
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (e && e.pointerId) canvas.setPointerCapture(e.pointerId);
}

function criarInputTexto(e) {
    if (!canvasWrapper) return;
    
    const div = document.createElement("div");
    div.contentEditable = "true";
    div.className = "canvas-floating-text";
    
    const wrapperRect = canvasWrapper.getBoundingClientRect();
    const left = e.clientX - wrapperRect.left + canvasWrapper.scrollLeft;
    const top = e.clientY - wrapperRect.top + canvasWrapper.scrollTop;

    div.style.left = `${left}px`;
    div.style.top = `${top}px`;
    
    if (selectTextoFonte) div.style.fontFamily = selectTextoFonte.value;
    if (selectTextoTamanho) div.style.fontSize = `${selectTextoTamanho.value}px`;
    if (corCaneta) div.style.color = corCaneta.value;

    canvasWrapper.appendChild(div);
    
    setTimeout(() => {
        div.focus();
    }, 10);

    div.addEventListener("blur", () => {
        if (div.innerText.trim() === "") {
            div.remove();
        }
    });
}

function endPosition(e) {
    if (isDrawing && ctx && canvas) {
        isDrawing = false;
        ctx.beginPath();
        if (e && e.pointerId) canvas.releasePointerCapture(e.pointerId);
        salvarEstadoCanvas();
    }
}

function draw(e) {
    if (!isDrawing || currentTool === "text" || !ctx) return;
    const { x, y } = getCoordinates(e);
    
    ctx.lineJoin = "round";

    if (currentTool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.lineCap = "round";
        if (espessuraCaneta) ctx.lineWidth = espessuraCaneta.value;
    } else if (currentTool === "highlighter") {
        ctx.globalCompositeOperation = "destination-over"; 
        if (corCaneta) ctx.strokeStyle = hexParaRgba(corCaneta.value, 0.4);
        ctx.lineCap = "butt"; 
        ctx.lineJoin = "miter";
        if (espessuraCaneta) ctx.lineWidth = espessuraCaneta.value * 2.5; 
    } else {
        ctx.globalCompositeOperation = "source-over";
        if (corCaneta) ctx.strokeStyle = corCaneta.value;
        ctx.lineCap = "round";
        if (espessuraCaneta) ctx.lineWidth = espessuraCaneta.value;
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
    if (canvas) {
        const texts = [];
        document.querySelectorAll('.canvas-floating-text').forEach(el => {
            texts.push({
                text: el.innerText,
                left: el.style.left,
                top: el.style.top,
                fontFamily: el.style.fontFamily,
                fontSize: el.style.fontSize,
                color: el.style.color
            });
        });
        
        const pageData = {
            img: canvas.toDataURL("image/png"),
            texts: texts
        };
        paginasDaNota[paginaAtualIndex] = JSON.stringify(pageData);
    }
}

function carregarCanvasDoArray() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    document.querySelectorAll('.canvas-floating-text').forEach(e => e.remove());

    if (lblPaginaAtual) lblPaginaAtual.textContent = `Página ${paginaAtualIndex + 1} de ${paginasDaNota.length}`;
    
    let pageStr = paginasDaNota[paginaAtualIndex];
    if (!pageStr || pageStr === "") {
        undoStack = [canvas.toDataURL()];
        redoStack = [];
        return;
    }

    let imgSrc = pageStr;
    let texts = [];

    if (pageStr.startsWith("{")) {
        try {
            const parsed = JSON.parse(pageStr);
            imgSrc = parsed.img;
            texts = parsed.texts || [];
        } catch(e) {}
    }

    const img = new Image();
    img.onload = () => {
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(img, 0, 0);
        undoStack = [canvas.toDataURL()];
        redoStack = [];
    };
    img.src = imgSrc;

    texts.forEach(t => {
        const div = document.createElement("div");
        div.contentEditable = "true";
        div.className = "canvas-floating-text";
        div.style.left = t.left;
        div.style.top = t.top;
        div.style.fontFamily = t.fontFamily;
        div.style.fontSize = t.fontSize;
        div.style.color = t.color;
        div.innerText = t.text;
        
        div.addEventListener("blur", () => {
            if (div.innerText.trim() === "") div.remove();
        });
        
        if(canvasWrapper) canvasWrapper.appendChild(div);
    });
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
        if (inputTituloNota) inputTituloNota.value = "";
        if (selectTipoFolha) {
            selectTipoFolha.value = "paper-blank";
            if (canvas) canvas.className = "paper-blank";
        }
        carregarCanvasDoArray();
        alternarFerramenta("pen");
    });
}

if (btnSalvarNota) {
    btnSalvarNota.addEventListener('click', () => {
        salvarCanvasNoArray();
        const titulo = inputTituloNota ? inputTituloNota.value.trim() : "Nota sem título";
        const imagensJson = JSON.stringify(paginasDaNota);
        const tipoFolha = selectTipoFolha ? selectTipoFolha.value : "paper-blank";

        const dadosNota = {
            titulo: titulo || "Nota sem título",
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
    const btnFechar = document.getElementById('btnFecharCanvas');
    if (btnFechar) btnFechar.click();
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
    if (!listaNotas) return;
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

        let coverImgSrc = arrayDestaNota[0];
        if (coverImgSrc && coverImgSrc.startsWith("{")) {
            try { coverImgSrc = JSON.parse(coverImgSrc).img; } catch(e) {}
        }

        const img = document.createElement("img");
        img.src = coverImgSrc;
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
            if (inputTituloNota) inputTituloNota.value = nota.titulo;
            if (selectTipoFolha) {
                selectTipoFolha.value = nota.tipoFolha;
                if (canvas) canvas.className = nota.tipoFolha;
            }

            const elModal = document.getElementById('modalCanvas');
            if (elModal) {
                const modalCanvasBootstrap = new bootstrap.Modal(elModal);
                modalCanvasBootstrap.show();
                setTimeout(carregarCanvasDoArray, 300);
                alternarFerramenta("pen");
            }
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
        let displayImg = arrayImagens[paginaView];
        if (displayImg && displayImg.startsWith("{")) {
            try { displayImg = JSON.parse(displayImg).img; } catch(e) {}
        }

        Swal.fire({
            title: `${titulo} (Pág ${paginaView + 1}/${arrayImagens.length})`,
            imageUrl: displayImg,
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
    if (!col) return;
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

let transacoes = [];
const financeiroContainer = document.getElementById("financeiroContainer");
const kanbanContainer = document.querySelector(".kanban-container");
const contadorTarefasEl = document.getElementById("contadorTarefas");
const btnAbrirGaleriaNotasEl = document.getElementById("btnAbrirGaleriaNotas");
const btnAbrirModalCriarEl = document.getElementById("btnAbrirModalCriar");
const btnLimparTodasEl = document.getElementById("btnLimparTodas");
const inputPesquisaEl = document.getElementById("inputPesquisa");

const formTransacao = document.getElementById("formTransacao");
const inputTransacaoId = document.getElementById("inputTransacaoId");
const inputTransacaoDescricao = document.getElementById("inputTransacaoDescricao");
const inputTransacaoValor = document.getElementById("inputTransacaoValor");
const selectTransacaoTipo = document.getElementById("selectTransacaoTipo");
const selectTransacaoCategoria = document.getElementById("selectTransacaoCategoria");
const inputTransacaoData = document.getElementById("inputTransacaoData");
const modalTransacaoTitulo = document.getElementById("modalTransacaoTitulo");
const btnSalvarTransacao = document.getElementById("btnSalvarTransacao");
const listaTransacoes = document.getElementById("listaTransacoes");
const totalReceitas = document.getElementById("totalReceitas");
const totalDespesas = document.getElementById("totalDespesas");
const saldoTotal = document.getElementById("saldoTotal");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroMes = document.getElementById("filtroMes");
const btnNovaTransacao = document.getElementById("btnNovaTransacao");
const btnLimparTransacoes = document.getElementById("btnLimparTransacoes");

function mostrarKanban() {
    if (financeiroContainer) financeiroContainer.style.display = "none";
    if (kanbanContainer) kanbanContainer.style.display = "";
    if (contadorTarefasEl) contadorTarefasEl.style.display = "";
    if (btnAbrirGaleriaNotasEl) btnAbrirGaleriaNotasEl.style.display = "";
    if (btnAbrirModalCriarEl) btnAbrirModalCriarEl.style.display = "";
    if (btnLimparTodasEl) btnLimparTodasEl.style.display = "";
    if (inputPesquisaEl) inputPesquisaEl.style.display = "";
    if (btnLimparTransacoes) btnLimparTransacoes.style.display = "none";
}

function mostrarFinanceiro() {
    if (kanbanContainer) kanbanContainer.style.display = "none";
    if (financeiroContainer) financeiroContainer.style.display = "";
    if (contadorTarefasEl) contadorTarefasEl.style.display = "none";
    if (btnAbrirGaleriaNotasEl) btnAbrirGaleriaNotasEl.style.display = "none";
    if (btnAbrirModalCriarEl) btnAbrirModalCriarEl.style.display = "none";
    if (btnLimparTodasEl) btnLimparTodasEl.style.display = "none";
    if (inputPesquisaEl) inputPesquisaEl.style.display = "none";
    if (btnLimparTransacoes) btnLimparTransacoes.style.display = "";
    carregarTransacoes();
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarDataBRT(dataString) {
    if (!dataString) return "";
    const partes = dataString.split("T")[0].split("-");
    if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
    return dataString;
}

function popularFiltroMeses() {
    if (!filtroMes) return;
    const meses = new Set();
    transacoes.forEach(t => {
        const partes = t.data.split("T")[0].split("-");
        if (partes.length >= 2) meses.add(`${partes[0]}-${partes[1]}`);
    });
    filtroMes.innerHTML = '<option value="todos">Todos os meses</option>';
    const mesesOrdenados = [...meses].sort().reverse();
    mesesOrdenados.forEach(m => {
        const [ano, mes] = m.split("-");
        const nomeMes = new Date(Number(ano), Number(mes) - 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
        filtroMes.appendChild(opt);
    });
}

function carregarTransacoes() {
    if (!paginaAtivaId) return;
    fetch(`${API_TRANSACOES_URL}/${paginaAtivaId}`)
        .then(res => res.json())
        .then(dados => {
            transacoes = dados;
            popularFiltroMeses();
            renderizarResumoFinanceiro();
            renderizarTransacoes();
        })
        .catch(err => console.error(err));
}

function renderizarResumoFinanceiro() {
    let totalRec = 0, totalDesp = 0;
    const transacoesFiltradas = filtrarTransacoes();
    transacoesFiltradas.forEach(t => {
        if (t.tipo === "Receita") totalRec += t.valor;
        else totalDesp += t.valor;
    });
    if (totalReceitas) totalReceitas.textContent = formatarMoeda(totalRec);
    if (totalDespesas) totalDespesas.textContent = formatarMoeda(totalDesp);
    if (saldoTotal) {
        const saldo = totalRec - totalDesp;
        saldoTotal.textContent = formatarMoeda(saldo);
        saldoTotal.className = `financeiro-card-valor saldo-valor ${saldo >= 0 ? "saldo-positivo" : "saldo-negativo"}`;
    }
}

function filtrarTransacoes() {
    let resultado = [...transacoes];
    if (filtroCategoria && filtroCategoria.value !== "todas") {
        resultado = resultado.filter(t => t.categoria === filtroCategoria.value);
    }
    if (filtroMes && filtroMes.value !== "todos") {
        resultado = resultado.filter(t => t.data.startsWith(filtroMes.value));
    }
    return resultado;
}

function renderizarTransacoes() {
    if (!listaTransacoes) return;
    listaTransacoes.innerHTML = "";
    const transacoesFiltradas = filtrarTransacoes();
    if (transacoesFiltradas.length === 0) {
        listaTransacoes.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">Nenhuma transação encontrada.</td></tr>`;
        return;
    }
    transacoesFiltradas.forEach(t => {
        const tr = document.createElement("tr");
        const isReceita = t.tipo === "Receita";
        tr.innerHTML = `
            <td class="small">${formatarDataBRT(t.data)}</td>
            <td class="fw-semibold small">${t.descricao}</td>
            <td><span class="badge bg-secondary">${t.categoria}</span></td>
            <td><span class="badge ${isReceita ? "bg-success" : "bg-danger"}">${t.tipo}</span></td>
            <td class="text-end fw-bold ${isReceita ? "text-success" : "text-danger"}">${formatarMoeda(t.valor)}</td>
            <td class="text-center">
                <div class="d-flex gap-1 justify-content-center">
                    <button class="btn btn-sm p-0 border-0 bg-transparent btn-editar-transacao" data-id="${t.id}">
                        <img width="16" height="16" src="https://img.icons8.com/ios-glyphs/30/edit--v1.png"/>
                    </button>
                    <button class="btn btn-sm p-0 border-0 bg-transparent text-danger fw-bold btn-deletar-transacao" data-id="${t.id}">&times;</button>
                </div>
            </td>
        `;
        listaTransacoes.appendChild(tr);
    });

    listaTransacoes.querySelectorAll(".btn-editar-transacao").forEach(btn => {
        btn.addEventListener("click", () => editarTransacao(Number(btn.dataset.id)));
    });
    listaTransacoes.querySelectorAll(".btn-deletar-transacao").forEach(btn => {
        btn.addEventListener("click", () => deletarTransacao(Number(btn.dataset.id)));
    });
}

function abrirModalNovaTransacao() {
    if (inputTransacaoId) inputTransacaoId.value = "";
    if (modalTransacaoTitulo) modalTransacaoTitulo.textContent = "Nova Transação";
    if (btnSalvarTransacao) btnSalvarTransacao.textContent = "Salvar";
    if (formTransacao) formTransacao.reset();
    if (inputTransacaoData) inputTransacaoData.value = new Date().toISOString().split("T")[0];
    if (selectTransacaoTipo) selectTransacaoTipo.value = "Despesa";
    if (selectTransacaoCategoria) selectTransacaoCategoria.value = "Outros";
}

function editarTransacao(id) {
    const t = transacoes.find(item => item.id === id);
    if (!t) return;
    if (inputTransacaoId) inputTransacaoId.value = t.id;
    if (modalTransacaoTitulo) modalTransacaoTitulo.textContent = "Editar Transação";
    if (btnSalvarTransacao) btnSalvarTransacao.textContent = "Atualizar";
    if (inputTransacaoDescricao) inputTransacaoDescricao.value = t.descricao;
    if (inputTransacaoValor) inputTransacaoValor.value = t.valor;
    if (selectTransacaoTipo) selectTransacaoTipo.value = t.tipo;
    if (selectTransacaoCategoria) selectTransacaoCategoria.value = t.categoria;
    if (inputTransacaoData) inputTransacaoData.value = t.data.split("T")[0];
    var modal = new bootstrap.Modal(document.getElementById("modalTransacao"));
    modal.show();
}

function deletarTransacao(id) {
    var t = transacoes.find(function(item) { return item.id === id; });
    if (!t) return;
    swalWithBootstrapButtons.fire({
        title: "Excluir?",
        text: "Apagar \"" + t.descricao + "\"?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
    }).then(function(result) {
        if (result.isConfirmed) {
            fetch(API_TRANSACOES_URL + "/" + id, { method: "DELETE" })
                .then(function() { carregarTransacoes(); });
        }
    });
}

if (btnNovaTransacao) {
    btnNovaTransacao.addEventListener("click", abrirModalNovaTransacao);
}

if (formTransacao) {
    formTransacao.addEventListener("submit", function (e) {
        e.preventDefault();
        var id = inputTransacaoId ? Number(inputTransacaoId.value) : 0;
        var descricao = inputTransacaoDescricao ? inputTransacaoDescricao.value.trim() : "";
        var valor = inputTransacaoValor ? parseFloat(inputTransacaoValor.value) : 0;
        var tipo = selectTransacaoTipo ? selectTransacaoTipo.value : "Despesa";
        var categoria = selectTransacaoCategoria ? selectTransacaoCategoria.value : "Outros";
        var data = inputTransacaoData ? inputTransacaoData.value : "";

        if (!descricao || valor <= 0 || !data) return;

        var dados = { descricao: descricao, valor: valor, tipo: tipo, categoria: categoria, data: data, tagId: paginaAtivaId };

        if (id > 0) {
            dados.id = id;
            fetch(API_TRANSACOES_URL + "/" + id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            }).then(function() {
                bootstrap.Modal.getInstance(document.getElementById("modalTransacao")).hide();
                carregarTransacoes();
            });
        } else {
            fetch(API_TRANSACOES_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            }).then(function() {
                bootstrap.Modal.getInstance(document.getElementById("modalTransacao")).hide();
                carregarTransacoes();
            });
        }
    });
}

if (filtroCategoria) {
    filtroCategoria.addEventListener("change", function() {
        renderizarResumoFinanceiro();
        renderizarTransacoes();
    });
}

if (filtroMes) {
    filtroMes.addEventListener("change", function() {
        renderizarResumoFinanceiro();
        renderizarTransacoes();
    });
}

if (btnLimparTransacoes) {
    btnLimparTransacoes.addEventListener("click", function() {
        swalWithBootstrapButtons.fire({
            title: "Limpar tudo?",
            text: "Todas as transações desta página serão apagadas permanentemente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, apagar tudo",
            cancelButtonText: "Cancelar"
        }).then(function(result) {
            if (result.isConfirmed) {
                fetch(API_TRANSACOES_URL + "/todas/" + paginaAtivaId, { method: "DELETE" })
                    .then(function() { carregarTransacoes(); });
            }
        });
    });
}

if (formTransacao) {
    formTransacao.querySelectorAll("input").forEach(function(inp) {
        inp.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                formTransacao.dispatchEvent(new Event("submit"));
            }
        });
    });
}

inicializarSistema();