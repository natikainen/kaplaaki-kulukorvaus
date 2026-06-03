// validators.js — form validation & formatting utilities
function validateIBAN(iban) {
  const cleaned = iban.replace(/\s/g, "").toUpperCase();
  if (!/^FI\d{16}$/.test(cleaned) && !/^[A-Z]{2}\d{2}[A-Z0-9]{4,30}$/.test(cleaned)) return false;
  return true;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[\d\s+\-()]{7,20}$/.test(phone);
}

function formatIBAN(value) {
  const cleaned = value.replace(/\s/g, "").toUpperCase();
  return cleaned.match(/.{1,4}/g)?.join(" ") ?? cleaned;
}

function formatPhone(value) {
  const digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith("+358")) {
    const rest = digits.slice(4);
    const parts = [rest.slice(0, 2), rest.slice(2, 5), rest.slice(5)].filter(Boolean);
    return "+358 " + parts.join(" ");
  }
  if (digits.startsWith("0")) {
    const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6)].filter(Boolean);
    return parts.join(" ");
  }
  return value;
}

function parseAmount(str) {
  if (!str) return 0;
  const cleaned = str.replace(",", ".").trim();
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}
