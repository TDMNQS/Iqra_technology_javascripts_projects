const display = document.querySelector('#otpDisplay');
const timerLabel = document.querySelector('#timer');
const lengthSelect = document.querySelector('#otpLength');
const input = document.querySelector('#otpInput');
const status = document.querySelector('#status');
const verifyButton = document.querySelector('#verifyBtn');

let currentOtp = '';
let expiresAt = 0;
let timerId;

function secureOtp(length) {
  const values = new Uint32Array(length);
  crypto.getRandomValues(values);
  return Array.from(values, value => value % 10).join('');
}

function renderOtp() {
  display.replaceChildren(...currentOtp.split('').map(number => {
    const digit = document.createElement('span');
    digit.className = 'otp-digit';
    digit.textContent = number;
    return digit;
  }));
}

function updateTimer() {
  const seconds = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
  timerLabel.textContent = `00:${String(seconds).padStart(2, '0')}`;
  if (seconds === 0) {
    clearInterval(timerId);
    verifyButton.disabled = true;
    status.className = 'status danger';
    status.textContent = 'OTP expired. Generate a new code to continue.';
  }
}

function generateOtp() {
  clearInterval(timerId);
  currentOtp = secureOtp(Number(lengthSelect.value));
  expiresAt = Date.now() + 60_000;
  input.value = '';
  input.maxLength = currentOtp.length;
  verifyButton.disabled = false;
  status.className = 'status';
  status.textContent = 'A new OTP is active for 60 seconds.';
  renderOtp();
  updateTimer();
  timerId = setInterval(updateTimer, 250);
}

document.querySelector('#generateBtn').addEventListener('click', generateOtp);
lengthSelect.addEventListener('change', generateOtp);
input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, ''); });
document.querySelector('#verifyForm').addEventListener('submit', event => {
  event.preventDefault();
  if (Date.now() >= expiresAt) return updateTimer();
  const matches = input.value === currentOtp;
  status.className = `status ${matches ? 'success' : 'danger'}`;
  status.textContent = matches ? 'OTP verified successfully.' : 'That code is incorrect. Please try again.';
});

generateOtp();
