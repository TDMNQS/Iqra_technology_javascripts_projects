const definitions = { microsoft: { name: 'microsoft 365 license', amount: 25000 }, hardware: { name: 'Hardware Update', amount: 50000 }, offshore: { name: 'Offshore support', amount: 50000 } };
const records = [];
const form = document.querySelector('#budgetForm');
const budgetSelect = document.querySelector('#budget');
const amountInput = document.querySelector('#amount');
function spentFor(key) { return records.filter(record => record.key === key).reduce((sum, record) => sum + record.amount, 0); }
function refreshForm() {
  const definition = definitions[budgetSelect.value]; const budgetAmount = definition?.amount ?? 0; const remaining = budgetAmount - spentFor(budgetSelect.value);
  document.querySelector('#budgetAmount').value = budgetAmount || ''; document.querySelector('#remaining').value = definition ? remaining : '';
  const spend = Math.max(0, Number(amountInput.value) || 0); document.querySelector('#balance').value = definition ? remaining - spend : '';
  const exhausted = Boolean(definition) && remaining <= 0; amountInput.disabled = exhausted; document.querySelector('#submitBtn').disabled = exhausted;
}
function render() {
  const body = document.querySelector('#budgetBody'); body.replaceChildren();
  records.forEach((record, index) => {
    const row = body.insertRow(); [record.subject, definitions[record.key].name, record.amount, record.balance].forEach(value => { const cell = row.insertCell(); cell.textContent = value; });
    const action = row.insertCell(); const remove = document.createElement('button'); remove.className = 'btn danger small'; remove.textContent = 'Remove';
    remove.addEventListener('click', () => { records.splice(index, 1); render(); refreshForm(); }); action.append(remove);
  }); document.querySelector('#count').textContent = records.length;
}
budgetSelect.addEventListener('change', refreshForm); amountInput.addEventListener('input', refreshForm);
form.addEventListener('submit', event => {
  event.preventDefault(); const key = budgetSelect.value; const definition = definitions[key]; const amount = Number(amountInput.value); const available = definition.amount - spentFor(key); const status = document.querySelector('#status');
  if (!Number.isFinite(amount) || amount <= 0 || amount > available) { status.textContent = `Amount must be between 1 and ${available}.`; status.className = 'status error'; return; }
  const subject = document.querySelector('#subject').value.trim(); const existing = records.find(record => record.key === key && record.subject.toLowerCase() === subject.toLowerCase());
  if (existing) { existing.amount += amount; existing.balance = available - amount; } else records.push({ subject, key, amount, balance: available - amount });
  status.textContent = existing ? 'Existing subject updated.' : 'Budget record added.'; status.className = 'status success-text'; form.reset(); refreshForm(); render();
});
