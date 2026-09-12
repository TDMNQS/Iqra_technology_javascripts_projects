const expenses = [];
const form = document.querySelector('#expenseForm');
let editIndex = -1;
function resetForm() { form.reset(); editIndex = -1; document.querySelector('#saveExpense').textContent = 'Add Expense'; document.querySelector('#cancelEdit').classList.add('hidden'); }
function render() {
  const body = document.querySelector('#expenseBody'); body.replaceChildren();
  expenses.forEach((expense, index) => {
    const row = body.insertRow(); [`$${expense.amount.toFixed(2)}`, expense.category, expense.description].forEach(value => { const cell = row.insertCell(); cell.textContent = value; });
    const action = row.insertCell();
    const edit = document.createElement('button'); edit.className = 'btn btn-warning btn-small'; edit.textContent = 'Edit'; edit.addEventListener('click', () => {
      editIndex = index; document.querySelector('#amount').value = expense.amount; document.querySelector('#category').value = expense.category; document.querySelector('#description').value = expense.description;
      document.querySelector('#saveExpense').textContent = 'Update Expense'; document.querySelector('#cancelEdit').classList.remove('hidden');
    });
    const remove = document.createElement('button'); remove.className = 'btn btn-danger btn-small'; remove.textContent = 'Delete'; remove.addEventListener('click', () => { expenses.splice(index, 1); if (editIndex === index) resetForm(); render(); });
    action.append(edit, document.createTextNode(' '), remove);
  });
  document.querySelector('#totalExpenses').textContent = expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);
}
form.addEventListener('submit', event => {
  event.preventDefault(); const expense = { amount: Number(document.querySelector('#amount').value), category: document.querySelector('#category').value.trim(), description: document.querySelector('#description').value.trim() };
  if (editIndex >= 0) expenses[editIndex] = expense; else expenses.push(expense); resetForm(); render();
});
document.querySelector('#cancelEdit').addEventListener('click', resetForm); render();
