import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Petits Divendres · Aforament',
  description: 'Control d\'aforament en temps real per a Petits Divendres',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" suppressHydrationWarning>
      <body className={`${inter.className} min-h-[100dvh] relative`}>
        {/* Background ambient layer for all absolute backings */}
        <div className="fixed inset-0 z-[-2] bg-cover bg-center" style={{ backgroundImage: 'url(/background.png)' }} />
        {children}
      </body>
    </html>
  );
}
