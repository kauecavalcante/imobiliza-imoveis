// src/app/cadastro/utils/validation.ts
import { validateCPF } from '@/lib/formatters';
import { IFormData } from '../types';

// Função para validar o formato de um e-mail usando uma expressão regular
export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateStep = (step: number, formData: IFormData): string[] => {
  const errors: string[] = [];
  let requiredFields: (keyof IFormData)[] = [];

  switch (step) {
    case 1:
      requiredFields = ['nomeCompleto', 'email', 'nacionalidade', 'profissao', 'estadoCivil', 'rg', 'cpf', 'cep', 'rua', 'numero', 'telefone', 'emailComunicacao'];
      if (formData.nacionalidade === 'Outra') requiredFields.push('nacionalidadeOutra');
      if (formData.estadoCivil === 'Casado(a)') {
        requiredFields.push('conjugeNome', 'conjugeNacionalidade', 'conjugeProfissao', 'conjugeRg', 'conjugeCpf', 'conjugeTelefone');
        if (formData.conjugeNacionalidade === 'Outra') requiredFields.push('conjugeNacionalidadeOutra');
      }
      break;
    case 2:
      requiredFields = ['rendaMensal', 'referenciaPessoal01', 'referenciaPessoal02', 'animaisEstimacao', 'cartorioFirma'];
      break;
    case 3:
      requiredFields = ['imovelDesejado', 'condicaoProposta', 'garantiaContratual'];
      if (formData.garantiaContratual === 'FIADOR') requiredFields.push('emailFiador');
      break;
    default:
      break;
  }

  requiredFields.forEach(field => {
    if (!formData[field] || (typeof formData[field] === 'string' && !(formData[field] as string).trim())) {
      errors.push(field);
    }
  });

  // Validações específicas de formato
  if (step === 1) {
    if (formData.cpf && !validateCPF(formData.cpf)) {
      errors.push('cpf');
    }
    // Adiciona a validação para os campos de e-mail da primeira etapa
    if (formData.email && !validateEmail(formData.email)) {
      errors.push('email');
    }
    if (formData.emailComunicacao && !validateEmail(formData.emailComunicacao)) {
      errors.push('emailComunicacao');
    }
    if (formData.estadoCivil === 'Casado(a)' && formData.conjugeCpf && !validateCPF(formData.conjugeCpf)) {
      errors.push('conjugeCpf');
    }
  }

  if (step === 3) {
    // Adiciona a validação para o e-mail do fiador na terceira etapa
    if (formData.garantiaContratual === 'FIADOR' && formData.emailFiador && !validateEmail(formData.emailFiador)) {
      errors.push('emailFiador');
    }
  }

  return errors;
};
