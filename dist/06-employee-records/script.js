const employees = [];
const form = document.querySelector('#employeeForm');
let editIndex = -1;
function resetForm() { form.reset(); editIndex = -1; document.querySelector('#saveEmployee').textContent = 'Add Employee'; document.querySelector('#cancelEdit').classList.add('hidden'); }
function render() {
  const query = document.querySelector('#search').value.trim().toLowerCase(); const body = document.querySelector('#employeeBody'); body.replaceChildren();
  const matches = employees.map((employee, index) => ({ employee, index })).filter(({ employee }) => Object.values(employee).some(value => String(value).toLowerCase().includes(query)));
  document.querySelector('#emptyState').classList.toggle('hidden', matches.length > 0);
  matches.forEach(({ employee, index }) => {
    const row = body.insertRow(); [employee.name, employee.age, employee.email, employee.department].forEach(value => { const cell = row.insertCell(); cell.textContent = value; });
    const action = row.insertCell();
    const edit = document.createElement('button'); edit.className = 'btn btn-warning btn-small'; edit.textContent = 'Edit'; edit.addEventListener('click', () => {
      editIndex = index; Object.entries(employee).forEach(([key, value]) => { document.querySelector(`#${key}`).value = value; }); document.querySelector('#saveEmployee').textContent = 'Update Employee'; document.querySelector('#cancelEdit').classList.remove('hidden');
    });
    const remove = document.createElement('button'); remove.className = 'btn btn-danger btn-small'; remove.textContent = 'Delete'; remove.addEventListener('click', () => { employees.splice(index, 1); if (editIndex === index) resetForm(); render(); });
    action.append(edit, document.createTextNode(' '), remove);
  });
}
form.addEventListener('submit', event => {
  event.preventDefault(); const employee = { name: document.querySelector('#name').value.trim(), age: Number(document.querySelector('#age').value), email: document.querySelector('#email').value.trim(), department: document.querySelector('#department').value.trim() };
  const duplicate = employees.some((item, index) => item.email.toLowerCase() === employee.email.toLowerCase() && index !== editIndex);
  if (duplicate) { document.querySelector('#status').textContent = 'This email already exists.'; document.querySelector('#status').className = 'status error'; return; }
  if (editIndex >= 0) employees[editIndex] = employee; else employees.push(employee);
  document.querySelector('#status').textContent = editIndex >= 0 ? 'Employee updated.' : 'Employee added.'; document.querySelector('#status').className = 'status success'; resetForm(); render();
});
document.querySelector('#cancelEdit').addEventListener('click', resetForm); document.querySelector('#search').addEventListener('input', render); render();
