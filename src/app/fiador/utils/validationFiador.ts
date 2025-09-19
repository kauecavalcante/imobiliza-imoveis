// src/app/fiador/utils/validationFiador.ts
import { validateCPF } from '@/lib/formatters';
import { IFormDataFiador } from '../types';

export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateStepFiador = (step: number, formData: IFormDataFiador): string[] => {
  const errors: string[] = [];
  let requiredFields: (keyof IFormDataFiador)[] = [];

  switch (step) {
    case 1:
      requiredFields = ['nomeCompleto', 'email', 'nacionalidade', 'profissao', 'estadoCivil', 'rg', 'cpf', 'cep', 'rua', 'numero', 'telefone'];
      if (formData.nacionalidade === 'Outra') {
        requiredFields.push('nacionalidadeOutra');
      }
      if (formData.estadoCivil === 'Casado(a)') {
        requiredFields.push('conjugeNome', 'conjugeNacionalidade', 'conjugeProfissao', 'conjugeRg', 'conjugeCpf', 'conjugeTelefone');
        if (formData.conjugeNacionalidade === 'Outra') {
            requiredFields.push('conjugeNacionalidadeOutra');
        }
      }
      break;
    case 2:
      // Campo 'animaisEstimacao' removido da validação
      requiredFields = ['rendaMensal', 'referenciaPessoal01Nome', 'referenciaPessoal01Telefone', 'referenciaPessoal02Nome', 'referenciaPessoal02Telefone', 'cartorioFirma'];
      break;
    default:
      break;
  }

  requiredFields.forEach(field => {
    const value = formData[field];
    if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) {
      errors.push(field as string);
    }
  });

  // Validações específicas de formato
  if (step === 1) {
    if (formData.cpf && !validateCPF(formData.cpf)) {
      errors.push('cpf');
    }
    if (formData.email && !validateEmail(formData.email)) {
      errors.push('email');
    }
    if (formData.estadoCivil === 'Casado(a)' && formData.conjugeCpf && !validateCPF(formData.conjugeCpf)) {
      errors.push('conjugeCpf');
    }
  }

  return errors;
};
