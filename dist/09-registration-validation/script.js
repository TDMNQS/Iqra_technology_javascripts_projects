const registrationForm = document.querySelector('#registrationForm');
const currencies = {
  India: 'INR — Indian Rupee',
  'United States': 'USD — US Dollar',
  'United Kingdom': 'GBP — Pound Sterling',
  'United Arab Emirates': 'AED — UAE Dirham',
  Japan: 'JPY — Japanese Yen',
  Canada: 'CAD — Canadian Dollar',
  Australia: 'AUD — Australian Dollar'
};
const validators = {
  fullName: value => value.trim() ? '' : 'Full name cannot be empty.',
  password: value => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/.test(value) ? '' : 'Use 6+ characters with a letter, number, and special character.',
  phone: value => /^\d+$/.test(value) ? '' : 'Phone number must contain digits only.',
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address.',
  country: value => value ? '' : 'Select a country.'
};

function validateField(id) {
  const input = document.querySelector(`#${id}`);
  const field = document.querySelector(`[data-field="${id}"]`);
  const error = validators[id](input.value);
  field.classList.toggle('invalid', Boolean(error));
  field.classList.toggle('valid', !error);
  field.querySelector('.error').textContent = error;
  return !error;
}

function updatePasswordRules() {
  const value = document.querySelector('#password').value;
  const rules = { ruleLength: value.length >= 6, ruleLetter: /[A-Za-z]/.test(value), ruleNumber: /\d/.test(value), ruleSpecial: /[^A-Za-z\d]/.test(value) };
  Object.entries(rules).forEach(([id, passes]) => {
    const row = document.querySelector(`#${id}`); row.style.color = passes ? 'var(--success)' : 'var(--muted)'; row.textContent = `${passes ? '✓' : '○'} ${row.textContent.slice(2)}`;
  });
}

Object.keys(validators).forEach(id => {
  const input = document.querySelector(`#${id}`);
  input.addEventListener('blur', () => validateField(id));
  input.addEventListener('input', () => { if (input.closest('.field').classList.contains('invalid')) validateField(id); });
});
document.querySelector('#password').addEventListener('input', updatePasswordRules);
document.querySelector('#phone').addEventListener('input', event => { event.target.value = event.target.value.replace(/\D/g, ''); });
document.querySelector('#country').addEventListener('change', event => {
  document.querySelector('#currency').value = currencies[event.target.value] || '';
  validateField('country');
});
registrationForm.addEventListener('submit', event => {
  event.preventDefault();
  const valid = Object.keys(validators).map(validateField).every(Boolean);
  const status = document.querySelector('#registrationStatus');
  status.className = `status ${valid ? 'success' : 'danger'}`;
  status.textContent = valid ? 'Registration validated successfully. The form is ready to submit.' : 'Please correct the highlighted fields.';
});
