const form = document.querySelector('#customerForm');
const customerType = document.querySelector('#customerType');
const amountRow = document.querySelector('#amountRow');
const amountInput = document.querySelector('#amount');
const existingCustomers = [];
const newCustomers = [];

customerType.addEventListener('change', () => {
  const existing = customerType.value === 'existing';
  amountRow.classList.toggle('hidden', !existing); amountInput.required = existing;
  if (!existing) amountInput.value = '';
});
function addCell(row, value) { const cell = row.insertCell(); cell.textContent = value; }
function render() {
  const existingBody = document.querySelector('#existingBody');
  const newBody = document.querySelector('#newBody');
  existingBody.replaceChildren(); newBody.replaceChildren();
  existingCustomers.forEach((customer, index) => {
    const row = existingBody.insertRow(); addCell(row, customer.name); addCell(row, customer.email); addCell(row, customer.amount);
    const action = row.insertCell(); const remove = document.createElement('button'); remove.className = 'btn danger small'; remove.textContent = 'Remove';
    remove.addEventListener('click', () => { existingCustomers.splice(index, 1); render(); }); action.append(remove);
  });
  newCustomers.forEach((customer, index) => {
    const row = newBody.insertRow(); addCell(row, customer.name); addCell(row, customer.email);
    const action = row.insertCell(); const approve = document.createElement('button'); approve.className = 'btn small'; approve.textContent = 'Approve';
    approve.addEventListener('click', () => { existingCustomers.push({ ...customer, amount: 0 }); newCustomers.splice(index, 1); render(); }); action.append(approve);
  });
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const customer = { name: document.querySelector('#name').value.trim(), email: document.querySelector('#email').value.trim() };
  if (customerType.value === 'existing') existingCustomers.push({ ...customer, amount: Number(amountInput.value) }); else newCustomers.push(customer);
  document.querySelector('#status').textContent = 'Customer added successfully.';
  form.reset(); amountRow.classList.add('hidden'); amountInput.required = false; render();
});
