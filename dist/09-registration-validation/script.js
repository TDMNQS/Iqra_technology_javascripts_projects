const currencies = { Pakistan: 'PKR', India: 'INR', 'United States': 'USD', 'United Kingdom': 'GBP', Canada: 'CAD', Australia: 'AUD', 'United Arab Emirates': 'AED', 'Saudi Arabia': 'SAR' };
const form = document.querySelector('#registrationForm');
const country = document.querySelector('#country');
country.addEventListener('change', () => { document.querySelector('#currency').value = currencies[country.value] || ''; });
function showError(id, message) { document.querySelector(`#${id}Error`).textContent = message; return !message; }
form.addEventListener('submit', event => {
  event.preventDefault();
  const fullName = document.querySelector('#fullName').value.trim(); const password = document.querySelector('#password').value; const phone = document.querySelector('#phoneNumber').value.trim(); const email = document.querySelector('#email').value.trim();
  const validName = showError('fullName', fullName ? '' : 'Full name is required.');
  const validPassword = showError('password', /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/.test(password) ? '' : 'Use 6+ characters with a letter, number and special character.');
  const validPhone = showError('phoneNumber', /^\d+$/.test(phone) ? '' : 'Phone number must contain digits only.');
  const validEmail = showError('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address.');
  const validCountry = showError('country', country.value ? '' : 'Select a country.');
  const valid = validName && validPassword && validPhone && validEmail && validCountry; const status = document.querySelector('#status');
  status.textContent = valid ? 'Registration submitted successfully.' : 'Please correct the highlighted fields.'; status.className = valid ? 'status success' : 'status error';
  if (valid) form.reset();
});
