const coverageWeights = {
  'third-party': 0.75,
  'third-party-fire-theft': 1.05,
  'fully-comprehensive': 1.45
};

const fields = [
  document.getElementById('age'),
  document.getElementById('kw'),
  document.getElementById('experience'),
  document.getElementById('price'),
  document.getElementById('coverage')
];

const resultElement = document.getElementById('result');
const statusElement = document.getElementById('status');

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount);
}

function getAgeFactor(age) {
  if (age < 25) return 1.45;
  if (age < 35) return 1.2;
  if (age < 50) return 1.05;
  return 0.9;
}

function getExperienceFactor(experience) {
  if (experience < 2) return 1.5;
  if (experience < 5) return 1.28;
  if (experience < 10) return 1.1;
  return 0.95;
}

function getPowerFactor(kw) {
  return 1 + kw / 150;
}

function setInvalidState(element, invalid) {
  element.classList.toggle('invalid', invalid);
}

function updatePrice() {
  let hasMissingData = false;

  fields.forEach((field) => {
    const value = field.value.trim();
    const shouldWarn = value === '' || Number(value) <= 0;

    setInvalidState(field, shouldWarn);
    if (shouldWarn) {
      hasMissingData = true;
    }
  });

  if (hasMissingData) {
    resultElement.textContent = '€ 0';
    statusElement.textContent = 'Missing data. Please complete all fields.';
    statusElement.classList.add('warning');
    return;
  }

  const age = Number(document.getElementById('age').value);
  const kw = Number(document.getElementById('kw').value);
  const experience = Number(document.getElementById('experience').value);
  const price = Number(document.getElementById('price').value);
  const coverage = document.getElementById('coverage').value;

  const quote =
    price *
    coverageWeights[coverage] *
    0.012 *
    getAgeFactor(age) *
    getExperienceFactor(experience) *
    getPowerFactor(kw);

  resultElement.textContent = formatCurrency(quote);
  statusElement.textContent = 'Updated automatically as you type.';
  statusElement.classList.remove('warning');
}

fields.forEach((field) => {
  field.addEventListener('input', updatePrice);
  field.addEventListener('change', updatePrice);
});

updatePrice();
