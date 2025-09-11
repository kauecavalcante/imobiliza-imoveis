// src/app/cadastro/types/index.ts
export interface IFormData {
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
  emailComunicacao: string;
  conjugeNome: string;
  conjugeNacionalidade: string;
  conjugeNacionalidadeOutra: string;
  conjugeProfissao: string;
  conjugeRg: string;
  conjugeCpf: string;
  conjugeTelefone: string;
  rendaMensal: string;
  referenciaPessoal01: string;
  referenciaPessoal02: string;
  imovelDesejado: string;
  condicaoProposta: string;
  vencimentoAluguel: string;
  animaisEstimacao: string;
  garantiaContratual: string;
  emailFiador: string;
  cartorioFirma: string;
  aceiteObservacoes: boolean;
  aceiteReserva: boolean;
  aceiteVeracidade: boolean;
  dataPreenchimento: string;
}

export interface IFileState {
  documentosPessoais: File[];
  comprovanteRenda: File[];
  documentosConjuge: File[];
}