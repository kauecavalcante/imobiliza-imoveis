// src/app/fiador/types/index.ts
export interface IFormDataFiador {
  email: string;
  nomeCompleto: string;
  nacionalidade: string;
  nacionalidadeOutra: string;
  estadoCivil: string;
  profissao: string;
  rg: string;
  cpf: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  telefone: string;
  conjugeNome: string;
  conjugeNacionalidade: string;
  conjugeNacionalidadeOutra: string;
  conjugeProfissao: string;
  conjugeRg: string;
  conjugeCpf: string;
  conjugeTelefone: string;
  rendaMensal: string;
  referenciaPessoal01Nome: string;
  referenciaPessoal01Telefone: string;
  referenciaPessoal02Nome: string;
  referenciaPessoal02Telefone: string;
  cartorioFirma: string;
  dataPreenchimento: string;
  locatarioPrincipal: string;
  // Campos de aceite adicionados
  aceiteObservacoes: boolean;
  aceiteReserva: boolean;
  aceiteVeracidade: boolean;
}

export interface IFileStateFiador {
  documentosPessoais: File[];
  comprovanteRenda: File[];
  documentosConjuge: File[];
}
