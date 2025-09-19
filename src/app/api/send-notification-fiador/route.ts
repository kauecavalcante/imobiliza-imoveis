import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Função para formatar o número como moeda brasileira
const formatCurrency = (value: string | number) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) / 100 : value / 100;
  if (isNaN(numericValue)) {
    return "Não informado";
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
};

export async function POST(request: NextRequest) {
  try {
    const { formData, files } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL;

    if (!adminEmail || !fromEmail || !process.env.RESEND_API_KEY) {
      console.error('Variáveis de ambiente de e-mail não configuradas.');
      return NextResponse.json({ message: 'Proposta salva, mas notificação falhou internamente.' });
    }
    
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const logoUrl = `${baseUrl}/logo-imobiliza.png`;

    // ATUALIZAÇÃO 1: Lógica para exibir "Nenhum arquivo anexado"
    const createFileList = (title: string, fileList: { name: string, url: string }[]) => {
      if (!fileList || fileList.length === 0) return '<p>Nenhum arquivo anexado.</p>';
      return `
        <p style="margin-top: 15px; margin-bottom: 5px;"><strong>${title}:</strong></p>
        <ul style="margin: 0; padding-left: 20px; list-style-type: none;">
          ${fileList.map(file => `<li><a href="${file.url}" target="_blank" rel="noopener noreferrer" style="color: #1a73e8; text-decoration: none;">📄 ${file.name}</a></li>`).join('')}
        </ul>
      `;
    };
    
    const dataItem = (label: string, value: string | boolean | number | undefined, fullWidth = false) => {
        if (!value) return '';
        const displayValue = label === 'Renda Mensal (média)' ? formatCurrency(value as string) : value;
        return `<div class="data-item ${fullWidth ? 'full-width' : ''}">
                  <p>
                    <strong>${label}</strong>
                    <span>${displayValue}</span>
                  </p>
                </div>`;
    };
    
    const conjugeSection = formData.estadoCivil === 'Casado(a)' ? `
      <h2>Dados do Cônjuge</h2>
      <div class="data-grid">
        ${dataItem('Nome Completo', formData.conjugeNome)}
        ${dataItem('Nacionalidade', formData.conjugeNacionalidade === 'Outra' ? formData.conjugeNacionalidadeOutra : formData.conjugeNacionalidade)}
        ${dataItem('Profissão', formData.conjugeProfissao)}
        ${dataItem('RG', formData.conjugeRg)}
        ${dataItem('CPF', formData.conjugeCpf)}
        ${dataItem('Telefone', formData.conjugeTelefone)}
      </div>
    ` : '';

    // ATUALIZAÇÃO 2: Lógica para o título e cabeçalho do e-mail
    const submissionDate = new Date(formData.dataPreenchimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    let subjectLine = `Novo Cadastro de Fiador recebido em ${submissionDate}`;
    let mainHeaderText = `<p>Recebido em <strong>${submissionDate}</strong>.</p>`;

    if (formData.locatarioPrincipal && formData.locatarioPrincipal !== 'Não identificado') {
      subjectLine = `Novo Cadastro de Fiador para ${formData.locatarioPrincipal}`;
      mainHeaderText = `<p>Fiador de <strong>${formData.locatarioPrincipal}</strong>.</p>`;
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; line-height: 1.6; color: #3a3a3a; background-color: #f7f7f7; margin: 0; padding: 0; }
          .email-wrapper { padding: 20px; }
          .email-container { max-width: 700px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
          .header { background-color: #0A225C; padding: 25px; text-align: center; }
          .header img { max-width: 180px; }
          .content { padding: 20px 30px 30px; }
          h1 { color: #0A225C; font-size: 24px; margin: 0 0 10px; }
          h2 { color: #0A225C; font-size: 20px; border-bottom: 2px solid #f2f2f2; padding-bottom: 10px; margin-top: 30px; margin-bottom: 20px; }
          p { margin: 0 0 10px; }
          .data-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px 24px; }
          .data-grid .full-width { grid-column: 1 / -1; }
          .data-item strong { display: block; font-size: 13px; color: #555; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
          .data-item span { font-size: 16px; color: #1a1a1a; }
          .file-list { list-style-type: none; padding-left: 0; }
          .file-list li { margin-bottom: 8px; }
          .file-list a { color: #1a73e8; text-decoration: none; font-weight: 500; }
          .file-list a:hover { text-decoration: underline; }
          .footer { margin-top: 30px; padding: 20px; font-size: 12px; color: #888; text-align: center; background-color: #f7f7f7; }
          @media (max-width: 600px) {
            .data-grid { grid-template-columns: 1fr; }
            .content { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <div class="header">
              <img src="${logoUrl}" alt="Imobiliza Imóveis Logo">
            </div>
            <div class="content">
              <h1>Cadastro de Fiador Recebido</h1>
              ${mainHeaderText}
              
              <h2>Dados Pessoais do Fiador</h2>
              <div class="data-grid">
                ${dataItem('Nome Completo', formData.nomeCompleto)}
                ${dataItem('CPF', formData.cpf)}
                ${dataItem('RG', formData.rg)}
                ${dataItem('Profissão', formData.profissao)}
                ${dataItem('Estado Civil', formData.estadoCivil)}
                ${dataItem('Nacionalidade', formData.nacionalidade === 'Outra' ? formData.nacionalidadeOutra : formData.nacionalidade)}
              </div>

              <h2>Endereço Residencial do Fiador</h2>
              <div class="data-grid">
                ${dataItem('Rua', formData.rua)}
                ${dataItem('Número', formData.numero)}
                ${dataItem('Bairro', formData.bairro)}
                ${dataItem('Cidade', formData.cidade)}
                ${dataItem('CEP', formData.cep)}
                ${dataItem('Estado', formData.estado)}
                ${dataItem('Complemento', formData.complemento, true)}
              </div>

              <h2>Contato do Fiador</h2>
              <div class="data-grid">
                ${dataItem('Telefone Principal', formData.telefone)}
                ${dataItem('E-mail', formData.email)}
              </div>

              ${conjugeSection}
              
              <h2>Detalhes Adicionais do Fiador</h2>
              <div class="data-grid">
                ${dataItem('Renda Mensal (média)', formData.rendaMensal)}
                ${dataItem('Referência Pessoal 01', `${formData.referenciaPessoal01Nome} - ${formData.referenciaPessoal01Telefone}`)}
                ${dataItem('Referência Pessoal 02', `${formData.referenciaPessoal02Nome} - ${formData.referenciaPessoal02Telefone}`)}
                ${dataItem('Cartório com Firma Aberta', formData.cartorioFirma, true)}
              </div>

              <h2>Documentos Anexados</h2>
              ${createFileList('Documentos Pessoais', files.documentosPessoais)}
              ${createFileList('Comprovantes de Renda', files.comprovanteRenda)}
              ${createFileList('Documentos do Cônjuge', files.documentosConjuge)}

            </div>
            <div class="footer">
              <p>Este é um e-mail automático enviado pelo sistema do site Imobiliza Imóveis.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await resend.emails.send({
      from: `Imobiliza Imóveis <${fromEmail}>`,
      to: adminEmail,
      subject: subjectLine, // Usa a linha de assunto dinâmica
      html: emailHtml,
    });

    return NextResponse.json({ message: 'Notificação enviada com sucesso!' });

  } catch (error) {
    console.error('Erro na API de notificação do fiador:', error);
    return NextResponse.json({ error: 'Falha ao enviar notificação, mas os dados foram salvos.' }, { status: 200 });
  }
}