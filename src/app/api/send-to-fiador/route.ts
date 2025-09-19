import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { locatarioNome, emailFiador } = await request.json();

    const fromEmail = process.env.FROM_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!process.env.RESEND_API_KEY) {
        console.error('Chave da API do Resend não encontrada nas variáveis de ambiente.');
        return NextResponse.json({ error: 'Configuração do servidor incompleta.' }, { status: 500 });
    }
     if (!fromEmail || !adminEmail) {
      console.error('FROM_EMAIL ou ADMIN_EMAIL não encontrados nas variáveis de ambiente.');
      return NextResponse.json({ error: 'Configuração de e-mail do servidor incompleta.' }, { status: 500 });
    }
    if (!emailFiador || !locatarioNome) {
      return NextResponse.json({ error: 'Dados insuficientes: Nome do locatário e e-mail do fiador são obrigatórios.' }, { status: 400 });
    }
    
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const logoUrl = `${baseUrl}/logo-imobiliza.png`;
    const formUrl = `${baseUrl}/fiador?locatario=${encodeURIComponent(locatarioNome)}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #3a3a3a; background-color: #f7f7f7; margin: 0; padding: 0; }
          .email-wrapper { padding: 20px; }
          .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
          .header { background-color: #0A225C; padding: 25px; text-align: center; }
          .header img { max-width: 180px; }
          .content { padding: 30px; text-align: center; }
          h1 { color: #0A225C; font-size: 22px; margin-top: 0; }
          p { margin-bottom: 25px; font-size: 16px; color: #555; }
          .cta-button { display: inline-block; background-color: #0A225C; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; }
          .footer { margin-top: 30px; padding: 20px; font-size: 12px; color: #888; text-align: center; }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <div class="header">
              <img src="${logoUrl}" alt="Imobiliza Imóveis Logo">
            </div>
            <div class="content">
              <h1>Indicação como Fiador</h1>
              <p>Olá!<br>Você foi indicado(a) como fiador por <strong>${locatarioNome}</strong> em uma proposta de locação com a Imobiliza Imóveis.</p>
              <p>Para dar continuidade ao processo, por favor, preencha a sua ficha cadastral clicando no botão abaixo:</p>
              <a href="${formUrl}" target="_blank" class="cta-button">Preencher Ficha de Fiador</a>
            </div>
            <div class="footer">
              <p>Caso não reconheça esta indicação, por favor, desconsidere este e-mail.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: `Imobiliza Imóveis <${fromEmail}>`,
      to: emailFiador,
      replyTo: adminEmail,
      subject: `${locatarioNome} indicou você como fiador`,
      html: emailHtml,
    });

    if (error) {
        console.error('Erro retornado pelo Resend:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'E-mail para o fiador enviado com sucesso!', data });

  // A LINHA ABAIXO FOI CORRIGIDA
  } catch (error: unknown) {
    console.error('Erro na API send-to-fiador:', error);
    // Verificamos se o erro é um objeto do tipo Error antes de acessar a propriedade 'message'
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Ocorreu um erro inesperado no servidor.' }, { status: 500 });
  }
}