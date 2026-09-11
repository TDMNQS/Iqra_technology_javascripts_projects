const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const storeKey = 'numan-budget-manager';
const defaults = { income: 50000, budgets: [
  { id: 'housing', category: 'Housing', amount: 18000, note: 'Rent and utilities' },
  { id: 'food', category: 'Food', amount: 8000, note: 'Groceries and meals' },
  { id: 'learning', category: 'Learning', amount: 3000, note: 'Courses and books' }
] };
let state = JSON.parse(localStorage.getItem(storeKey) || 'null') || defaults;
let editId = null;
const form = document.querySelector('#budgetForm');

function persist() { localStorage.setItem(storeKey, JSON.stringify(state)); }
function escapeText(value) { const el = document.createElement('span'); el.textContent = value; return el.innerHTML; }

function render() {
  const allocated = state.budgets.reduce((sum, item) => sum + item.amount, 0);
  const remaining = state.income - allocated;
  const usage = state.income ? Math.round((allocated / state.income) * 100) : 0;
  document.querySelector('#income').value = state.income;
  document.querySelector('#incomeMetric').textContent = money.format(state.income);
  document.querySelector('#allocatedMetric').textContent = money.format(allocated);
  document.querySelector('#remainingMetric').textContent = money.format(remaining);
  document.querySelector('#remainingMetric').style.color = remaining < 0 ? 'var(--danger)' : 'var(--text)';
  document.querySelector('#usageBar').style.width = `${Math.min(100, usage)}%`;
  document.querySelector('#usageText').textContent = `${usage}% of income allocated`;
  document.querySelector('#healthBadge').textContent = remaining < 0 ? 'Over budget' : usage > 85 ? 'Near limit' : 'On track';
  document.querySelector('#healthBadge').className = `badge ${remaining < 0 ? 'high' : usage > 85 ? 'medium' : 'low'}`;
  document.querySelector('#budgetCount').textContent = `${state.budgets.length} ${state.budgets.length === 1 ? 'category' : 'categories'}`;
  document.querySelector('#budgetRows').innerHTML = state.budgets.length ? state.budgets.map(item => `<tr><td><strong>${escapeText(item.category)}</strong></td><td>${money.format(item.amount)}</td><td class="muted">${escapeText(item.note || '—')}</td><td><div class="actions" style="margin:0"><button class="btn secondary small" data-edit="${item.id}">Edit</button><button class="btn danger small" data-delete="${item.id}">Delete</button></div></td></tr>`).join('') : '<tr><td colspan="4" class="empty">No budgets added yet.</td></tr>';
}

function cancelEdit() {
  editId = null;
  form.reset();
  document.querySelector('#income').value = state.income;
  document.querySelector('#formTitle').textContent = 'Add budget';
  document.querySelector('#saveBtn').textContent = 'Add budget';
  document.querySelector('#cancelBtn').classList.add('hidden');
}

form.addEventListener('submit', event => {
  event.preventDefault();
  state.income = Number(form.income.value);
  const entry = { id: editId || `${Date.now()}`, category: form.category.value.trim(), amount: Number(form.amount.value), note: form.note.value.trim() };
  const duplicate = state.budgets.some(item => item.category.toLowerCase() === entry.category.toLowerCase() && item.id !== editId);
  if (duplicate) {
    document.querySelector('#status').className = 'status danger';
    document.querySelector('#status').textContent = 'That category already exists.';
    return;
  }
  if (editId) state.budgets = state.budgets.map(item => item.id === editId ? entry : item);
  else state.budgets.push(entry);
  persist();
  cancelEdit();
  document.querySelector('#status').className = 'status success';
  document.querySelector('#status').textContent = 'Budget saved.';
  render();
});

document.querySelector('#income').addEventListener('change', event => { state.income = Number(event.target.value); persist(); render(); });
document.querySelector('#cancelBtn').addEventListener('click', cancelEdit);
document.querySelector('#budgetRows').addEventListener('click', event => {
  const edit = event.target.dataset.edit;
  const remove = event.target.dataset.delete;
  if (remove) { state.budgets = state.budgets.filter(item => item.id !== remove); persist(); render(); }
  if (edit) {
    const item = state.budgets.find(row => row.id === edit);
    editId = edit;
    form.category.value = item.category; form.amount.value = item.amount; form.note.value = item.note;
    document.querySelector('#formTitle').textContent = 'Edit budget';
    document.querySelector('#saveBtn').textContent = 'Save changes';
    document.querySelector('#cancelBtn').classList.remove('hidden');
    form.category.focus();
  }
});

render();
