// ===== ESTADO DA APLICAÇÃO ======
let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;
let taskToDelete = null;
let isToggling = false;
let draggedTaskId = null;
let draggedOverTaskId = null;

// ===== ELEMENTOS DO DOM ======
let tasksContainer = document.getElementById('tasks-container');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskPriority = document.getElementById('task-priority');
const taskDate = document.getElementById('task-date');
const taskCategory = document.getElementById('task-category');
const emptyState = document.getElementById('empty-state');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');
const confirmModal = document.getElementById('confirm-modal');
const modalCancel = document.getElementById('modal-cancel');
const modalConfirm = document.getElementById('modal-confirm');
const btnCancelEdit = document.getElementById('btn-cancel-edit');

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

  btnCancelEdit.addEventListener('click', () => {
    cancelEdit();

    btnCancelEdit.classList.add('hidden');

    showToast('Edição cancelada', 'info');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (editingTaskId) {
        cancelEdit();
        document.getElementById('btn-cancel-edit').classList.add('hidden');
      }

      closeModal();
    }
  });
}

function setupDragAndDrop() {
  const taskItems = document.querySelectorAll('.task-item');

  taskItems.forEach(item => {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('drop', handleDrop);
  });
}

function setupDragAndDropMobile() {
  const isTouchDevice = 'ontouchstart' in window;

  if (isTouchDevice && typeof Draggable !== 'undefined') {
    const sortable = new Draggable.Sortable(tasksContainer, {
      draggable: '.task-item',
      handle: '.drag-handle',
      mirror: {
        constrainDimensions: true,
      },
    });

    sortable.on('sortable:stop', e => {
      const draggedId = e.dragEvent.data.source.dataset.taskId;
      const targetId = e.dragEvent.data.over?.dataset.taskId;

      if (targetId && draggedId !== targetId) reorderTasks(draggedId, targetId);
    });
  } else {
    setupDragAndDrop();
  }
}

// ===== ADICIONAR/EDITAR TAREFA ======
function handleAddTask(e) {
  e.preventDefault();

  const text = taskInput.value.trim();

  if (!text) {
    showToast('Digite uma tarefa!', 'error');
    return;
  }

  if (editingTaskId) {
    const task = tasks.find(t => t.id === editingTaskId);

    if (task) {
      task.text = sanitizeText(text);
      task.priority = taskPriority.value;
      task.date = taskDate.value;
      task.category = taskCategory.value.trim();
      task.updateAt = new Date().toISOString();

      saveTasks(tasks);
      cancelEdit();
      renderTasks();
      updateStats();

      const submitBtn = taskForm.querySelector('.btn-add');
      submitBtn.innerHTML = '<span>+</span>';

      showToast('Tarefa atualizada!', 'success');
    }

    return;
  }

  const newTask = {
    id: generateId(),
    text: sanitizeText(text),
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

function handleDragStart(e) {
  draggedTaskId = this.dataset.taskId;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
  this.classList.remove('dragging');

  document.querySelectorAll('.task-item').forEach(item => item.classList.remove('drag-over'));

  draggedTaskId = null;
  draggedOverTaskId = null;
}

function handleDragOver(e) {
  if (e.preventDefault) e.preventDefault();

  e.dataTransfer.dropEffect = 'move';

  return false;
}

function handleDragEnter(e) {
  const targetTaskId = this.dataset.taskId;

  if (draggedTaskId !== targetTaskId) {
    this.classList.add('drag-over');

    draggedOverTaskId = targetTaskId;
  }
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  if (e.stopPropagation) e.stopPropagation();

  const targetTaskId = this.dataset.taskId;

  if (draggedTaskId !== targetTaskId) reorderTasks(draggedTaskId, targetTaskId);

  return false;
}

function reorderTasks(draggedId, targetId) {
  const draggedIndex = tasks.findIndex(t => t.id === draggedId);
  const targetIndex = tasks.findIndex(t => t.id === targetId);

  if (draggedIndex === -1 || targetIndex === -1) return;

  const [draggedTask] = tasks.splice(draggedIndex, 1);

  tasks.splice(targetIndex, 0, draggedTask);

  saveTasks(tasks);
  renderTasks();

  showToast('Ordem atualizada!', 'success');
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

  tasksContainer.innerHTML = filteredTasks.map(task => createTaskHTML(task)).join('');

  attachTaskEventListeners();
  setupDragAndDropMobile();
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
    <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}" draggable="true">
      <div class="drag-handle" title="Arrastar para reordenar">⋮⋮</div>
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
  const newContainer = tasksContainer.cloneNode(true);

  tasksContainer.parentNode.replaceChild(newContainer, tasksContainer);

  const oldContainer = tasksContainer;
  tasksContainer = newContainer;

  tasksContainer.addEventListener('click', handleTaskClick);
}

function handleTaskClick(e) {
  const actionElement = e.target.closest('[data-action]');

  if (!actionElement) return;

  e.stopPropagation();
  e.preventDefault();

  const action = actionElement.dataset.action;
  const taskItem = actionElement.closest('.task-item');

  if (!taskItem) return;

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
}

// ===== TOGGLE TAREFA (COMPLETAR/REABRIR) ======

function toggleTask(taskId) {
  if (isToggling) {
    console.log('⚠️ Toggle já em execução, ignorando duplicata');
    return;
  }

  isToggling = true;

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    isToggling = false;
    return;
  }

  console.log(`✅ Toggling task ${taskId} -> ${!task.completed}`);

  task.completed = !task.completed;
  saveTasks(tasks);

  renderTasks();
  updateStats();

  showToast(
    task.completed ? 'Tarefa concluída! 🎉' : 'Tarefa reaberta!',
    task.completed ? 'success' : 'info',
  );

  setTimeout(() => (isToggling = false), 150);
}

// ===== EDITAR TAREFA ======
function editTask(taskId) {
  const task = tasks.find(t => t.id === taskId);

  if (!task) return;

  editingTaskId = taskId;

  taskInput.value = task.text;
  taskPriority.value = task.priority;
  taskDate.value = task.date || '';
  taskCategory.value = task.category || '';

  const submitBtn = taskForm.querySelector('.btn-add');
  submitBtn.innerHTML = '<span>✓</span>';
  submitBtn.computedStyleMap.background = 'linear-gradient(135deg, #10b981, #059669)';

  taskInput.focus();
  taskInput.select();

  highlightEditingTask(taskId);

  document.getElementById('btn-cancel-edit').classList.remove('hidden');

  showToast('Editando tarefa...', 'info');
}

function highlightEditingTask(taskId) {
  document.querySelectorAll('.task-item').forEach(item => (item.computedStyleMap.border = ''));

  const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);

  if (taskItem) {
    taskItem.computedStyleMap.border = '2px solid #3b82f6';
    taskItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function cancelEdit() {
  editingTaskId = null;

  taskForm.reset();
  taskPriority.value = 'medium';

  const submitBtn = taskForm.querySelector('.btn-add');
  submitBtn.innerHtml = '<span>+</span>';
  submitBtn.computedStyleMap.background = '';

  document.querySelectorAll('.task-item').forEach(item => (item.computedStyleMap.border = ''));

  document.getElementById('btn-cancel-edit').classList.add('hidden');
}

// ===== EXCLUIR TAREFA ======
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
  e.currentTarget.classList.add('active');

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
