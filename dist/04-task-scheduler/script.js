const tasks = [];
const form = document.querySelector('#taskForm');
let editIndex = -1;

function resetForm() {
  form.reset(); editIndex = -1;
  document.querySelector('#saveTask').textContent = 'Add Task';
  document.querySelector('#cancelEdit').classList.add('hidden');
}

function render() {
  const list = document.querySelector('#taskList'); list.replaceChildren();
  document.querySelector('#emptyState').classList.toggle('hidden', tasks.length > 0);
  tasks.forEach((task, index) => {
    const item = document.createElement('li'); item.className = 'task-item';
    const details = document.createElement('div');
    const title = document.createElement('strong'); title.textContent = task.name;
    const meta = document.createElement('div'); meta.className = `priority-${task.priority}`; meta.textContent = `${task.dueDate} · ${task.priority.toUpperCase()}`;
    details.append(title, meta);
    const actions = document.createElement('div'); actions.className = 'task-actions';
    const edit = document.createElement('button'); edit.className = 'btn btn-warning btn-small'; edit.textContent = 'Edit';
    edit.addEventListener('click', () => {
      editIndex = index; document.querySelector('#taskName').value = task.name; document.querySelector('#dueDate').value = task.dueDate; document.querySelector('#priority').value = task.priority;
      document.querySelector('#saveTask').textContent = 'Update Task'; document.querySelector('#cancelEdit').classList.remove('hidden');
    });
    const remove = document.createElement('button'); remove.className = 'btn btn-danger btn-small'; remove.textContent = 'Delete';
    remove.addEventListener('click', () => { tasks.splice(index, 1); if (editIndex === index) resetForm(); render(); });
    actions.append(edit, remove); item.append(details, actions); list.append(item);
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const task = { name: document.querySelector('#taskName').value.trim(), dueDate: document.querySelector('#dueDate').value, priority: document.querySelector('#priority').value };
  if (editIndex >= 0) tasks[editIndex] = task; else tasks.push(task);
  resetForm(); render();
});
document.querySelector('#cancelEdit').addEventListener('click', resetForm);
