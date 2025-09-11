// src/app/cadastro/utils/validation.ts
import { validateCPF } from '@/lib/formatters';
import { IFormData } from '../types';

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

  if (step === 1) {
    if (formData.cpf && !validateCPF(formData.cpf)) {
      errors.push('cpf');
    }
    if (formData.estadoCivil === 'Casado(a)' && formData.conjugeCpf && !validateCPF(formData.conjugeCpf)) {
      errors.push('conjugeCpf');
    }
  }

  return errors;
};