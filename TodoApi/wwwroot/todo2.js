let tarefas = [];
let termoPesquisa = "";
let tarefaSelecionadaId = null;
let paginaAtivaId = null;
let calendar = null;
let modoCalendario = false;

const API_URL = "http://localhost:5152/tarefas";
const API_URGENCIAS_URL = "http://localhost:5152/urgencias";
const API_TAGS_URL = "http://localhost:5152/tags";
const API_SUBTAREFAS_URL = "http://localhost:5152/subtarefas";
const API_NOTAS_URL = "http://localhost:5152/anotacoes";
const API_TRANSACOES_URL = "http://localhost:5152/transacoes";
const API_CALENDARIO_URL = "http://localhost:5152/calendario";
const API_HABITOS_URL = "http://localhost:5152/habitos";
const API_REGISTROS_URL = "http://localhost:5152/registros-habitos";
const API_IA_DIVIDIR_URL = "http://localhost:5152/ia/dividir-tarefa";
const API_IA_RESUMIR_URL = "http://localhost:5152/ia/resumir-nota";
const API_TIMEBLOCKS_URL = "http://localhost:5152/timeblocks";
const API_MINDMAPS_URL = "http://localhost:5152/mindmaps";
const API_POMODORO_URL = "http://localhost:5152/pomodoro";

let arrUrgencia = [];
let arrTags = [];

let notaEditandoId = null;
let paginasDaNota = [""];
let paginaAtualIndex = 0;
let quillCriar = null;
let quillEditar = null;
let quillNota = null;
let notaQuillEditandoId = null;
let habitos = [];
let modoHabitos = false;
let modoAgenda = false;
let modoMindMap = false;
let timeBlocks = [];
let mindMaps = [];
let mindMapNodes = [];
let mindMapConnections = [];
let mindMapSelectedNodeId = null;
let mindMapConnectMode = false;
let mindMapConnectFrom = null;
let mindMapEditandoId = null;
let mindMapNextNodeId = 1;
let mindMapDefaultShape = "rounded";
let mindMapDefaultConnType = "straight";

const formModalTarefa = document.getElementById("formModalTarefa");
const inputTituloModal = document.getElementById("inputTituloModal");
const inputDataInicioModal = document.getElementById("inputDataInicioModal");
const inputDataFimModal = document.getElementById("inputDataFimModal");
const btnLimparTodas = document.getElementById("btnLimparTodas");
const contadorTarefas = document.getElementById("contadorTarefas");
const btnFecharModal = document.getElementById("btnFecharModal");
const formModalEditarTarefa = document.getElementById("formModalEditarTarefa");
const inputEditarId = document.getElementById("inputEditarId");
const inputEditarTitulo = document.getElementById("inputEditarTitulo");
const selectEditarStatus = document.getElementById("selectEditarStatus");
const inputEditarDataInicio = document.getElementById("inputEditarDataInicio");
const inputEditarDataFim = document.getElementById("inputEditarDataFim");
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
        const paginaAtiva = tag.id === paginaAtivaId && !modoCalendario && !modoAgenda && !modoHabitos && !modoMindMap;
        item.className = `page-item ${paginaAtiva ? 'active' : ''}`;
        const spanNome = document.createElement("span");
        spanNome.textContent = `${tag.tipo === "financeiro" ? "💰" : "📄"} ${tag.nome}`;
        item.appendChild(spanNome);
        
        if (tag.id === paginaAtivaId && tituloPaginaAtiva && !modoCalendario && !modoAgenda && !modoHabitos && !modoMindMap) {
            tituloPaginaAtiva.textContent = tag.nome;
        }
        
        item.addEventListener("click", () => {
            paginaAtivaId = tag.id;
            modoAgenda = false;
            modoCalendario = false;
            modoHabitos = false;
            modoMindMap = false;
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

    const divCalendario = document.createElement("div");
    divCalendario.className = `page-item ${modoCalendario ? 'active' : ''}`;
    divCalendario.style.marginTop = "8px";
    divCalendario.style.borderTop = "1px solid var(--border-color, #e3e5e8)";
    divCalendario.style.paddingTop = "12px";
    const spanCalendario = document.createElement("span");
    spanCalendario.textContent = "📅 Calendário";
    divCalendario.appendChild(spanCalendario);
    divCalendario.addEventListener("click", () => {
        modoCalendario = true;
        if (sidebarMenu && sidebarMenu.classList.contains("show")) {
            alternarMenuMovel();
        }
        renderizarMenuLateral();
        mostrarCalendario();
    });
    listaPaginas.appendChild(divCalendario);

    const divHabitos = document.createElement("div");
    divHabitos.className = `page-item ${modoHabitos ? 'active' : ''}`;
    divHabitos.style.marginTop = "4px";
    divHabitos.style.borderTop = "1px solid var(--border-color, #e3e5e8)";
    divHabitos.style.paddingTop = "8px";
    const spanHabitos = document.createElement("span");
    spanHabitos.textContent = "📊 Hábitos";
    divHabitos.appendChild(spanHabitos);
    divHabitos.addEventListener("click", () => {
        modoHabitos = true;
        modoCalendario = false;
        modoAgenda = false;
        modoMindMap = false;
        if (sidebarMenu && sidebarMenu.classList.contains("show")) {
            alternarMenuMovel();
        }
        renderizarMenuLateral();
        mostrarHabitos();
    });
    listaPaginas.appendChild(divHabitos);

    const divAgenda = document.createElement("div");
    divAgenda.className = `page-item ${modoAgenda ? 'active' : ''}`;
    divAgenda.style.marginTop = "4px";
    divAgenda.style.borderTop = "1px solid var(--border-color, #e3e5e8)";
    divAgenda.style.paddingTop = "8px";
    const spanAgenda = document.createElement("span");
    spanAgenda.textContent = "📅 Agenda";
    divAgenda.appendChild(spanAgenda);
    divAgenda.addEventListener("click", () => {
        modoAgenda = true;
        modoCalendario = false;
        modoHabitos = false;
        modoMindMap = false;
        if (sidebarMenu && sidebarMenu.classList.contains("show")) {
            alternarMenuMovel();
        }
        renderizarMenuLateral();
        mostrarAgenda();
    });
    listaPaginas.appendChild(divAgenda);

    const divMindMap = document.createElement("div");
    divMindMap.className = `page-item ${modoMindMap ? 'active' : ''}`;
    divMindMap.style.marginTop = "4px";
    divMindMap.style.borderTop = "1px solid var(--border-color, #e3e5e8)";
    divMindMap.style.paddingTop = "8px";
    const spanMindMap = document.createElement("span");
    spanMindMap.textContent = "🧠 Mapa Mental";
    divMindMap.appendChild(spanMindMap);
    divMindMap.addEventListener("click", () => {
        modoMindMap = true;
        modoAgenda = false;
        modoCalendario = false;
        modoHabitos = false;
        if (sidebarMenu && sidebarMenu.classList.contains("show")) {
            alternarMenuMovel();
        }
        renderizarMenuLateral();
        mostrarMindMaps();
    });
    listaPaginas.appendChild(divMindMap);
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
            pomodoroPopularTarefas();
            pomodoroAtualizarHistorico();
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
            if (verTarefaDescricao) {
                const _desc = tarefa.descricao || "";
                const _semTags = _desc.replace(/<[^>]*>/g, "").trim();
                verTarefaDescricao.innerHTML = _semTags ? _desc : "Sem descrição.";
            }
            if (verTarefaUrgenciaBadge) {
                verTarefaUrgenciaBadge.textContent = urgenciaDados.descricao;
                verTarefaUrgenciaBadge.style.backgroundColor = urgenciaDados.cor;
            }
            const verCusto = document.getElementById("verTarefaCusto");
            if (verCusto) {
                verCusto.textContent = tarefa.custoEstimado
                    ? `R$ ${Number(tarefa.custoEstimado).toFixed(2)}`
                    : "Não definido";
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
            if (quillEditar) quillEditar.root.innerHTML = tarefa.descricao || "";
            if (selectEditarUrgencia) {
                selectEditarUrgencia.value = tarefa.urgenciaId;
                atualizarCorSelect(selectEditarUrgencia);
            }
            const inputEditarCusto = document.getElementById("inputEditarCusto");
            if (inputEditarCusto) {
                inputEditarCusto.value = tarefa.custoEstimado ? tarefa.custoEstimado.toString() : "";
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
        if (tarefa.custoEstimado && tarefa.custoEstimado > 0) {
            const bCusto = document.createElement("span");
            bCusto.className = "badge extra-small bg-success text-white";
            bCusto.style.cursor = "pointer";
            bCusto.title = "Clique para lançar no Financeiro";
            bCusto.textContent = `R$ ${Number(tarefa.custoEstimado).toFixed(2)}`;
            bCusto.addEventListener("click", (e) => {
                e.stopPropagation();
                const tagFinanceira = arrTags.find(t => t.tipo === "financeiro");
                if (!tagFinanceira) {
                    Swal.fire("Atenção", "Nenhuma página Financeiro encontrada.", "warning");
                    return;
                }
                Swal.fire({
                    title: "Lançar no Financeiro?",
                    html: `Criar despesa de <b>R$ ${Number(tarefa.custoEstimado).toFixed(2)}</b><br>para "${tarefa.texto}"?`,
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Sim, lançar!",
                    cancelButtonText: "Cancelar"
                }).then(result => {
                    if (result.isConfirmed) {
                        const hoje = new Date().toISOString().split("T")[0];
                        fetch(API_TRANSACOES_URL, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                descricao: `Custo: ${tarefa.texto}`,
                                valor: Number(tarefa.custoEstimado),
                                tipo: "Despesa",
                                categoria: "Outros",
                                data: hoje,
                                tagId: tagFinanceira.id
                            })
                        }).then(res => {
                            if (res.ok) {
                                Swal.fire("Lançado!", "Valor registrado como despesa no Financeiro.", "success");
                            } else {
                                throw new Error();
                            }
                        }).catch(() => {
                            Swal.fire("Erro", "Não foi possível lançar no Financeiro.", "error");
                        });
                    }
                });
            });
            divBadges.appendChild(bCusto);
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
        const genericDescricao = quillCriar ? quillCriar.root.innerHTML : '';
        const urgenciaId = Number(selectUrgenciaModal.value);
        const tagId = paginaAtivaId;

        if (texto === "" || !dataInicio || !dataFim || !urgenciaId || !tagId) return;

        const inputCusto = document.getElementById("inputCustoModal");
        const custoEstimado = inputCusto ? parseFloat(inputCusto.value) || null : null;

        const novaTarefa = {
            texto: texto,
            concluida: false,
            status: "A Fazer",
            dataInicio: dataInicio,
            dataFim: dataFim,
            descricao: genericDescricao,
            urgenciaId: urgenciaId,
            tagId: tagId,
            custoEstimado: custoEstimado
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
            if (inputCusto) inputCusto.value = "";
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
        const descricaoAtualizada = quillEditar ? quillEditar.root.innerHTML : '';
        const urgenciaAtualizada = Number(selectEditarUrgencia.value);
        const tagAtualizada = paginaAtivaId;

        const tOriginal = tarefas.find(item => item.id === idParaEditar);
        const mudouParaConcluido = (statusAtualizado === "Concluído" && (!tOriginal || tOriginal.status !== "Concluído"));

        const inputEditarCusto = document.getElementById("inputEditarCusto");
        const custoEstimado = inputEditarCusto ? parseFloat(inputEditarCusto.value) || null : null;

        const tarefaEditada = {
            id: idParaEditar,
            texto: textoAtualizado,
            status: statusAtualizado,
            concluida: statusAtualizado === "Concluído",
            dataInicio: dataInicioAtualizada,
            dataFim: dataFimAtualizada,
            descricao: descricaoAtualizada,
            urgenciaId: urgenciaAtualizada,
            tagId: tagAtualizada,
            custoEstimado: custoEstimado
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
            if (mudouParaConcluido && custoEstimado && custoEstimado > 0) {
                const tagFinanceira = arrTags.find(t => t.tipo === "financeiro");
                Swal.fire({
                    title: "Lançar no Financeiro?",
                    html: `Deseja lançar o valor de <b>R$ ${custoEstimado.toFixed(2)}</b> no módulo Financeiro como despesa?`,
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonText: "Sim, lançar!",
                    cancelButtonText: "Não"
                }).then(result => {
                    if (result.isConfirmed && tagFinanceira) {
                        const hoje = new Date().toISOString().split("T")[0];
                        const transacao = {
                            descricao: `Custo: ${textoAtualizado}`,
                            valor: custoEstimado,
                            tipo: "Despesa",
                            categoria: "Outros",
                            data: hoje,
                            tagId: tagFinanceira.id
                        };
                        fetch(API_TRANSACOES_URL, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(transacao)
                        }).then(() => {
                            Swal.fire("Sucesso!", "Valor lançado no Financeiro.", "success");
                        }).catch(() => {
                            Swal.fire("Erro", "Não foi possível lançar no Financeiro.", "error");
                        });
                    }
                });
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
const calendarioContainer = document.getElementById("calendarioContainer");
const calendarioView = document.getElementById("calendarioView");
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
    modoHabitos = false;
    modoCalendario = false;
    modoAgenda = false;
    modoMindMap = false;
    if (financeiroContainer) financeiroContainer.style.display = "none";
    if (calendarioContainer) calendarioContainer.style.display = "none";
    if (habitosContainer) habitosContainer.style.display = "none";
    if (agendaContainer) agendaContainer.style.display = "none";
    if (mindmapContainer) mindmapContainer.style.display = "none";
    if (kanbanContainer) kanbanContainer.style.display = "";
    if (contadorTarefasEl) contadorTarefasEl.style.display = "";
    if (btnAbrirGaleriaNotasEl) btnAbrirGaleriaNotasEl.style.display = "";
    if (btnAbrirModalCriarEl) btnAbrirModalCriarEl.style.display = "";
    if (btnLimparTodasEl) btnLimparTodasEl.style.display = "";
    if (inputPesquisaEl) inputPesquisaEl.style.display = "";
    if (btnLimparTransacoes) btnLimparTransacoes.style.display = "none";
    if (tituloPaginaAtiva) {
        const tag = arrTags.find(t => t.id === paginaAtivaId);
        if (tag) tituloPaginaAtiva.textContent = tag.nome;
    }
}

function mostrarFinanceiro() {
    modoHabitos = false;
    modoCalendario = false;
    modoAgenda = false;
    modoMindMap = false;
    if (kanbanContainer) kanbanContainer.style.display = "none";
    if (calendarioContainer) calendarioContainer.style.display = "none";
    if (habitosContainer) habitosContainer.style.display = "none";
    if (agendaContainer) agendaContainer.style.display = "none";
    if (mindmapContainer) mindmapContainer.style.display = "none";
    if (financeiroContainer) financeiroContainer.style.display = "";
    if (contadorTarefasEl) contadorTarefasEl.style.display = "none";
    if (btnAbrirGaleriaNotasEl) btnAbrirGaleriaNotasEl.style.display = "none";
    if (btnAbrirModalCriarEl) btnAbrirModalCriarEl.style.display = "none";
    if (btnLimparTodasEl) btnLimparTodasEl.style.display = "none";
    if (inputPesquisaEl) inputPesquisaEl.style.display = "none";
    if (btnLimparTransacoes) btnLimparTransacoes.style.display = "";
    if (tituloPaginaAtiva) {
        const tag = arrTags.find(t => t.id === paginaAtivaId);
        if (tag) tituloPaginaAtiva.textContent = tag.nome;
    }
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

function mostrarCalendario() {
    modoHabitos = false;
    modoAgenda = false;
    modoMindMap = false;
    if (kanbanContainer) kanbanContainer.style.display = "none";
    if (financeiroContainer) financeiroContainer.style.display = "none";
    if (habitosContainer) habitosContainer.style.display = "none";
    if (agendaContainer) agendaContainer.style.display = "none";
    if (mindmapContainer) mindmapContainer.style.display = "none";
    if (contadorTarefasEl) contadorTarefasEl.style.display = "none";
    if (btnAbrirGaleriaNotasEl) btnAbrirGaleriaNotasEl.style.display = "none";
    if (btnAbrirModalCriarEl) btnAbrirModalCriarEl.style.display = "none";
    if (btnLimparTodasEl) btnLimparTodasEl.style.display = "none";
    if (inputPesquisaEl) inputPesquisaEl.style.display = "none";
    if (btnLimparTransacoes) btnLimparTransacoes.style.display = "none";
    if (calendarioContainer) calendarioContainer.style.display = "";
    if (tituloPaginaAtiva) tituloPaginaAtiva.textContent = "📅 Calendário";
    carregarEventosCalendario();
}

function carregarEventosCalendario() {
    fetch(API_CALENDARIO_URL)
        .then(res => res.json())
        .then(eventos => {
            const eventosAjustados = eventos.map(ev => {
                if (ev.type === 'tarefa' && ev.concluida) {
                    return { ...ev, color: '#9ca3af', textColor: '#ffffff' };
                }
                return ev;
            });
            if (!calendar) {
                inicializarCalendario(eventosAjustados);
            } else {
                calendar.removeAllEvents();
                eventosAjustados.forEach(ev => calendar.addEvent(ev));
            }
        })
        .catch(err => console.error(err));
}

function inicializarCalendario(eventosIniciais) {
    if (!calendarioView) return;
    if (calendar) {
        calendar.destroy();
        calendar = null;
    }

    calendar = new FullCalendar.Calendar(calendarioView, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        firstDay: 0,
        height: 'auto',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,listMonth'
        },
        buttonText: {
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana',
            list: 'Lista'
        },
        events: eventosIniciais,
        eventClick: function(info) {
            const ev = info.event;
            if (ev.extendedProps.type === 'tarefa') {
                const tarefa = tarefas.find(t => t.id === parseInt(ev.id.replace('task-', '')));
                if (tarefa) {
                    const u = arrUrgencia.find(u => u.id === tarefa.urgenciaId) || { cor: "#6c757d", descricao: "Padrão" };
                    if (verTarefaTitulo) verTarefaTitulo.textContent = tarefa.texto;
                    if (verTarefaDataInicio) verTarefaDataInicio.textContent = formatarDataBR(tarefa.dataInicio);
                    if (verTarefaDataFim) verTarefaDataFim.textContent = formatarDataBR(tarefa.dataFim, true);
                    if (verTarefaDescricao) {
                        const _desc = tarefa.descricao || "";
                        const _semTags = _desc.replace(/<[^>]*>/g, "").trim();
                        verTarefaDescricao.innerHTML = _semTags ? _desc : "Sem descrição.";
                    }
                    if (verTarefaUrgenciaBadge) {
                        verTarefaUrgenciaBadge.textContent = u.descricao;
                        verTarefaUrgenciaBadge.style.backgroundColor = u.cor;
                    }
                    tarefaSelecionadaId = tarefa.id;
                    renderizarSubtarefas(tarefa.subtarefas);
                    new bootstrap.Modal(document.getElementById('modalVerTarefa')).show();
                }
            } else if (ev.extendedProps.type === 'transacao') {
                Swal.fire({
                    title: ev.title,
                    html: `
                        <div style="text-align: left;">
                            <p><strong>Categoria:</strong> ${ev.extendedProps.categoria}</p>
                            <p><strong>Tipo:</strong> ${ev.extendedProps.tipo}</p>
                            <p><strong>Valor:</strong> ${formatarMoeda(ev.extendedProps.valor)}</p>
                            <p><strong>Data:</strong> ${formatarDataBRT(ev.startStr)}</p>
                            <p><strong>Página:</strong> ${ev.extendedProps.tagNome}</p>
                        </div>
                    `,
                    icon: ev.extendedProps.tipo === 'Receita' ? 'success' : 'error',
                    confirmButtonText: 'OK'
                });
            }
        },
        eventDidMount: function(info) {
            const el = info.el;
            const tipo = info.event.extendedProps.type;
            if (tipo === 'tarefa') {
                el.style.borderLeft = '4px solid rgba(255,255,255,0.5)';
            } else if (tipo === 'transacao') {
                el.style.borderLeft = '4px solid rgba(255,255,255,0.7)';
            }
            const titleEl = el.querySelector('.fc-event-title');
            if (titleEl) {
                titleEl.style.fontSize = '0.8rem';
                titleEl.style.fontWeight = '600';
            }
        },
        loading: function(isLoading) {
            if (!isLoading) {
                document.querySelectorAll('.fc-event').forEach(el => {
                    el.style.cursor = 'pointer';
                });
            }
        }
    });

    calendar.render();
}

// ===== Pomodoro Timer =====
const POMODORO_FOCUS = 25 * 60;
const POMODORO_BREAK = 5 * 60;

let pomodoroTimeLeft = POMODORO_FOCUS;
let pomodoroRunning = false;
let pomodoroFocus = true;
let pomodoroSessions = 0;
let pomodoroInterval = null;

const pomodoroDisplay = document.getElementById("pomodoroDisplay");
const pomodoroPhase = document.getElementById("pomodoroPhase");
const pomodoroStartBtn = document.getElementById("pomodoroStartBtn");
const pomodoroResetBtn = document.getElementById("pomodoroResetBtn");
const pomodoroSessionsEl = document.getElementById("pomodoroSessions");
const pomodoroTarefaSelect = document.getElementById("pomodoroTarefaSelect");
const pomodoroHistory = document.getElementById("pomodoroHistory");

function pomodoroFormatTime(secs) {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
}

function pomodoroUpdateDisplay() {
    if (pomodoroDisplay) {
        pomodoroDisplay.textContent = pomodoroFormatTime(pomodoroTimeLeft);
    }
    if (pomodoroPhase) {
        pomodoroPhase.textContent = pomodoroFocus ? "Foco" : "Descanso";
    }
    if (pomodoroSessionsEl) {
        pomodoroSessionsEl.textContent = `🍅 ${pomodoroSessions}`;
    }
    if (pomodoroDisplay) {
        pomodoroDisplay.className = "pomodoro-timer" +
            (pomodoroRunning ? " running" : "") +
            (!pomodoroFocus ? " break" : "");
    }
}

function pomodoroSalvarRegistro() {
    if (!pomodoroTarefaSelect || pomodoroTarefaSelect.value === "") return;
    const tarefaId = parseInt(pomodoroTarefaSelect.value);
    const cicloMin = Math.floor(POMODORO_FOCUS / 60);
    const registro = {
        tarefaId: tarefaId,
        data: new Date().toISOString().slice(0, 19).replace("T", " "),
        ciclosCompletados: 1,
        totalMinutos: cicloMin
    };
    fetch(`${API_POMODORO_URL}/registros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registro)
    }).then(() => pomodoroAtualizarHistorico()).catch(err => console.error(err));
}

function pomodoroStart() {
    if (pomodoroRunning) return;
    if (pomodoroTarefaSelect && pomodoroTarefaSelect.value === "") {
        Swal.fire("Atenção", "Selecione uma tarefa antes de iniciar o Pomodoro.", "warning");
        return;
    }
    pomodoroRunning = true;
    if (pomodoroStartBtn) pomodoroStartBtn.textContent = "⏸ Pausar";
    pomodoroInterval = setInterval(() => {
        pomodoroTimeLeft--;
        pomodoroUpdateDisplay();
        if (pomodoroTimeLeft <= 0) {
            pomodoroStop();
            if (pomodoroFocus) {
                pomodoroSessions++;
                pomodoroSalvarRegistro();
                pomodoroFocus = false;
                pomodoroTimeLeft = POMODORO_BREAK;
                pomodoroUpdateDisplay();
                if (Notification.permission === "granted") {
                    new Notification("Pomodoro", { body: "Descanso! Hora de pausar por 5 minutos." });
                }
            } else {
                pomodoroFocus = true;
                pomodoroTimeLeft = POMODORO_FOCUS;
                pomodoroUpdateDisplay();
                if (Notification.permission === "granted") {
                    new Notification("Pomodoro", { body: "Foco! Hora de trabalhar por 25 minutos." });
                }
            }
            if (pomodoroStartBtn) pomodoroStartBtn.textContent = "▶ Iniciar";
            pomodoroRunning = false;
        }
    }, 1000);
    pomodoroUpdateDisplay();
}

function pomodoroStop() {
    if (pomodoroInterval) {
        clearInterval(pomodoroInterval);
        pomodoroInterval = null;
    }
    pomodoroRunning = false;
    if (pomodoroStartBtn) pomodoroStartBtn.textContent = "▶ Iniciar";
}

function pomodoroReset() {
    pomodoroStop();
    pomodoroFocus = true;
    pomodoroTimeLeft = POMODORO_FOCUS;
    pomodoroUpdateDisplay();
}

if (pomodoroStartBtn) {
    pomodoroStartBtn.addEventListener("click", () => {
        if (pomodoroRunning) {
            pomodoroStop();
            pomodoroUpdateDisplay();
        } else {
            pomodoroStart();
        }
    });
}

if (pomodoroResetBtn) {
    pomodoroResetBtn.addEventListener("click", pomodoroReset);
}

pomodoroUpdateDisplay();

function pomodoroPopularTarefas() {
    if (!pomodoroTarefaSelect) return;
    const selected = pomodoroTarefaSelect.value;
    pomodoroTarefaSelect.innerHTML = '<option value="">Nenhuma tarefa selecionada</option>';
    tarefas.filter(t => t.tagId === paginaAtivaId && t.status !== "Concluído").forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.id;
        opt.textContent = t.texto;
        pomodoroTarefaSelect.appendChild(opt);
    });
    if (selected && [...pomodoroTarefaSelect.options].some(o => o.value === selected)) {
        pomodoroTarefaSelect.value = selected;
    }
}

function pomodoroAtualizarHistorico() {
    if (!pomodoroHistory) return;
    if (!pomodoroTarefaSelect || pomodoroTarefaSelect.value === "") {
        pomodoroHistory.textContent = "";
        return;
    }
    const tarefaId = parseInt(pomodoroTarefaSelect.value);
    fetch(`${API_POMODORO_URL}/registros/${tarefaId}`)
        .then(res => res.json())
        .then(registros => {
            const totalCiclos = registros.reduce((s, r) => s + r.ciclosCompletados, 0);
            const totalMin = registros.reduce((s, r) => s + r.totalMinutos, 0);
            const tarefa = tarefas.find(t => t.id === tarefaId);
            if (tarefa && totalCiclos > 0) {
                pomodoroHistory.textContent = `"${tarefa.texto}": ${totalCiclos} ciclo${totalCiclos > 1 ? 's' : ''} / ${totalMin} min`;
            } else {
                pomodoroHistory.textContent = "";
            }
        })
        .catch(() => {});
}

if (pomodoroTarefaSelect) {
    pomodoroTarefaSelect.addEventListener("change", pomodoroAtualizarHistorico);
}

if (Notification.permission === "default") {
    Notification.requestPermission();
}

// ===== Quill Editor Initialization =====
const quillEditorDescricao = document.getElementById("quillEditorDescricao");
const quillEditorEditarDescricao = document.getElementById("quillEditorEditarDescricao");
const quillEditorNota = document.getElementById("quillEditor");
const btnNovaNotaTexto = document.getElementById("btnNovaNotaTexto");
const btnSalvarNotaQuill = document.getElementById("btnSalvarNotaQuill");
const btnResumirNotaIA = document.getElementById("btnResumirNotaIA");
const btnDividirTarefaIAEditar = document.getElementById("btnDividirTarefaIAEditar");
const inputTituloQuill = document.getElementById("inputTituloQuill");
const habitosContainer = document.getElementById("habitosContainer");
const habitosGrid = document.getElementById("habitosGrid");
const habTotal = document.getElementById("habTotal");
const habHoje = document.getElementById("habHoje");
const habSequencia = document.getElementById("habSequencia");
const btnMapaGeralHabitosPage = document.getElementById("btnMapaGeralHabitosPage");
const contribuicaoGraf = document.getElementById("contribuicaoGraf");
const contadorSequencia = document.getElementById("contadorSequencia");

if (quillEditorDescricao) {
    quillCriar = new Quill(quillEditorDescricao, {
        theme: 'snow',
        placeholder: 'Descreva sua tarefa...',
        modules: { toolbar: [['bold','italic','underline','strike'],[{list:'ordered'},{list:'bullet'}],['link','code-block'],['clean']] }
    });
}

if (quillEditorEditarDescricao) {
    quillEditar = new Quill(quillEditorEditarDescricao, {
        theme: 'snow',
        placeholder: 'Descreva sua tarefa...',
        modules: { toolbar: [['bold','italic','underline','strike'],[{list:'ordered'},{list:'bullet'}],['link','code-block'],['clean']] }
    });
}

if (quillEditorNota) {
    quillNota = new Quill(quillEditorNota, {
        theme: 'snow',
        placeholder: 'Escreva sua nota...',
        modules: { toolbar: [['bold','italic','underline','strike'],[{header:[1,2,3,false]}],[{list:'ordered'},{list:'bullet'}],['link','code-block','blockquote'],[{color:[]},{background:[]}],['clean']] }
    });
}

// Clear Quill when create task modal opens
const modalCriarTarefa = document.getElementById("modalCriarTarefa");
if (modalCriarTarefa) {
    modalCriarTarefa.addEventListener('show.bs.modal', () => {
        if (quillCriar) quillCriar.root.innerHTML = '';
    });
}

// Reset Quill note modal state
const modalQuillEditor = document.getElementById("modalQuillEditor");
if (modalQuillEditor) {
    modalQuillEditor.addEventListener('show.bs.modal', () => {
        if (quillNota) quillNota.root.innerHTML = '';
        if (inputTituloQuill) inputTituloQuill.value = '';
        notaQuillEditandoId = null;
    });
}

// ===== Save Quill Note =====
if (btnSalvarNotaQuill) {
    btnSalvarNotaQuill.addEventListener('click', () => {
        if (!paginaAtivaId) {
            Swal.fire("Atenção", "Selecione uma página primeiro!", "warning");
            return;
        }
        const titulo = inputTituloQuill ? inputTituloQuill.value.trim() : '';
        if (!titulo) {
            Swal.fire("Atenção", "Digite um título para a nota.", "warning");
            return;
        }
        const conteudo = quillNota ? quillNota.root.innerHTML : '';
        if (!conteudo || conteudo === '<p><br></p>') {
            Swal.fire("Atenção", "Escreva algum conteúdo na nota.", "warning");
            return;
        }
        const dados = { titulo, conteudo, tipo: "quill", tagId: paginaAtivaId };
        const request = notaQuillEditandoId
            ? fetch(`${API_NOTAS_URL}/${notaQuillEditandoId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados) })
            : fetch(API_NOTAS_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados) });
        request.then(() => {
            bootstrap.Modal.getInstance(modalQuillEditor).hide();
            Swal.fire("Sucesso", "Nota salva com sucesso!", "success");
        }).catch(err => console.error(err));
    });
}

// ===== Nova Nota de Texto button =====
if (btnNovaNotaTexto) {
    btnNovaNotaTexto.addEventListener('click', () => {
        if (!paginaAtivaId) {
            Swal.fire("Atenção", "Selecione uma página primeiro!", "warning");
            return;
        }
        if (quillNota) quillNota.root.innerHTML = '';
        if (inputTituloQuill) inputTituloQuill.value = '';
        notaQuillEditandoId = null;
    });
}

// ===== IA: Dividir Tarefa =====
if (btnDividirTarefaIAEditar) {
    btnDividirTarefaIAEditar.addEventListener('click', () => {
        const titulo = inputEditarTitulo ? inputEditarTitulo.value.trim() : '';
        if (!titulo) {
            Swal.fire("Atenção", "Digite o nome da tarefa primeiro.", "warning");
            return;
        }
        btnDividirTarefaIAEditar.disabled = true;
        btnDividirTarefaIAEditar.textContent = "🤖 Gerando...";
        fetch(API_IA_DIVIDIR_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texto: titulo })
        })
        .then(res => res.json())
        .then(data => {
            if (data.subtarefas && data.subtarefas.length > 0) {
                const listaSub = document.getElementById("listaSubtarefas");
                if (listaSub) {
                    listaSub.innerHTML = '';
                    data.subtarefas.forEach(texto => {
                        const li = document.createElement("li");
                        li.className = "list-group-item d-flex align-items-center gap-2";
                        li.innerHTML = `<input class="form-check-input subtarefa-check" type="checkbox"> <span>${texto}</span>`;
                        listaSub.appendChild(li);
                    });
                    Swal.fire("Pronto!", `${data.subtarefas.length} subtarefas geradas pela IA.`, "success");
                }
            }
        })
        .catch(err => console.error(err))
        .finally(() => {
            btnDividirTarefaIAEditar.disabled = false;
            btnDividirTarefaIAEditar.textContent = "🤖 Dividir Tarefa com IA";
        });
    });
}

// ===== IA: Resumir Nota =====
if (btnResumirNotaIA) {
    btnResumirNotaIA.addEventListener('click', () => {
        const conteudo = quillNota ? quillNota.root.innerText.trim() : '';
        if (!conteudo) {
            Swal.fire("Atenção", "Escreva algum conteúdo na nota primeiro.", "warning");
            return;
        }
        btnResumirNotaIA.disabled = true;
        btnResumirNotaIA.textContent = "🤖 Resumindo...";
        fetch(API_IA_RESUMIR_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conteudo })
        })
        .then(res => res.json())
        .then(data => {
            if (data.resumo) {
                Swal.fire("Resumo", data.resumo, "info");
            }
        })
        .catch(err => console.error(err))
        .finally(() => {
            btnResumirNotaIA.disabled = false;
            btnResumirNotaIA.textContent = "🤖 Resumir com IA";
        });
    });
}

// ===== Hábitos System =====
function mostrarHabitos() {
    modoHabitos = true;
    modoAgenda = false;
    modoCalendario = false;
    modoMindMap = false;
    if (kanbanContainer) kanbanContainer.style.display = "none";
    if (financeiroContainer) financeiroContainer.style.display = "none";
    if (calendarioContainer) calendarioContainer.style.display = "none";
    if (agendaContainer) agendaContainer.style.display = "none";
    if (mindmapContainer) mindmapContainer.style.display = "none";
    if (contadorTarefasEl) contadorTarefasEl.style.display = "none";
    if (btnAbrirGaleriaNotasEl) btnAbrirGaleriaNotasEl.style.display = "none";
    if (btnAbrirModalCriarEl) btnAbrirModalCriarEl.style.display = "none";
    if (btnLimparTodasEl) btnLimparTodasEl.style.display = "none";
    if (inputPesquisaEl) inputPesquisaEl.style.display = "none";
    if (btnLimparTransacoes) btnLimparTransacoes.style.display = "none";
    if (habitosContainer) habitosContainer.style.display = "";
    if (tituloPaginaAtiva) tituloPaginaAtiva.textContent = "📊 Hábitos";
    carregarHabitos();
}

function carregarHabitos() {
    fetch(API_HABITOS_URL)
        .then(res => res.json())
        .then(dados => {
            habitos = dados;
            renderizarHabitos();
        })
        .catch(err => console.error(err));
}

function renderizarHabitos() {
    if (!habitosGrid) return;
    habitosGrid.innerHTML = "";
    if (habitos.length === 0) {
        habitosGrid.innerHTML = '<div class="text-center text-muted py-5 w-100"><p>Nenhum hábito criado.</p><button class="btn btn-success btn-sm" id="btnCriarPrimeiroHabito">+ Criar Primeiro Hábito</button></div>';
        const btn = document.getElementById("btnCriarPrimeiroHabito");
        if (btn) btn.addEventListener("click", () => abrirModalCriarHabito());
        atualizarStatsHabitos();
        return;
    }
    const hoje = new Date().toISOString().split("T")[0];

    habitos.sort((a, b) => {
        const aFeito = a.registros?.some(r => r.data === hoje && r.concluido) ? 1 : 0;
        const bFeito = b.registros?.some(r => r.data === hoje && r.concluido) ? 1 : 0;
        return aFeito - bFeito;
    });
    habitos.forEach(hab => {
        const feitoHoje = hab.registros?.some(r => r.data === hoje && r.concluido) || false;
        const cor = hab.cor || "#22c55e";
        const card = document.createElement("div");
        card.className = "habito-card";
        card.innerHTML = `
            <div class="habito-card-header">
                <div class="habito-nome" style="color:${cor}">
                    <span class="habito-indicator" style="background:${cor}"></span> ${hab.nome}
                </div>
                <div class="habito-actions">
                    <button class="btn btn-sm p-0 border-0 bg-transparent habito-editar" data-id="${hab.id}" title="Editar">✏️</button>
                    <button class="btn btn-sm p-0 border-0 bg-transparent text-danger habito-excluir" data-id="${hab.id}" title="Excluir">&times;</button>
                </div>
            </div>
            <div class="habito-card-body">
                <button class="btn ${feitoHoje ? 'btn-success' : 'btn-outline-success'} btn-sm w-100 habito-toggle" data-id="${hab.id}">
                    ${feitoHoje ? '✅ Concluído Hoje' : '☐ Marcar Hoje'}
                </button>
            </div>`;
        habitosGrid.appendChild(card);
    });
    habitosGrid.querySelectorAll(".habito-toggle").forEach(b => b.addEventListener("click", () => toggleHabito(Number(b.dataset.id))));
    habitosGrid.querySelectorAll(".habito-editar").forEach(b => b.addEventListener("click", () => abrirModalCriarHabito(Number(b.dataset.id))));
    habitosGrid.querySelectorAll(".habito-excluir").forEach(b => b.addEventListener("click", () => excluirHabito(Number(b.dataset.id))));
    atualizarStatsHabitos();
}

function atualizarStatsHabitos() {
    const hoje = new Date().toISOString().split("T")[0];
    if (habTotal) habTotal.textContent = habitos.length;
    if (habHoje) habHoje.textContent = habitos.filter(h => h.registros?.some(r => r.data === hoje && r.concluido)).length;
    let streak = 0;
    const d = new Date();
    while (true) {
        const chave = d.toISOString().split("T")[0];
        const count = habitos.filter(h => h.registros?.some(r => r.data === chave && r.concluido)).length;
        if (count > 0) { streak++; d.setDate(d.getDate() - 1); }
        else break;
    }
    if (habSequencia) habSequencia.textContent = `${streak} dias`;
}

function toggleHabito(id) {
    const hab = habitos.find(h => h.id === id);
    if (!hab) return;
    const hoje = new Date().toISOString().split("T")[0];
    const existente = hab.registros?.find(r => r.data === hoje);
    const concluido = existente ? !existente.concluido : true;
    fetch(API_REGISTROS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitoId: id, data: hoje, concluido })
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return carregarHabitos();
    })
    .catch(err => {
        console.error("toggleHabito error:", err);
        Swal.fire("Erro", "Não foi possível atualizar o hábito.", "error");
    });
}

function abrirModalCriarHabito(editarId) {
    const editar = editarId ? habitos.find(h => h.id === editarId) : null;
    Swal.fire({
        title: editar ? 'Editar Hábito' : 'Novo Hábito',
        html: `<input id="swal-nome" class="swal2-input" placeholder="Nome do hábito" value="${editar ? editar.nome : ''}">
               <div class="d-flex align-items-center gap-2 justify-content-center mt-2">
                   <label class="small text-muted">Cor:</label>
                   <input id="swal-cor" type="color" value="${editar ? editar.cor : '#22c55e'}" style="width:40px;height:40px;border:none;cursor:pointer;">
               </div>`,
        showCancelButton: true,
        confirmButtonText: editar ? 'Salvar' : 'Criar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nome = document.getElementById('swal-nome').value.trim();
            if (!nome) { Swal.showValidationMessage('O nome é obrigatório'); return; }
            return { nome, cor: document.getElementById('swal-cor').value };
        }
    }).then(r => {
        if (r.isConfirmed) {
            const req = editar
                ? fetch(`${API_HABITOS_URL}/${editar.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r.value) })
                : fetch(API_HABITOS_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r.value) });
            req.then(() => carregarHabitos()).catch(err => console.error(err));
        }
    });
}

function excluirHabito(id) {
    const hab = habitos.find(h => h.id === id);
    if (!hab) return;
    Swal.fire({
        title: 'Excluir?',
        text: `Apagar "${hab.nome}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
    }).then(r => {
        if (r.isConfirmed) fetch(`${API_HABITOS_URL}/${id}`, { method: "DELETE" }).then(() => carregarHabitos());
    });
}

function abrirGraficoHabito(habitoId, nome) {
    fetch(`${API_REGISTROS_URL}/${habitoId}`)
        .then(res => res.json())
        .then(registros => renderizarMapaContribuicao(registros, nome))
        .catch(err => console.error(err));
}

if (btnMapaGeralHabitosPage) {
    btnMapaGeralHabitosPage.addEventListener('click', () => {
        fetch(API_HABITOS_URL)
            .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
            .then(todos => {
                const mapa = new Map();
                const hoje = new Date();
                for (let i = 365; i >= 0; i--) {
                    const d = new Date(hoje);
                    d.setDate(d.getDate() - i);
                    const chave = d.toISOString().split("T")[0];
                    let count = 0;
                    todos.forEach(h => { if (h.registros?.some(r => r.data === chave && r.concluido)) count++; });
                    mapa.set(chave, count);
                }
                renderizarMapaContribuicao(mapa, "📊 Mapa Geral de Hábitos");
            })
            .catch(err => {
                console.error("MapaGeral error:", err);
                Swal.fire("Erro", "Não foi possível carregar o mapa geral.", "error");
            });
    });
}

function renderizarMapaContribuicao(dados, titulo) {
    const modal = new bootstrap.Modal(document.getElementById("modalHabitoGrafico"));
    if (!contribuicaoGraf) return;
    contribuicaoGraf.innerHTML = "";
    const hoje = new Date();
    let mapa = new Map();
    if (Array.isArray(dados)) {
        dados.forEach(r => { if (r.concluido) mapa.set(r.data, (mapa.get(r.data) || 0) + 1); });
    } else if (dados instanceof Map) {
        mapa = dados;
    }
    let streak = 0;
    const dStreak = new Date(hoje);
    while (true) {
        const chave = dStreak.toISOString().split("T")[0];
        if ((mapa.get(chave) || 0) > 0) { streak++; dStreak.setDate(dStreak.getDate() - 1); }
        else break;
    }
    let maxCount = 0;
    mapa.forEach(v => { if (v > maxCount) maxCount = v; });
    const startDate = new Date(hoje);
    startDate.setDate(startDate.getDate() - 363);
    const colWidth = 14;
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "overflow-x:auto;padding:8px 0;";
    const inner = document.createElement("div");
    inner.style.cssText = `display:grid;grid-template-columns:30px repeat(52,${colWidth}px);gap:2px;font-size:9px;color:#888;`;
    inner.innerHTML = '<div></div>';
    for (let w = 0; w < 52; w++) {
        const lbl = document.createElement("div");
        lbl.style.textAlign = "center";
        const dt = new Date(startDate);
        dt.setDate(dt.getDate() + w * 7);
        const mes = dt.toLocaleDateString("pt-BR", { month: "short" }).charAt(0).toUpperCase() + dt.toLocaleDateString("pt-BR", { month: "short" }).slice(1, 3);
        lbl.textContent = (w === 0 || dt.getDate() <= 7) ? mes : '';
        inner.appendChild(lbl);
    }
    const diasLabels = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
    for (let row = 0; row < 7; row++) {
        const lbl = document.createElement("div");
        lbl.textContent = row % 2 === 0 ? diasLabels[row] : '';
        lbl.style.cssText = "display:flex;align-items:center;height:12px;";
        inner.appendChild(lbl);
        for (let col = 0; col < 52; col++) {
            const dayIndex = col * 7 + row;
            const dt = new Date(startDate);
            dt.setDate(dt.getDate() + dayIndex);
            if (dt > hoje) { const e = document.createElement("div"); inner.appendChild(e); continue; }
            const chave = dt.toISOString().split("T")[0];
            const count = mapa.get(chave) || 0;
            const intensity = maxCount > 0 ? count / maxCount : 0;
            const sq = document.createElement("div");
            sq.style.cssText = `width:12px;height:12px;border-radius:2px;background:${count > 0 ? `rgba(34,197,94,${0.2 + intensity * 0.8})` : '#ebedf0'};cursor:pointer;`;
            sq.title = `${chave}: ${count} hábito${count !== 1 ? 's' : ''}`;
            inner.appendChild(sq);
        }
    }
    wrapper.appendChild(inner);
    contribuicaoGraf.appendChild(wrapper);
    if (contadorSequencia) contadorSequencia.textContent = `🔥 Sequência: ${streak} dias`;
    modal.show();
}

// ----------------------------------------------------------------------
// TIME BLOCKING (AGENDA DIÁRIA)
// ----------------------------------------------------------------------
const agendaContainer = document.getElementById("agendaContainer");
const agendaTimeline = document.getElementById("agendaTimeline");
const inputAgendaData = document.getElementById("inputAgendaData");
const btnAgendaHoje = document.getElementById("btnAgendaHoje");
const agendaTarefasCount = document.getElementById("agendaTarefasCount");
let agendaDataSelecionada = new Date().toISOString().split("T")[0];

function mostrarAgenda() {
    modoAgenda = true;
    modoMindMap = false;
    modoCalendario = false;
    modoHabitos = false;
    if (kanbanContainer) kanbanContainer.style.display = "none";
    if (financeiroContainer) financeiroContainer.style.display = "none";
    if (calendarioContainer) calendarioContainer.style.display = "none";
    if (habitosContainer) habitosContainer.style.display = "none";
    if (mindmapContainer) mindmapContainer.style.display = "none";
    if (agendaContainer) agendaContainer.style.display = "";
    if (contadorTarefasEl) contadorTarefasEl.style.display = "none";
    if (btnAbrirGaleriaNotasEl) btnAbrirGaleriaNotasEl.style.display = "none";
    if (btnAbrirModalCriarEl) btnAbrirModalCriarEl.style.display = "none";
    if (btnLimparTodasEl) btnLimparTodasEl.style.display = "none";
    if (inputPesquisaEl) inputPesquisaEl.style.display = "none";
    if (btnLimparTransacoes) btnLimparTransacoes.style.display = "none";
    if (tituloPaginaAtiva) tituloPaginaAtiva.textContent = "📅 Agenda Diária";
    if (inputAgendaData) inputAgendaData.value = agendaDataSelecionada;
    carregarTimeBlocks();
}

function carregarTimeBlocks() {
    if (!paginaAtivaId) return;
    fetch(`${API_TIMEBLOCKS_URL}/${agendaDataSelecionada}/${paginaAtivaId}`)
        .then(res => res.json())
        .then(dados => {
            timeBlocks = dados;
            renderizarAgenda();
        })
        .catch(err => console.error(err));
}

function renderizarAgenda() {
    if (!agendaTimeline) return;
    agendaTimeline.innerHTML = "";

    let total = 0;
    for (let h = 8; h < 22; h++) {
        for (let m = 0; m < 60; m += 30) {
            const horaStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
            const horaFim = m === 0
                ? `${String(h).padStart(2, "0")}:30`
                : `${String(h + 1).padStart(2, "0")}:00`;

            const block = timeBlocks.find(b => b.horaInicio === horaStr);
            const slot = document.createElement("div");
            slot.className = `agenda-slot ${block ? "has-task" : ""}`;
            slot.dataset.hora = horaStr;

            const timeLabel = document.createElement("div");
            timeLabel.className = "agenda-time";
            timeLabel.textContent = m === 0 ? horaStr : "";

            const content = document.createElement("div");
            content.className = "agenda-slot-content";

            if (block) {
                total++;
                const badge = document.createElement("div");
                badge.className = "agenda-task-badge";
                const cor = block.tarefa?.urgencia?.cor || "#6c757d";
                badge.style.borderLeft = `4px solid ${cor}`;

                const textSpan = document.createElement("span");
                textSpan.className = "task-text";
                textSpan.textContent = block.tarefa?.texto || "Tarefa";

                const timeSpan = document.createElement("span");
                timeSpan.className = "task-time";
                timeSpan.textContent = `${horaStr} - ${horaFim}`;

                const btnRemove = document.createElement("button");
                btnRemove.className = "btn-remove-slot";
                btnRemove.innerHTML = "&times;";
                btnRemove.addEventListener("click", (e) => {
                    e.stopPropagation();
                    removerTimeBlock(block.id);
                });

                badge.addEventListener("click", (e) => {
                    if (e.target === btnRemove) return;
                    const tarefa = tarefas.find(t => t.id === block.tarefaId);
                    if (tarefa) {
                        tarefaSelecionadaId = tarefa.id;
                        const u = arrUrgencia.find(u => u.id === tarefa.urgenciaId) || { cor: "#6c757d", descricao: "Padrão" };
                        if (verTarefaTitulo) verTarefaTitulo.textContent = tarefa.texto;
                        if (verTarefaDataInicio) verTarefaDataInicio.textContent = formatarDataBR(tarefa.dataInicio);
                        if (verTarefaDataFim) verTarefaDataFim.textContent = formatarDataBR(tarefa.dataFim, true);
                        if (verTarefaDescricao) {
                            const _desc = tarefa.descricao || "";
                            const _semTags = _desc.replace(/<[^>]*>/g, "").trim();
                            verTarefaDescricao.innerHTML = _semTags ? _desc : "Sem descrição.";
                        }
                        if (verTarefaUrgenciaBadge) {
                            verTarefaUrgenciaBadge.textContent = u.descricao;
                            verTarefaUrgenciaBadge.style.backgroundColor = u.cor;
                        }
                        renderizarSubtarefas(tarefa.subtarefas);
                        new bootstrap.Modal(document.getElementById("modalVerTarefa")).show();
                    }
                });

                badge.appendChild(textSpan);
                badge.appendChild(timeSpan);
                badge.appendChild(btnRemove);
                content.appendChild(badge);
            } else {
                const inputGroup = document.createElement("div");
                inputGroup.className = "agenda-input-group";

                const input = document.createElement("input");
                input.type = "text";
                input.className = "agenda-input";
                input.placeholder = "Nova tarefa...";
                input.dataset.hora = horaStr;
                input.dataset.horaFim = horaFim;

                const btnAdd = document.createElement("button");
                btnAdd.className = "agenda-btn-add";
                btnAdd.textContent = "+";
                btnAdd.title = "Adicionar tarefa";

                const handleAdd = () => {
                    const texto = input.value.trim();
                    if (!texto) return;
                    input.disabled = true;
                    btnAdd.disabled = true;
                    adicionarTarefaNaAgenda(texto, agendaDataSelecionada, horaStr, horaFim, () => {
                        input.value = "";
                        input.disabled = false;
                        btnAdd.disabled = false;
                        input.focus();
                    });
                };

                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") handleAdd();
                });
                btnAdd.addEventListener("click", handleAdd);

                inputGroup.appendChild(input);
                inputGroup.appendChild(btnAdd);
                content.appendChild(inputGroup);

                slot.addEventListener("click", () => input.focus());
            }

            slot.appendChild(timeLabel);
            slot.appendChild(content);
            agendaTimeline.appendChild(slot);
        }
    }

    if (agendaTarefasCount) agendaTarefasCount.textContent = `${total} ${total === 1 ? "tarefa" : "tarefas"} agendada${total !== 1 ? "s" : ""}`;
}

function adicionarTarefaNaAgenda(texto, data, horaInicio, horaFim, callback) {
    const dataFim = `${data}T23:59`;
    const novaTarefa = {
        texto: texto,
        concluida: false,
        status: "A Fazer",
        dataInicio: data,
        dataFim: dataFim,
        descricao: `Agendado em ${data} às ${horaInicio}`,
        urgenciaId: 3,
        tagId: paginaAtivaId
    };

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaTarefa)
    })
    .then(res => res.json())
    .then(tarefaCriada => {
        return fetch(API_TIMEBLOCKS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tarefaId: tarefaCriada.id,
                data: data,
                horaInicio: horaInicio,
                horaFim: horaFim,
                tagId: paginaAtivaId
            })
        });
    })
    .then(() => {
        carregarTimeBlocks();
        carregarTarefas();
        if (callback) callback();
    })
    .catch(err => {
        console.error(err);
        if (callback) callback();
    });
}

function removerTimeBlock(id) {
    fetch(`${API_TIMEBLOCKS_URL}/${id}`, { method: "DELETE" })
        .then(() => {
            carregarTimeBlocks();
            carregarTarefas();
        })
        .catch(err => console.error(err));
}

if (inputAgendaData) {
    inputAgendaData.addEventListener("change", () => {
        agendaDataSelecionada = inputAgendaData.value;
        carregarTimeBlocks();
    });
}

if (btnAgendaHoje) {
    btnAgendaHoje.addEventListener("click", () => {
        agendaDataSelecionada = new Date().toISOString().split("T")[0];
        if (inputAgendaData) inputAgendaData.value = agendaDataSelecionada;
        carregarTimeBlocks();
    });
}



// ----------------------------------------------------------------------
// MIND MAP (MAPEAMENTO MENTAL)
// ----------------------------------------------------------------------
const mindmapContainer = document.getElementById("mindmapContainer");
const listaMindMaps = document.getElementById("listaMindMaps");
const btnNovoMindMap = document.getElementById("btnNovoMindMap");
const mindMapSvg = document.getElementById("mindMapSvg");
const mindMapCanvasWrapper = document.getElementById("mindMapCanvasWrapper");
const btnMindMapAddNode = document.getElementById("btnMindMapAddNode");
const btnMindMapConnect = document.getElementById("btnMindMapConnect");
const btnMindMapDelete = document.getElementById("btnMindMapDelete");
const btnMindMapToTask = document.getElementById("btnMindMapToTask");
const btnMindMapExport = document.getElementById("btnMindMapExport");
const btnSalvarMindMap = document.getElementById("btnSalvarMindMap");
const inputMindMapTitulo = document.getElementById("inputMindMapTitulo");
const mindMapStatus = document.getElementById("mindMapStatus");
const btnMindMapAjuda = document.getElementById("btnMindMapAjuda");
const btnMindMapFerramentas = document.getElementById("btnMindMapFerramentas");

function mostrarMindMaps() {
    modoMindMap = true;
    modoAgenda = false;
    modoCalendario = false;
    modoHabitos = false;
    if (kanbanContainer) kanbanContainer.style.display = "none";
    if (financeiroContainer) financeiroContainer.style.display = "none";
    if (calendarioContainer) calendarioContainer.style.display = "none";
    if (habitosContainer) habitosContainer.style.display = "none";
    if (agendaContainer) agendaContainer.style.display = "none";
    if (mindmapContainer) mindmapContainer.style.display = "";
    if (contadorTarefasEl) contadorTarefasEl.style.display = "none";
    if (btnAbrirGaleriaNotasEl) btnAbrirGaleriaNotasEl.style.display = "none";
    if (btnAbrirModalCriarEl) btnAbrirModalCriarEl.style.display = "none";
    if (btnLimparTodasEl) btnLimparTodasEl.style.display = "none";
    if (inputPesquisaEl) inputPesquisaEl.style.display = "none";
    if (btnLimparTransacoes) btnLimparTransacoes.style.display = "none";
    if (tituloPaginaAtiva) tituloPaginaAtiva.textContent = "🧠 Mapas Mentais";
    carregarMindMaps();
}

function carregarMindMaps() {
    if (!paginaAtivaId) {
        if (listaMindMaps) listaMindMaps.innerHTML = '<span class="text-muted small">Selecione uma página primeiro.</span>';
        return;
    }
    fetch(`${API_MINDMAPS_URL}/${paginaAtivaId}`)
        .then(res => res.json())
        .then(dados => {
            mindMaps = dados;
            renderizarMindMaps();
        })
        .catch(err => console.error(err));
}

function renderizarMindMaps() {
    if (!listaMindMaps) return;
    listaMindMaps.innerHTML = "";
    if (mindMaps.length === 0) {
        listaMindMaps.innerHTML = '<div class="text-center text-muted py-5 w-100"><p>Nenhum mapa mental criado.</p><button class="btn btn-success btn-sm" id="btnCriarPrimeiroMindMap">+ Criar Primeiro Mapa</button></div>';
        const btn = document.getElementById("btnCriarPrimeiroMindMap");
        if (btn) btn.addEventListener("click", () => abrirMindMapEditor(null));
        return;
    }
    mindMaps.forEach(m => {
        let dados;
        try { dados = JSON.parse(m.dados); } catch(e) { dados = { nodes: [], connections: [] }; }
        const card = document.createElement("div");
        card.className = "mindmap-card";
        card.innerHTML = `
            <div class="mindmap-card-title">${m.titulo}</div>
            <div class="mindmap-card-meta">${dados.nodes?.length || 0} nós, ${dados.connections?.length || 0} conexões</div>
            <div class="d-flex gap-1 mt-2">
                <button class="btn btn-sm btn-outline-primary flex-fill editar-mindmap" data-id="${m.id}">✏️ Editar</button>
                <button class="btn btn-sm btn-outline-danger excluir-mindmap" data-id="${m.id}">&times;</button>
            </div>
        `;
        card.querySelector(".editar-mindmap").addEventListener("click", (e) => {
            e.stopPropagation();
            abrirMindMapEditor(m);
        });
        card.querySelector(".excluir-mindmap").addEventListener("click", (e) => {
            e.stopPropagation();
            excluirMindMap(m.id);
        });
        listaMindMaps.appendChild(card);
    });
}

function abrirMindMapEditor(mindMap) {
    mindMapEditandoId = mindMap ? mindMap.id : null;
    if (mindMap) {
        if (inputMindMapTitulo) inputMindMapTitulo.value = mindMap.titulo;
        try {
            const dados = JSON.parse(mindMap.dados);
            mindMapNodes = dados.nodes || [];
            mindMapConnections = dados.connections || [];
        } catch(e) {
            mindMapNodes = [];
            mindMapConnections = [];
        }
    } else {
        if (inputMindMapTitulo) inputMindMapTitulo.value = "Novo Mapa Mental";
        mindMapNodes = [];
        mindMapConnections = [];
    }
    mindMapNextNodeId = mindMapNodes.reduce((max, n) => Math.max(max, n.id || 0), 0) + 1;
    if (mindMapNextNodeId < 1) mindMapNextNodeId = 1;
    mindMapSelectedNodeId = null;
    mindMapConnectMode = false;
    mindMapConnectFrom = null;
    if (btnMindMapConnect) btnMindMapConnect.className = "btn btn-sm btn-outline-secondary";
    if (btnMindMapToTask) btnMindMapToTask.disabled = true;
    if (mindMapStatus) mindMapStatus.textContent = "Clique no fundo ou use o botão + Nó para criar";

    renderizarMindMapDivs();
    renderizarMindMapSvg();

    const elModal = document.getElementById("modalMindMapEditor");
    if (elModal) {
        const modal = new bootstrap.Modal(elModal, { focus: false });
        modal.show();
        setTimeout(() => {
            const wrapper = document.getElementById("mindMapCanvasWrapper");
            if (wrapper) {
                const rect = wrapper.getBoundingClientRect();
                const svg = document.getElementById("mindMapSvg");
                if (svg) {
                    svg.setAttribute("width", Math.max(1000, rect.width - 4));
                    svg.setAttribute("height", Math.max(600, rect.height - 4));
                }
            }
        }, 300);
    }
}

function renderizarMindMapSvg() {
    if (!mindMapSvg) return;
    const svg = mindMapSvg;

    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }

    const wrapper = document.getElementById("mindMapCanvasWrapper");
    const wrapW = wrapper ? wrapper.clientWidth : 1000;
    const wrapH = wrapper ? wrapper.clientHeight : 600;
    svg.setAttribute("width", Math.max(wrapW, 200));
    svg.setAttribute("height", Math.max(wrapH, 200));

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "mmArrow");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("refX", "10");
    marker.setAttribute("refY", "3.5");
    marker.setAttribute("orient", "auto");
    const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    poly.setAttribute("points", "0 0, 10 3.5, 0 7");
    poly.setAttribute("fill", "#64748b");
    marker.appendChild(poly);
    defs.appendChild(marker);
    svg.appendChild(defs);

    mindMapConnections.forEach(conn => {
        const fromNode = mindMapNodes.find(n => n.id === conn.from);
        const toNode = mindMapNodes.find(n => n.id === conn.to);
        if (!fromNode || !toNode) return;
        const connType = conn.type || mindMapDefaultConnType;
        const fromW = Math.max(80, (fromNode.texto?.length || 4) * 9 + 20);
        const toW = Math.max(80, (toNode.texto?.length || 4) * 9 + 20);
        const x1 = fromNode.x + fromW / 2;
        const y1 = fromNode.y + 25;
        const x2 = toNode.x + toW / 2;
        const y2 = toNode.y + 25;
        let el;
        if (connType === "curved") {
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2 - 40;
            el = document.createElementNS("http://www.w3.org/2000/svg", "path");
            el.setAttribute("d", `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
            el.setAttribute("fill", "none");
        } else {
            el = document.createElementNS("http://www.w3.org/2000/svg", "line");
            el.setAttribute("x1", x1);
            el.setAttribute("y1", y1);
            el.setAttribute("x2", x2);
            el.setAttribute("y2", y2);
        }
        el.setAttribute("stroke", "#64748b");
        el.setAttribute("stroke-width", "2");
        if (connType === "dashed") el.setAttribute("stroke-dasharray", "5,5");
        else if (connType === "dotted") el.setAttribute("stroke-dasharray", "2,2");
        el.setAttribute("marker-end", "url(#mmArrow)");
        el.dataset.from = conn.from;
        el.dataset.to = conn.to;
        el.style.cursor = "pointer";
        el.addEventListener("click", (e) => {
            e.stopPropagation();
            if (btnMindMapDelete && btnMindMapDelete.classList.contains("btn-dark")) {
                mindMapConnections = mindMapConnections.filter(c => !(c.from === conn.from && c.to === conn.to));
                if (mindMapStatus) mindMapStatus.textContent = "Conexão removida.";
                renderizarMindMapSvg();
            }
        });
        svg.appendChild(el);
    });
}

function renderizarMindMapDivs() {
    const wrapper = document.getElementById("mindMapCanvasWrapper");
    if (!wrapper) return;

    // Remove old node divs, keep SVG
    wrapper.querySelectorAll(".mm-node").forEach(el => el.remove());

    mindMapNodes.forEach(node => {
        const div = document.createElement("div");
        div.className = "mm-node";
        const shape = node.shape || mindMapDefaultShape;
        if (shape !== "rounded") div.classList.add("shape-" + shape);
        const isSelected = node.id === mindMapSelectedNodeId;
        const isConnectOrigin = mindMapConnectMode && mindMapConnectFrom === node.id;
        if (isSelected) div.classList.add("selected");
        if (isConnectOrigin) div.classList.add("connect-origin");
        div.dataset.id = node.id;
        div.textContent = node.texto || "Nó";
        div.style.left = node.x + "px";
        div.style.top = node.y + "px";

        div.addEventListener("click", (e) => {
            if (dragMoved) { dragMoved = false; return; }
            e.stopPropagation();
            if (mindMapConnectMode) {
                if (mindMapConnectFrom === null) {
                    mindMapConnectFrom = node.id;
                    if (mindMapStatus) mindMapStatus.textContent = `🔗 Origem: "${node.texto}". Agora clique no nó de destino.`;
                    renderizarMindMapDivs();
                    return;
                }
                if (mindMapConnectFrom !== node.id) {
                    const exists = mindMapConnections.some(c => c.from === mindMapConnectFrom && c.to === node.id);
                    if (!exists) {
                        mindMapConnections.push({ from: mindMapConnectFrom, to: node.id, type: mindMapDefaultConnType });
                    }
                    mindMapConnectMode = false;
                    mindMapConnectFrom = null;
                    if (btnMindMapConnect) btnMindMapConnect.className = "btn btn-sm btn-outline-secondary";
                    if (mindMapStatus) mindMapStatus.textContent = "Conexão criada!";
                    renderizarMindMapDivs();
                    renderizarMindMapSvg();
                    return;
                }
                return;
            }
            if (btnMindMapDelete && btnMindMapDelete.classList.contains("btn-dark")) {
                const idx = mindMapNodes.findIndex(n => n.id === node.id);
                if (idx >= 0) {
                    mindMapConnections = mindMapConnections.filter(c => c.from !== node.id && c.to !== node.id);
                    mindMapNodes.splice(idx, 1);
                    mindMapSelectedNodeId = null;
                    if (btnMindMapToTask) btnMindMapToTask.disabled = true;
                    if (mindMapStatus) mindMapStatus.textContent = "Nó removido.";
                    renderizarMindMapDivs();
                    renderizarMindMapSvg();
                }
                return;
            }
            mindMapSelectedNodeId = node.id;
            if (btnMindMapToTask) btnMindMapToTask.disabled = false;
            renderizarMindMapDivs();
        });

        div.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            mindMapSelectedNodeId = node.id;
            renderizarMindMapDivs();
            Swal.fire({
                title: "Converter em Tarefa?",
                text: `Criar tarefa a partir do nó "${node.texto}"?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sim, converter!",
                cancelButtonText: "Cancelar"
            }).then(result => {
                if (result.isConfirmed) {
                    mindMapConverterNoEmTarefa(node);
                }
            });
        });

        div.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            Swal.fire({
                title: "Editar Nó",
                input: "text",
                inputValue: node.texto || "",
                showCancelButton: true,
                confirmButtonText: "Salvar",
                cancelButtonText: "Cancelar",
                focusConfirm: false,
                didOpen: () => {
                    const container = Swal.getContainer();
                    if (container) {
                        container.addEventListener('focusin', (e) => e.stopPropagation(), true);
                    }
                    setTimeout(() => {
                        const input = Swal.getInput();
                        if (input) input.focus();
                    }, 50);
                },
                inputValidator: (value) => {
                    if (!value || !value.trim()) return "O texto não pode ficar vazio.";
                }
            }).then(result => {
                if (result.isConfirmed && result.value?.trim()) {
                    node.texto = result.value.trim();
                    renderizarMindMapDivs();
                    renderizarMindMapSvg();
                }
            });
        });

        // Drag
        let dragOffX = 0, dragOffY = 0, dragging = false, dragMoved = false;
        div.addEventListener("mousedown", (e) => {
            if (mindMapConnectMode || (btnMindMapDelete && btnMindMapDelete.classList.contains("btn-dark"))) return;
            const rect = wrapper.getBoundingClientRect();
            dragOffX = e.clientX - rect.left - node.x;
            dragOffY = e.clientY - rect.top - node.y;
            dragging = true;
            dragMoved = false;

            const onMove = (ev) => {
                if (!dragging) return;
                dragMoved = true;
                const r = wrapper.getBoundingClientRect();
                node.x = Math.max(0, ev.clientX - r.left - dragOffX);
                node.y = Math.max(0, ev.clientY - r.top - dragOffY);
                renderizarMindMapDivs();
                renderizarMindMapSvg();
            };
            const onUp = () => {
                dragging = false;
                document.removeEventListener("mousemove", onMove);
                document.removeEventListener("mouseup", onUp);
            };
            document.addEventListener("mousemove", onMove);
            document.addEventListener("mouseup", onUp);
        });

        wrapper.appendChild(div);
    });
}

function mmCriarNo(x, y) {
    Swal.fire({
        title: "Novo Nó",
        input: "text",
        inputPlaceholder: "Texto do nó...",
        showCancelButton: true,
        confirmButtonText: "Criar",
        cancelButtonText: "Cancelar",
        focusConfirm: false,
        didOpen: () => {
            const container = Swal.getContainer();
            if (container) {
                container.addEventListener('focusin', (e) => e.stopPropagation(), true);
            }
            setTimeout(() => {
                const input = Swal.getInput();
                if (input) input.focus();
            }, 50);
        },
        inputValidator: (value) => {
            if (!value || !value.trim()) return "Digite um texto para o nó.";
        }
    }).then(result => {
        if (result.isConfirmed && result.value?.trim()) {
            const node = {
                id: mindMapNextNodeId++,
                x: Math.max(0, x - 60),
                y: Math.max(0, y - 25),
                texto: result.value.trim(),
                cor: "#e2e8f0",
                shape: mindMapDefaultShape
            };
            mindMapNodes.push(node);
            mindMapSelectedNodeId = node.id;
            if (btnMindMapToTask) btnMindMapToTask.disabled = false;
            renderizarMindMapDivs();
            renderizarMindMapSvg();
            if (mindMapStatus) mindMapStatus.textContent = "Nó criado! Selecione-o ou use 'Criar Tarefa'.";
        }
    });
}

if (mindMapCanvasWrapper) {
    mindMapCanvasWrapper.addEventListener("dblclick", (e) => {
        if (e.target !== mindMapCanvasWrapper && !e.target.classList.contains("mindmap-svg")) return;
        if (mindMapConnectMode || (btnMindMapDelete && btnMindMapDelete.classList.contains("btn-dark"))) return;
        const wrapper = mindMapCanvasWrapper;
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left + wrapper.scrollLeft;
        const y = e.clientY - rect.top + wrapper.scrollTop;
        mmCriarNo(x, y);
    });
}

if (btnMindMapAddNode) {
    btnMindMapAddNode.addEventListener("click", () => {
        const wrapper = document.getElementById("mindMapCanvasWrapper");
        const w = wrapper ? wrapper.clientWidth : 800;
        const h = wrapper ? wrapper.clientHeight : 400;
        mmCriarNo(50 + Math.random() * Math.max(50, w - 200), 50 + Math.random() * Math.max(50, h - 150));
    });
}

if (btnMindMapConnect) {
    btnMindMapConnect.addEventListener("click", () => {
        mindMapConnectMode = !mindMapConnectMode;
        mindMapConnectFrom = null;
        btnMindMapConnect.className = mindMapConnectMode ? "btn btn-sm btn-dark" : "btn btn-sm btn-outline-secondary";
        if (mindMapStatus) {
            mindMapStatus.textContent = mindMapConnectMode
                ? "🔗 Clique no nó de origem, depois no nó de destino"
                : "Modo conexão desativado";
        }
    });
}

if (btnMindMapDelete) {
    btnMindMapDelete.addEventListener("click", () => {
        const isActive = btnMindMapDelete.classList.contains("btn-dark");
        btnMindMapDelete.className = isActive ? "btn btn-sm btn-outline-danger" : "btn btn-sm btn-dark";
        if (mindMapStatus) {
            mindMapStatus.textContent = isActive
                ? "Clique no nó ou conexão para remover"
                : "🗑️ Clique em um nó ou conexão para remover";
        }
    });
}

function _swalComFocus(opt) {
    if (typeof opt === 'string') {
        opt = { title: arguments[0], text: arguments[1], icon: arguments[2] };
    }
    const origDidOpen = opt.didOpen;
    opt.didOpen = (el) => {
        const c = Swal.getContainer();
        if (c) c.addEventListener('focusin', (e) => e.stopPropagation(), true);
        if (origDidOpen) origDidOpen(el);
    };
    return Swal.fire(opt);
}

function mindMapConverterNoEmTarefa(node) {
    if (!node || !node.texto) {
        _swalComFocus("Atenção", "Selecione um nó com texto primeiro.", "warning");
        return;
    }
    if (!paginaAtivaId) {
        _swalComFocus("Atenção", "Selecione uma página primeiro.", "warning");
        return;
    }
    const hoje = new Date();
    const dataStr = hoje.toISOString().split("T")[0];
    const fimStr = new Date(hoje.getTime() + 86400000).toISOString().split("T")[0] + "T23:59";
    const novaTarefa = {
        texto: node.texto,
        concluida: false,
        status: "A Fazer",
        dataInicio: dataStr,
        dataFim: fimStr,
        descricao: `Criado a partir do mapa mental: "${inputMindMapTitulo ? inputMindMapTitulo.value : "Sem título"}"`,
        urgenciaId: 5,
        tagId: paginaAtivaId
    };
    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaTarefa)
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        _swalComFocus("Sucesso!", "Nó convertido em tarefa!", "success");
        carregarTarefas();
    })
    .catch(err => {
        console.error(err);
        _swalComFocus("Erro", "Não foi possível criar a tarefa. Verifique o servidor.", "error");
    });
}

if (btnMindMapToTask) {
    btnMindMapToTask.addEventListener("click", () => {
        const node = mindMapNodes.find(n => n.id === mindMapSelectedNodeId);
        mindMapConverterNoEmTarefa(node);
    });
}

if (btnMindMapExport) {
    btnMindMapExport.addEventListener("click", () => exportMindMap());
}

function exportMindMap() {
    const wrapper = document.getElementById("mindMapCanvasWrapper");
    if (!wrapper) return;
    const w = wrapper.scrollWidth || 1000;
    const h = wrapper.scrollHeight || 600;
    const ns = "http://www.w3.org/2000/svg";
    const exportSvg = document.createElementNS(ns, "svg");
    exportSvg.setAttribute("width", w);
    exportSvg.setAttribute("height", h);
    exportSvg.setAttribute("xmlns", ns);
    const defs = document.createElementNS(ns, "defs");
    const marker = document.createElementNS(ns, "marker");
    marker.setAttribute("id", "exportArrow");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("refX", "10");
    marker.setAttribute("refY", "3.5");
    marker.setAttribute("orient", "auto");
    const poly = document.createElementNS(ns, "polygon");
    poly.setAttribute("points", "0 0, 10 3.5, 0 7");
    poly.setAttribute("fill", "#64748b");
    marker.appendChild(poly);
    defs.appendChild(marker);
    exportSvg.appendChild(defs);
    mindMapConnections.forEach(conn => {
        const fromNode = mindMapNodes.find(n => n.id === conn.from);
        const toNode = mindMapNodes.find(n => n.id === conn.to);
        if (!fromNode || !toNode) return;
        const connType = conn.type || mindMapDefaultConnType;
        const fromW = Math.max(80, (fromNode.texto?.length || 4) * 9 + 20);
        const toW = Math.max(80, (toNode.texto?.length || 4) * 9 + 20);
        const x1 = fromNode.x + fromW / 2;
        const y1 = fromNode.y + 25;
        const x2 = toNode.x + toW / 2;
        const y2 = toNode.y + 25;
        let el;
        if (connType === "curved") {
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2 - 40;
            el = document.createElementNS(ns, "path");
            el.setAttribute("d", `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
            el.setAttribute("fill", "none");
        } else {
            el = document.createElementNS(ns, "line");
            el.setAttribute("x1", x1);
            el.setAttribute("y1", y1);
            el.setAttribute("x2", x2);
            el.setAttribute("y2", y2);
        }
        el.setAttribute("stroke", "#64748b");
        el.setAttribute("stroke-width", "2");
        if (connType === "dashed") el.setAttribute("stroke-dasharray", "5,5");
        else if (connType === "dotted") el.setAttribute("stroke-dasharray", "2,2");
        el.setAttribute("marker-end", "url(#exportArrow)");
        exportSvg.appendChild(el);
    });
    mindMapNodes.forEach(node => {
        const nodeW = Math.max(80, (node.texto?.length || 4) * 9 + 20);
        const nodeH = 36;
        const shape = node.shape || mindMapDefaultShape;
        const g = document.createElementNS(ns, "g");
        let shapeEl;
        if (shape === "circle") {
            const r = Math.max(40, nodeW / 2, nodeH / 2);
            shapeEl = document.createElementNS(ns, "circle");
            shapeEl.setAttribute("cx", node.x + nodeW / 2);
            shapeEl.setAttribute("cy", node.y + nodeH / 2);
            shapeEl.setAttribute("r", r);
        } else if (shape === "pill") {
            shapeEl = document.createElementNS(ns, "rect");
            shapeEl.setAttribute("x", node.x);
            shapeEl.setAttribute("y", node.y);
            shapeEl.setAttribute("width", nodeW);
            shapeEl.setAttribute("height", nodeH);
            shapeEl.setAttribute("rx", nodeH / 2);
        } else if (shape === "sharp") {
            shapeEl = document.createElementNS(ns, "rect");
            shapeEl.setAttribute("x", node.x);
            shapeEl.setAttribute("y", node.y);
            shapeEl.setAttribute("width", nodeW);
            shapeEl.setAttribute("height", nodeH);
            shapeEl.setAttribute("rx", "0");
        } else {
            shapeEl = document.createElementNS(ns, "rect");
            shapeEl.setAttribute("x", node.x);
            shapeEl.setAttribute("y", node.y);
            shapeEl.setAttribute("width", nodeW);
            shapeEl.setAttribute("height", nodeH);
            shapeEl.setAttribute("rx", "10");
        }
        shapeEl.setAttribute("fill", "#e2e8f0");
        shapeEl.setAttribute("stroke", "#cbd5e1");
        shapeEl.setAttribute("stroke-width", "2");
        g.appendChild(shapeEl);
        const text = document.createElementNS(ns, "text");
        text.setAttribute("x", node.x + nodeW / 2);
        text.setAttribute("y", node.y + 24);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "0.85rem");
        text.setAttribute("font-weight", "600");
        text.setAttribute("font-family", "Inter, sans-serif");
        text.setAttribute("fill", "#1e293b");
        text.textContent = node.texto || "Nó";
        g.appendChild(text);
        exportSvg.appendChild(g);
    });
    const svgData = new XMLSerializer().serializeToString(exportSvg);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        const link = document.createElement("a");
        link.download = `${inputMindMapTitulo ? inputMindMapTitulo.value.trim() : "mapa-mental"}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };
    img.src = url;
}

if (btnSalvarMindMap) {
    btnSalvarMindMap.addEventListener("click", () => {
        if (!paginaAtivaId) {
            Swal.fire("Atenção", "Selecione uma página primeiro.", "warning");
            return;
        }
        const titulo = inputMindMapTitulo ? inputMindMapTitulo.value.trim() : "Mapa Mental";
        if (!titulo) {
            Swal.fire("Atenção", "Digite um título para o mapa.", "warning");
            return;
        }
        const dados = JSON.stringify({ nodes: mindMapNodes, connections: mindMapConnections });
        const body = { titulo, dados, tagId: paginaAtivaId };

        const request = mindMapEditandoId
            ? fetch(`${API_MINDMAPS_URL}/${mindMapEditandoId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
            : fetch(API_MINDMAPS_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

        request
            .then(() => {
                bootstrap.Modal.getInstance(document.getElementById("modalMindMapEditor")).hide();
                Swal.fire("Sucesso!", "Mapa mental salvo.", "success");
                carregarMindMaps();
            })
            .catch(err => console.error(err));
    });
}

function excluirMindMap(id) {
    const map = mindMaps.find(m => m.id === id);
    Swal.fire({
        title: "Excluir?",
        text: `Apagar "${map?.titulo || "mapa"}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
    }).then(r => {
        if (r.isConfirmed) {
            fetch(`${API_MINDMAPS_URL}/${id}`, { method: "DELETE" })
                .then(() => carregarMindMaps())
                .catch(err => console.error(err));
        }
    });
}

if (btnNovoMindMap) {
    btnNovoMindMap.addEventListener("click", () => {
        if (!paginaAtivaId) {
            Swal.fire("Atenção", "Selecione uma página primeiro.", "warning");
            return;
        }
        abrirMindMapEditor(null);
    });
}

const shapeDescriptions = {
    rounded: "Arredondado (padrão) - ideal para textos curtos",
    circle: "Circular - destaque visual para ideias principais",
    sharp: "Reto - visual mais formal e limpo",
    pill: "Pílula - moderna e estilizada"
};

const connDescriptions = {
    straight: "Reta com seta (padrão) - clássica e direta",
    curved: "Curva - suave e orgânica, ideal para fluxos",
    dashed: "Tracejada - indica relação indireta ou opcional",
    dotted: "Pontilhada - sutil, para conexões fracas"
};

if (btnMindMapFerramentas) {
    btnMindMapFerramentas.addEventListener("click", () => {
        const node = mindMapNodes.find(n => n.id === mindMapSelectedNodeId);
        const shapeAtual = node?.shape || mindMapDefaultShape;
        const connAtual = mindMapDefaultConnType;
        Swal.fire({
            title: "🔧 Ferramentas",
            html: `
                <div style="text-align:left;font-size:0.9rem;">
                    <label class="fw-semibold mb-1">Forma do Nó:</label>
                    <select id="swalShapeSelect" class="form-select form-select-sm mb-3">
                        ${Object.entries(shapeDescriptions).map(([k, v]) => {
                            const nomes = { rounded: "Arredondado", circle: "Circular", sharp: "Reto", pill: "Pílula" };
                            return `<option value="${k}" ${k === shapeAtual ? 'selected' : ''}>${nomes[k] || k}</option>`;
                        }).join('')}
                    </select>
                    <div id="swalShapeDesc" class="small text-muted mb-3 p-2 bg-light rounded">${shapeDescriptions[shapeAtual]}</div>

                    <label class="fw-semibold mb-1">Tipo de Conexão:</label>
                    <select id="swalConnSelect" class="form-select form-select-sm mb-3">
                        ${Object.entries(connDescriptions).map(([k, v]) => {
                            const nomes = { straight: "Reta", curved: "Curva", dashed: "Tracejada", dotted: "Pontilhada" };
                            return `<option value="${k}" ${k === connAtual ? 'selected' : ''}>${nomes[k] || k}</option>`;
                        }).join('')}
                    </select>
                    <div id="swalConnDesc" class="small text-muted mb-2 p-2 bg-light rounded">${connDescriptions[connAtual]}</div>
                </div>
            `,
            didOpen: () => {
                const shapeSelect = document.getElementById("swalShapeSelect");
                const connSelect = document.getElementById("swalConnSelect");
                const shapeDesc = document.getElementById("swalShapeDesc");
                const connDesc = document.getElementById("swalConnDesc");
                if (shapeSelect) shapeSelect.addEventListener("change", () => {
                    shapeDesc.textContent = shapeDescriptions[shapeSelect.value] || "";
                });
                if (connSelect) connSelect.addEventListener("change", () => {
                    connDesc.textContent = connDescriptions[connSelect.value] || "";
                });
            },
            showCancelButton: true,
            confirmButtonText: "Aplicar",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                const shapeSel = document.getElementById("swalShapeSelect");
                const connSel = document.getElementById("swalConnSelect");
                return {
                    shape: shapeSel ? shapeSel.value : mindMapDefaultShape,
                    connType: connSel ? connSel.value : mindMapDefaultConnType
                };
            }
        }).then(result => {
            if (result.isConfirmed && result.value) {
                mindMapDefaultShape = result.value.shape;
                mindMapDefaultConnType = result.value.connType;
                if (node) {
                    node.shape = mindMapDefaultShape;
                }
                if (mindMapStatus) {
                    const nomesShape = { rounded: "Arredondado", circle: "Circular", sharp: "Reto", pill: "Pílula" };
                    const nomesConn = { straight: "Reta", curved: "Curva", dashed: "Tracejada", dotted: "Pontilhada" };
                    mindMapStatus.textContent = `Forma: ${nomesShape[mindMapDefaultShape] || mindMapDefaultShape} | Conexão: ${nomesConn[mindMapDefaultConnType] || mindMapDefaultConnType}`;
                }
                renderizarMindMapDivs();
                renderizarMindMapSvg();
            }
        });
    });
}

if (btnMindMapAjuda) {
    btnMindMapAjuda.addEventListener("click", () => {
        Swal.fire({
            title: "🧠 Mapa Mental - Ajuda",
            html: `
                <div style="text-align:left;font-size:0.9rem;">
                    <p><b>🖱️ Duplo-clique</b> no canvas vazio para criar um nó.</p>
                    <p><b>🔄 Arraste</b> os nós para reposicionar.</p>
                    <p><b>🔗 Clique em "Conectar"</b>, depois clique no nó de origem e no nó de destino.</p>
                    <p><b>✏️ Duplo-clique</b> em um nó para editar o texto.</p>
                    <p><b>🗑️ Clique em "Remover"</b>, depois clique em um nó ou conexão para apagar.</p>
                    <p><b>➜ Criar Tarefa</b> converte o nó selecionado em uma tarefa real.</p>
                    <p><b>🔧 Ferramentas</b> permite escolher forma dos nós e tipo de conexão.</p>
                </div>
            `,
            confirmButtonText: "OK"
        });
    });
}

// Recalculate SVG size when modal opens
const modalMindMapEditor = document.getElementById("modalMindMapEditor");
if (modalMindMapEditor) {
    modalMindMapEditor.addEventListener("shown.bs.modal", () => {
        const wrapper = document.getElementById("mindMapCanvasWrapper");
        if (wrapper) {
            const rect = wrapper.getBoundingClientRect();
            const svg = document.getElementById("mindMapSvg");
            if (svg) {
                svg.setAttribute("width", Math.max(200, rect.width - 4));
                svg.setAttribute("height", Math.max(200, rect.height - 4));
                renderizarMindMapDivs();
                renderizarMindMapSvg();
            }
        }
    });
}

inicializarSistema();