const key = 'numan-task-scheduler';
let tasks = JSON.parse(localStorage.getItem(key) || 'null') || [
  { id: 't1', name: 'Review JavaScript DOM concepts', due: new Date(Date.now() + 86400000).toISOString().slice(0,10), priority: 'High', done: false },
  { id: 't2', name: 'Prepare project demonstration', due: new Date(Date.now() + 259200000).toISOString().slice(0,10), priority: 'Medium', done: false }
];
let editing = null;
const form = document.querySelector('#taskForm');

function save() { localStorage.setItem(key, JSON.stringify(tasks)); }
function clean(value) { const span = document.createElement('span'); span.textContent = value; return span.innerHTML; }
function niceDate(value) { return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }

function filteredTasks() {
  const filter = document.querySelector('#taskFilter').value;
  return tasks.filter(task => filter === 'all' || (filter === 'completed' ? task.done : !task.done)).sort((a,b) => a.due.localeCompare(b.due));
}

function render() {
  const today = new Date(); today.setHours(0,0,0,0);
  const soon = new Date(today); soon.setDate(soon.getDate() + 3);
  document.querySelector('#totalTasks').textContent = tasks.length;
  document.querySelector('#completedTasks').textContent = tasks.filter(task => task.done).length;
  document.querySelector('#dueSoonTasks').textContent = tasks.filter(task => !task.done && new Date(`${task.due}T00:00:00`) <= soon).length;
  const visible = filteredTasks();
  document.querySelector('#taskRows').innerHTML = visible.length ? visible.map(task => `<tr><td><button class="btn ${task.done ? '' : 'secondary'} small" data-toggle="${task.id}">${task.done ? 'Done' : 'Open'}</button></td><td style="${task.done ? 'text-decoration:line-through;color:var(--muted)' : ''}"><strong>${clean(task.name)}</strong></td><td>${niceDate(task.due)}</td><td><span class="badge ${task.priority.toLowerCase()}">${task.priority}</span></td><td><div class="actions" style="margin:0"><button class="btn secondary small" data-edit="${task.id}">Edit</button><button class="btn danger small" data-delete="${task.id}">Delete</button></div></td></tr>`).join('') : '<tr><td colspan="5" class="empty">No tasks in this view.</td></tr>';
}

function cancelEdit() {
  editing = null; form.reset(); document.querySelector('#priority').value = 'Medium';
  document.querySelector('#taskFormTitle').textContent = 'Add task'; document.querySelector('#taskSave').textContent = 'Add task'; document.querySelector('#taskCancel').classList.add('hidden');
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const task = { id: editing || `${Date.now()}`, name: form.taskName.value.trim(), due: form.dueDate.value, priority: form.priority.value, done: editing ? tasks.find(item => item.id === editing).done : false };
  tasks = editing ? tasks.map(item => item.id === editing ? task : item) : [...tasks, task];
  save(); cancelEdit(); render();
});

document.querySelector('#taskCancel').addEventListener('click', cancelEdit);
document.querySelector('#taskFilter').addEventListener('change', render);
document.querySelector('#taskRows').addEventListener('click', event => {
  const id = event.target.dataset.toggle || event.target.dataset.edit || event.target.dataset.delete;
  if (!id) return;
  if (event.target.dataset.toggle) tasks = tasks.map(task => task.id === id ? { ...task, done: !task.done } : task);
  if (event.target.dataset.delete) tasks = tasks.filter(task => task.id !== id);
  if (event.target.dataset.edit) {
    const task = tasks.find(item => item.id === id); editing = id;
    form.taskName.value = task.name; form.dueDate.value = task.due; form.priority.value = task.priority;
    document.querySelector('#taskFormTitle').textContent = 'Edit task'; document.querySelector('#taskSave').textContent = 'Save changes'; document.querySelector('#taskCancel').classList.remove('hidden'); form.taskName.focus();
  }
  save(); render();
});

render();
