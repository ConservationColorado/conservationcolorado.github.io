function generateSimpleHashTOTP(secret, time) {
    let combined = secret + time;
    let hash = 0;
    for (var i = 0; i < combined.length; i++) {
        hash = (hash * 31 + combined.charCodeAt(i)) % 1000000;
    }
    return String(hash).padStart(6, '0');
}

const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function generateTOTPSecret(length = 16) {
    let secret = '';
    for (var i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * charset.length);
        secret += charset.charAt(randomIndex);
    }
    return secret;
}

const interval = 30;
let tick = interval;
let secret = generateTOTPSecret();

const resetCode = () => {
    let totp = generateSimpleHashTOTP(secret, new Date().toString());
    document.getElementById('totp-code').innerText = totp;
};

const loopTOTP = () => {
    tick--;
    if (tick == 0) {
        tick = interval;
        resetCode();
    }
}

resetCode();
setInterval(loopTOTP, 1000);
