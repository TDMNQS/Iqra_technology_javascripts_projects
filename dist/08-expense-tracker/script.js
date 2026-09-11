const expenseKey = 'numan-expense-tracker';
let expenses = JSON.parse(localStorage.getItem(expenseKey) || 'null') || [
  { id: 'x1', amount: 650, category: 'Learning', date: new Date().toISOString().slice(0,10), description: 'JavaScript reference book' },
  { id: 'x2', amount: 280, category: 'Food', date: new Date().toISOString().slice(0,10), description: 'Lunch' },
  { id: 'x3', amount: 450, category: 'Travel', date: new Date().toISOString().slice(0,10), description: 'Local travel' }
];
let editExpenseId = null;
const expenseForm = document.querySelector('#expenseForm');
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

function storeExpenses() { localStorage.setItem(expenseKey, JSON.stringify(expenses)); }
function html(value) { const el = document.createElement('span'); el.textContent = value; return el.innerHTML; }
function resetExpense() {
  editExpenseId = null; expenseForm.reset(); document.querySelector('#expenseDate').value = new Date().toISOString().slice(0,10);
  document.querySelector('#expenseFormTitle').textContent = 'Add expense'; document.querySelector('#expenseSave').textContent = 'Add expense'; document.querySelector('#expenseCancel').classList.add('hidden');
}
function categoryTotals() {
  return expenses.reduce((totals, item) => ({ ...totals, [item.category]: (totals[item.category] || 0) + item.amount }), {});
}
function renderExpenses() {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totals = categoryTotals();
  const top = Object.entries(totals).sort((a,b) => b[1] - a[1])[0];
  document.querySelector('#expenseTotal').textContent = currency.format(total);
  document.querySelector('#expenseCount').textContent = expenses.length;
  document.querySelector('#topCategory').textContent = top?.[0] || '—';
  document.querySelector('#categoryBars').innerHTML = top ? Object.entries(totals).sort((a,b) => b[1] - a[1]).map(([category, amount]) => `<div class="bar-row"><span>${html(category)}</span><div class="bar-track"><div class="bar-fill" style="width:${total ? (amount / total) * 100 : 0}%"></div></div><strong>${currency.format(amount)}</strong></div>`).join('') : '<div class="empty">Add an expense to see the breakdown.</div>';
  const filter = document.querySelector('#expenseFilter').value;
  const visible = expenses.filter(item => filter === 'all' || item.category === filter).sort((a,b) => b.date.localeCompare(a.date));
  document.querySelector('#expenseRows').innerHTML = visible.length ? visible.map(item => `<tr><td>${new Date(`${item.date}T00:00:00`).toLocaleDateString('en-IN')}</td><td><strong>${html(item.description)}</strong></td><td><span class="badge">${html(item.category)}</span></td><td>${currency.format(item.amount)}</td><td><div class="actions" style="margin:0"><button class="btn secondary small" data-edit="${item.id}">Edit</button><button class="btn danger small" data-delete="${item.id}">Delete</button></div></td></tr>`).join('') : '<tr><td colspan="5" class="empty">No expenses in this view.</td></tr>';
}

const expenseFilter = document.querySelector('#expenseFilter');
['Food','Travel','Housing','Learning','Health','Entertainment','Other'].forEach(category => expenseFilter.add(new Option(category, category)));
expenseFilter.addEventListener('change', renderExpenses);
document.querySelector('#expenseCancel').addEventListener('click', resetExpense);
expenseForm.addEventListener('submit', event => {
  event.preventDefault();
  const record = { id: editExpenseId || `${Date.now()}`, amount: Number(expenseForm.expenseAmount.value), category: expenseForm.expenseCategory.value, date: expenseForm.expenseDate.value, description: expenseForm.expenseDescription.value.trim() };
  expenses = editExpenseId ? expenses.map(item => item.id === editExpenseId ? record : item) : [...expenses, record];
  storeExpenses(); resetExpense(); renderExpenses();
});
document.querySelector('#expenseRows').addEventListener('click', event => {
  const edit = event.target.dataset.edit; const remove = event.target.dataset.delete;
  if (remove) { expenses = expenses.filter(item => item.id !== remove); storeExpenses(); renderExpenses(); }
  if (edit) {
    const item = expenses.find(expense => expense.id === edit); editExpenseId = edit;
    expenseForm.expenseAmount.value = item.amount; expenseForm.expenseCategory.value = item.category; expenseForm.expenseDate.value = item.date; expenseForm.expenseDescription.value = item.description;
    document.querySelector('#expenseFormTitle').textContent = 'Edit expense'; document.querySelector('#expenseSave').textContent = 'Save changes'; document.querySelector('#expenseCancel').classList.remove('hidden'); expenseForm.expenseAmount.focus();
  }
});
resetExpense(); renderExpenses();
