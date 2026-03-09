const API = 'http://localhost:3000';
let currentFilter = 'all';

// ── Fetch & render all tasks ──
async function loadTasks() {
  try {
    const res = await fetch(`${API}/tasks`);
    const tasks = await res.json();
    renderTasks(tasks);
  } catch {
    renderTasks([]);
  }
}

function renderTasks(tasks) {
  const list = document.getElementById('list');
  const filtered = tasks.filter(t => {
    if (currentFilter === 'active') return !t.done;
    if (currentFilter === 'done')   return t.done;
    return true;
  });

  list.innerHTML = '';

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty">No tasks here 🎉</div>`;
  } else {
    filtered.forEach(t => {
      const li = document.createElement('li');
      if (t.done) li.classList.add('done');

      li.innerHTML = `
        <div class="check" onclick="toggleTask(${t.id})">${t.done ? '✓' : ''}</div>
        <span class="task-text" onclick="toggleTask(${t.id})">${escapeHtml(t.title)}</span>
        <button class="del" onclick="deleteTask(${t.id})" title="Delete">✕</button>
      `;
      list.appendChild(li);
    });
  }

  // Update count
  const remaining = tasks.filter(t => !t.done).length;
  document.getElementById('count').textContent =
    `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
}

// ── Add task ──
async function addTask() {
  const input = document.getElementById('task');
  const title = input.value.trim();
  if (!title) return;

  try {
    await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    input.value = '';
    loadTasks();
  } catch {
    // Offline fallback: add locally
    const list = document.getElementById('list');
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="check"></div>
      <span class="task-text">${escapeHtml(title)}</span>
      <button class="del" onclick="this.parentElement.remove()" title="Delete">✕</button>
    `;
    li.querySelector('.check').onclick = () => li.classList.toggle('done');
    list.appendChild(li);
    input.value = '';
  }
}

// ── Toggle done ──
async function toggleTask(id) {
  try {
    await fetch(`${API}/tasks/${id}/toggle`, { method: 'PATCH' });
    loadTasks();
  } catch {}
}

// ── Delete task ──
async function deleteTask(id) {
  try {
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
  } catch {}
}

// ── Clear completed ──
async function clearCompleted() {
  try {
    await fetch(`${API}/tasks/completed`, { method: 'DELETE' });
    loadTasks();
  } catch {}
}

// ── Filter ──
function filterTasks(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadTasks();
}

// ── Enter key support ──
document.getElementById('task').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

// ── Utility ──
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Init ──
loadTasks();