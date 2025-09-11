import type { Metadata } from 'next';
import './globals.css';
import './animations.css'; // Importa as animações
import WhatsAppButton from '../components/WhatsAppButton';
import { Toaster } from 'sonner'; // NOVO: Importa o Toaster

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
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <WhatsAppButton />
        {/* NOVO: Adiciona o componente Toaster aqui */}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
