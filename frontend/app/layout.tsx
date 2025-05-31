import React from 'react';
import './globals.css';
import { Inter, Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import HeaderFooterWrapper from '@/components/layout/HeaderFooterWrapper';

// フォント設定
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const notoSans = Noto_Sans_JP({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

const notoSerif = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-serif-jp',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSans.variable} ${notoSerif.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <HeaderFooterWrapper>
            {children}
          </HeaderFooterWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
