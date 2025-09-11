// Função para remover todos os caracteres não numéricos
export const unmask = (value: string): string => value.replace(/\D/g, '');

// Máscara para CPF: 999.999.999-99
export const maskCPF = (value: string): string => {
  return unmask(value)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .slice(0, 14); // Limita o tamanho
};

// Máscara para Telefone: (99) 99999-9999
export const maskPhone = (value: string): string => {
  let v = unmask(value);
  if (v.length > 10) {
      v = v.replace(/(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else if (v.length > 5) {
      v = v.replace(/(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else if (v.length > 2) {
      v = v.replace(/(\d{2})(\d{0,5}).*/, '($1) $2');
  } else {
      v = v.replace(/(\d*)/, '($1');
  }
  return v.slice(0, 15);
};

// Máscara para Moeda: R$ 1.234,56
export const maskCurrency = (value: string): string => {
  const numericValue = parseFloat(unmask(value)) / 100;
  if (isNaN(numericValue)) {
    return "";
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
};

// Validador de CPF
export const validateCPF = (cpf: string): boolean => {
  const cpfClean = unmask(cpf);
  if (cpfClean.length !== 11 || /^(\d)\1{10}$/.test(cpfClean)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpfClean.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpfClean.substring(9, 10))) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpfClean.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpfClean.substring(10, 11))) {
    return false;
  }

  return true;
};
