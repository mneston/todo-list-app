// ===== GERENCIAMENTO DE LOCALSTORAGE =====

const STORAGE_KEY = 'taskmaster_tasks';
const THEME_KEY = 'taskmaster_theme';

/**
 * Carrega tarefas do LocalStorage
 * @returns {Array} Array de tarefas
 */
function loadTasks() {
  try {
    const tasksJSON = localStorage.getItem(STORAGE_KEY);
    return tasksJSON ? JSON.parse(tasksJSON) : [];
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
    return [];
  }
}

/**
 * Salva tarefas nno LocalStorage
 * @param {Array} tasks - Array de tarefas
 * @returns {boolean} true se salvou com sucesso
 */
function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Erro ao salvar tarefas:', error);
    showToast('Error ao salvar tarefas', 'error');
    return false;
  }
}

/**
 * Carrega tema do localStorage
 * @returns {string} 'dark' ou 'light'
 */
function loadTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

/**
 * Salva tema no localStorage
 * @params {string} theme - 'dark' ou 'light'
 */
function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Limpa todos os dados (útil para reset)
 */
function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(THEME_KEY);
}

/**
 * Exporta tarefas para JSON (download)
 * @param {Array} tasks - Array de tarefas
 */
function exportTasks(tasks) {
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `taskmaster_backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();

  URL.revokeObjectURL(url);
  showToast('Tarefas exportadas com sucesso', 'success');
}

/**
 * Importa tarefas de arquivo JSON
 * @param {File} file - Arquivo JSON
 * @returns {Promise<Array>} Array de tarefas importadas
 */
function importTasks(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const tasks = JSON.parse(e.target.result);

        if (Array.isArray(tasks)) {
          resolve(tasks);
          showToast('Tarefas importadas com sucesso!', 'success');
        } else {
          reject(new Error('Formato inválido'));
        }
      } catch (error) {
        reject(error);
        showToast('Erro ao importar tarefas', 'error');
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

console.log('✅ Storage carregado!');
