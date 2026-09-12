const otpInput = document.querySelector('#otp');
const display = document.querySelector('#display');
const timerText = document.querySelector('#timer');
const status = document.querySelector('#status');
const generatedOtps = new Set();
let currentOtp = '';
let secondsLeft = 0;
let timerId = null;

function randomOtp() {
  let value;
  do {
    const number = new Uint32Array(1);
    crypto.getRandomValues(number);
    value = String(1000 + (number[0] % 9000));
  } while (generatedOtps.has(value));
  generatedOtps.add(value);
  return value;
}

function renderTimer() {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  display.textContent = `${minutes} : ${String(seconds).padStart(2, '0')}`;
  timerText.textContent = secondsLeft ? `OTP expires in ${minutes}:${String(seconds).padStart(2, '0')}` : 'OTP expired. Generate a new one.';
}

function stopTimer() { clearInterval(timerId); timerId = null; }

document.querySelector('#getOtpBtn').addEventListener('click', () => {
  stopTimer(); currentOtp = randomOtp(); secondsLeft = 120; otpInput.value = '';
  status.textContent = ''; status.className = 'status'; renderTimer();
  alert(`Generated OTP: ${currentOtp}`);
  timerId = setInterval(() => {
    secondsLeft -= 1; renderTimer();
    if (secondsLeft <= 0) {
      stopTimer(); currentOtp = '';
      status.textContent = 'OTP expired. Please generate a new OTP.'; status.className = 'status error';
    }
  }, 1000);
});

document.querySelector('#checkOtpBtn').addEventListener('click', () => {
  if (!currentOtp || secondsLeft <= 0) {
    status.textContent = 'Please generate a valid OTP first.'; status.className = 'status error';
  } else if (otpInput.value.trim() === currentOtp) {
    stopTimer(); status.textContent = 'OTP verified successfully.'; status.className = 'status success-text';
    timerText.textContent = 'Verification completed before expiry.'; currentOtp = '';
  } else {
    status.textContent = 'Incorrect OTP. Please try again.'; status.className = 'status error';
  }
});
