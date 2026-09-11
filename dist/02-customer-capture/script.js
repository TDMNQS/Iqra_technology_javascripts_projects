const form = document.querySelector('#customerForm');
const type = document.querySelector('#customerType');
const individual = document.querySelector('#individualFields');
const business = document.querySelector('#businessFields');
const preview = document.querySelector('#profilePreview');
const emptyPreview = document.querySelector('#emptyPreview');

function setRequired(container, required) {
  container.querySelectorAll('input, select').forEach(field => { field.required = required; });
}

function switchCustomerType() {
  const isBusiness = type.value === 'business';
  individual.classList.toggle('hidden', isBusiness);
  business.classList.toggle('hidden', !isBusiness);
  setRequired(individual, !isBusiness);
  setRequired(business, isBusiness);
  document.querySelector('#typeBadge').textContent = isBusiness ? 'Business' : 'Individual';
}

function safe(value) {
  const node = document.createElement('span');
  node.textContent = value;
  return node.innerHTML;
}

type.addEventListener('change', switchCustomerType);
form.addEventListener('reset', () => setTimeout(() => {
  switchCustomerType();
  preview.classList.add('hidden');
  emptyPreview.classList.remove('hidden');
}, 0));

form.addEventListener('submit', event => {
  event.preventDefault();
  const isBusiness = type.value === 'business';
  const details = isBusiness
    ? [['Type', 'Business'], ['Contact', form.fullName.value], ['Company', form.companyName.value], ['GSTIN', form.taxId.value], ['Employees', form.employees.value], ['Email', form.email.value], ['Phone', form.phone.value]]
    : [['Type', 'Individual'], ['Name', form.fullName.value], ['Date of birth', form.dob.value], ['ID type', form.idType.value], ['ID number', form.idNumber.value], ['Email', form.email.value], ['Phone', form.phone.value]];
  preview.innerHTML = `<dl>${details.map(([label, value]) => `<dt>${safe(label)}</dt><dd>${safe(value || '—')}</dd>`).join('')}</dl>`;
  preview.classList.remove('hidden');
  emptyPreview.classList.add('hidden');
});

switchCustomerType();
