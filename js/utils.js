/* ===== FUNÇÕES UTILITÁRIAS ===== */

/**
 * Gera um ID único para tarefas
 * @returns {string} ID único baseado em timestamp
 */
function generateId() {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formata data para exibição (dd/mm/yyyy)
 * @param {string} dateString - Data no formato ISO (yyyy-mm-dd)
 * @returns {string} Data formatada
 */
function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(`${dateString}T00:00:00`); // Força o timezone local
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Verifica se uma data já passou
 * @param {string} dateString - Data no formato ISO (yyyy-mm-dd)
 * @returns {boolean} true se a data já
 */
function isOverdue(dateString) {
  if (!dateString) return false;

  const taskDate = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return taskDate < today;
}

/**
 * Verifica se uma data é hoje
 * @param {string} dateString - Data no formato ISO (yyyy-mm-dd)
 * @returns {boolean} true se a data é hoje
 */
function isToday(dateString) {
  if (!dateString) return false;

  const taskDate = new Date(`${dateString}T00:00:00`);
  const today = new Date();

  return taskDate.toDateString() === today.toDateString();
}

/**
 * Sanitiza texto de entrada (previne XSS)
 * @param {string} text - Texto a ser sanitizado
 * @returns {string} Texto limpo
 */
function sanitizeText(text) {
  const div = document.createElement('div');

  div.textContent = text;

  return div.innerHTML;
}

/**
 * Debounce - atrasa a execução de função
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} Função com debounce
 */
function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Mostra notificação toast
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo: 'success', 'error', 'info'
 */
function showToast(message, type = 'info') {
  // Remove toast anterior se existir
  const existingToast = document.querySelector('.toast');

  if (existingToast) existingToast.remove();

  // Cria novo toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  // Adiciona estilos inline
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
    color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 3000;
    animation: slideInRight 0.3s ease;
    font-weight: 600;
  `;

  document.body.appendChild(toast);

  // Remove após 3 segundos
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Adiciona animações do toast no head
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;

document.head.appendChild(style);

console.log('✅ Utils carregado');
