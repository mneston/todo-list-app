// ===== ESTADO DA APLICAÇÃO ======
let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;

// ===== ELEMENTOS DO DOM ======
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskPriority = document.getElementById('task-priority');
const taskDate = document.getElementById('task-date');
const taskCategory = document.getElementById('task-category');
const tasksContainer = document.getElementById('tasks-container');
const emptyState = document.getElementById('empty-state');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');
const confirmModal = document.getElementById('confirm-modal');
const modalCancel = document.getElementById('modal-cancel');
const modalConfirm = document.getElementById('modal-confirm');

// Badges e estatisticas
const badgeAll = document.getElementById('badge-all');
const badgeActive = document.getElementById('badge-active');
const badgeCompleted = document.getElementById('badge-completed');
const statTotal = document.getElementById('stat-total');
const statActive = document.getElementById('stat-active');
const statCompleted = document.getElementById('stat-completed');
const statProgress = document.getElementById('stat-progress');

// ===== INICIALIZAÇÃO ======
function init() {
  tasks = loadTasks();

  const savedTheme = loadTheme();

  document.body.setAttribute('data-theme', savedTheme);

  renderTasks();
  updateStats();
  setupEventListeners();

  console.log('✅ App inicializado');
  console.log('📊 Tarefas carreegadas:', tasks.length);
}

// ===== EVENT LISTENERS ======
function setupEventListeners() {
  taskForm.addEventListener('submit', handleAddTask);
  filterButtons.forEach(btn => btn.addEventListener('click', handleFilterChange));
  searchInput.addEventListener('input', debounce(handleSearch, 300));
  themeToggle.addEventListener('click', handleThemeToggle);
  modalCancel.addEventListener('click', closeModal);
  modalConfirm.addEventListener('click', confirmDelete);

  confirmModal.addEventListener('click', e => {
    if (e.target === confirmModal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

// ===== ADICIONAR TAREFA ======
function handleAddTask(e) {
  e.preventDefault();

  const text = taskInput.value.trim();

  if (!text) {
    showToast('Digite uma tarefa!', 'error');
    return;
  }

  const newTask = {
    id: generateId(),
    text: sanitizeInput(text),
    completed: false,
    priority: taskPriority.value,
    date: taskDate.value,
    category: taskCategory.value.trim(),
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(newTask);
  saveTasks(tasks);

  taskForm.reset();
  taskPriority.value = 'medium';

  renderTasks();
  updateStats();

  showToast('Tarefa adicionada!', 'success');
}

// ===== RENDERIZAR TAREFAS ======
function renderTasks() {
  let filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    tasksContainer.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  taskContainer.innerHTML = filteredTasks.map(task => createTaskHTML(task)).join('');

  attachTaskEventListeners();
}

// ===== CRIAR HTML DA TAREFA ======
function createTaskHTML(task) {
  const priorityLabels = {
    high: '⚡ Alta',
    medium: '⭐ Média',
    low: '💚 Baixa',
  };

  const dateDisplay = task.date
    ? `
    <span class="task-date ${isOverdue(task.date) && !task.completed ? 'overdue' : ''}">
      📅 ${isToday(task.date) ? 'Hoje' : formatDate(task.date)}
    </span>
  `
    : '';

  const categoryDisplay = task.category
    ? `<span class="task-category">🏷️ ${sanitizeText(task.category)}</span>`
    : '';

  return `
    <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
      <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-action="toggle"></div>
      <div class="task-content">
        <div class="task-text">${task.text}</div>
        <div class="task-meta">
          <span class="task-priority ${task.priority}">${priorityLabels[task.priority]}</span>
          ${dateDisplay}
          ${categoryDisplay}
        </div>
      </div>
      <div class="task-actions">
        <button class="task-btn btn-edit" data-action="edit" aria-label="Editar tarefa">✏️</button>
        <button class="task-btn btn-delete" data-action="delete" aria-label="Excluir tarefa">🗑️</button>
      </div>
    </div>
  `;
}

// ===== EVENT LISTENERS DAS TAREFAS ======
function attachTaskEventListeners() {
  tasksContainer.addEventListener('click', e => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    const taskItem = e.target.closest('.task-item');

    if (!taskItem || !action) return;

    const taskId = taskItem.dataset.taskId;

    switch (action) {
      case 'toggle':
        toggleTask(taskId);
        break;
      case 'edit':
        editTask(taskId);
        break;
      case 'delete':
        openDeleteModal(taskId);
        break;
    }
  });
}

// ===== TOGGLE TAREFA (COMPLETAR/REABRIR) ======
function toggleTask(taskId) {
  const task = tasks.find(t => t.id === taskId);

  if (!task) return;

  task.completed = !task.completed;
  saveTasks(tasks);

  renderTasks();
  updateStats();

  showToast(
    task.completed ? 'Tarefa concluída! 🎉' : 'Tarefa reaberta!',
    task.completed ? 'success' : 'info',
  );
}

// ===== EDITAR TAREFA ======
function editTask(taskId) {
  showToast('Função de edição em desenvolvimento...', 'info');
}

// ===== EXCLUIR TAREFA ======
let taskToDelete = null;

function openDeleteModal(taskId) {
  taskToDelete = taskId;
  confirmModal.classList.remove('hidden');
}

function closeModal() {
  confirmModal.classList.add('hidden');
  taskToDelete = null;
}

function confirmDelete() {
  if (!taskToDelete) return;

  tasks = tasks.filter(t => t.id !== taskToDelete);
  saveTasks(tasks);
  renderTasks();
  updateStats();
  closeModal();

  showToast('Tarefa excluída!', 'success');
}

// ===== FILTROS ======
function handleFilterChange(e) {
  const filter = e.currentTarget.dataset.filter;
  currentFilter = filter;

  filterButtons.forEach(btn => btn.classList.remove('active'));
  e.currentFilter.classList.add('active');

  renderTasks();
}

function getFilteredTasks() {
  let filtered = tasks;

  switch (currentFilter) {
    case 'active':
      filtered = tasks.filter(t => !t.completed);
      break;
    case 'completed':
      filtered = tasks.filter(t => t.completed);
      break;
    default:
      filtered = tasks;
  }

  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm) {
    filtered = filtered.filter(
      task =>
        task.text.toLowerCase().includes(searchTerm) ||
        (task.category && task.category.toLowerCase().includes(searchTerm)),
    );
  }

  return filtered;
}

function handleSearch() {
  renderTasks();
}

// ===== ESTATÍSTICAS ======
function updateStats() {
  const total = tasks.length;
  const active = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  badgeAll.textContent = total;
  badgeActive.textContent = active;
  badgeCompleted.textContent = completed;

  statTotal.textContent = total;
  statActive.textContent = active;
  statCompleted.textContent = completed;
  statProgress.textContent = `${progress}%`;
}

// ===== TOGGLE DE TEMA ======
function handleThemeToggle() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.body.setAttribute('data-theme', newTheme);
  saveTheme(newTheme);

  showToast(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado!`, 'success');
}

document.addEventListener('DOMContentLoaded', init);

console.log('✅ App carregado');
