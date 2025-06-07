'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

interface HeaderFooterWrapperProps {
  children: React.ReactNode;
}

const HeaderFooterWrapper: React.FC<HeaderFooterWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ハイドレーション完了前は基本レイアウトのみ表示
  if (!mounted) {
    return (
      <>
        <main className="flex-grow">
          {children}
        </main>
      </>
    );
  }

  // ハイドレーション完了後は正常な条件分岐
  const isAuthPage = pathname.startsWith('/auth');

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
};

export default HeaderFooterWrapper; 