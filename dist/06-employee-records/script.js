const employeeKey = 'numan-employee-records';
let employees = JSON.parse(localStorage.getItem(employeeKey) || 'null') || [
  { id: 'e1', name: 'Aarav Patil', age: 27, email: 'aarav@company.com', department: 'Engineering' },
  { id: 'e2', name: 'Sara Khan', age: 24, email: 'sara@company.com', department: 'Design' },
  { id: 'e3', name: 'Kabir Mehta', age: 31, email: 'kabir@company.com', department: 'Finance' }
];
let editEmployeeId = null;
const employeeForm = document.querySelector('#employeeForm');

function persistEmployees() { localStorage.setItem(employeeKey, JSON.stringify(employees)); }
function encode(value) { const el = document.createElement('span'); el.textContent = value; return el.innerHTML; }
function resetEmployeeForm() {
  editEmployeeId = null; employeeForm.reset();
  document.querySelector('#employeeFormTitle').textContent = 'Add employee'; document.querySelector('#employeeSave').textContent = 'Add employee'; document.querySelector('#employeeCancel').classList.add('hidden');
}
function renderEmployees() {
  const search = document.querySelector('#employeeSearch').value.toLowerCase().trim();
  const visible = employees.filter(employee => Object.values(employee).some(value => String(value).toLowerCase().includes(search)));
  document.querySelector('#employeeCount').textContent = employees.length;
  document.querySelector('#departmentCount').textContent = new Set(employees.map(employee => employee.department)).size;
  document.querySelector('#averageAge').textContent = employees.length ? Math.round(employees.reduce((sum, employee) => sum + employee.age, 0) / employees.length) : 0;
  document.querySelector('#employeeRows').innerHTML = visible.length ? visible.map(employee => `<tr><td><strong>${encode(employee.name)}</strong></td><td>${employee.age}</td><td>${encode(employee.email)}</td><td><span class="badge">${encode(employee.department)}</span></td><td><div class="actions" style="margin:0"><button class="btn secondary small" data-edit="${employee.id}">Edit</button><button class="btn danger small" data-delete="${employee.id}">Delete</button></div></td></tr>`).join('') : '<tr><td colspan="5" class="empty">No matching employees found.</td></tr>';
}

employeeForm.addEventListener('submit', event => {
  event.preventDefault();
  const email = employeeForm.employeeEmail.value.trim().toLowerCase();
  const duplicate = employees.some(employee => employee.email.toLowerCase() === email && employee.id !== editEmployeeId);
  if (duplicate) { document.querySelector('#employeeStatus').className = 'status danger'; document.querySelector('#employeeStatus').textContent = 'An employee with this email already exists.'; return; }
  const record = { id: editEmployeeId || `${Date.now()}`, name: employeeForm.employeeName.value.trim(), age: Number(employeeForm.employeeAge.value), email, department: employeeForm.employeeDepartment.value };
  employees = editEmployeeId ? employees.map(employee => employee.id === editEmployeeId ? record : employee) : [...employees, record];
  persistEmployees(); resetEmployeeForm(); renderEmployees();
  document.querySelector('#employeeStatus').className = 'status success'; document.querySelector('#employeeStatus').textContent = 'Employee record saved.';
});

document.querySelector('#employeeSearch').addEventListener('input', renderEmployees);
document.querySelector('#employeeCancel').addEventListener('click', resetEmployeeForm);
document.querySelector('#employeeRows').addEventListener('click', event => {
  const edit = event.target.dataset.edit; const remove = event.target.dataset.delete;
  if (remove) { employees = employees.filter(employee => employee.id !== remove); persistEmployees(); renderEmployees(); }
  if (edit) {
    const employee = employees.find(item => item.id === edit); editEmployeeId = edit;
    employeeForm.employeeName.value = employee.name; employeeForm.employeeAge.value = employee.age; employeeForm.employeeEmail.value = employee.email; employeeForm.employeeDepartment.value = employee.department;
    document.querySelector('#employeeFormTitle').textContent = 'Edit employee'; document.querySelector('#employeeSave').textContent = 'Save changes'; document.querySelector('#employeeCancel').classList.remove('hidden'); employeeForm.employeeName.focus();
  }
});

renderEmployees();
