import type { Metadata } from 'next';
import './globals.css';
import WhatsAppButton from '../components/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Imobiliza Imóveis',
  description: 'A gestão de aluguel que valoriza seu patrimônio e seu tempo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Adiciona a folha de estilos do Boxicons */}
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}