'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  
  return (
    <AuthLayout
      title="ログイン"
      description="アカウントにログインして、日本の魅力を共有しましょう"
    >
      {registered && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 w-full max-w-md">
          登録が完了しました。ログインしてください。
        </div>
      )}
      
      <LoginForm />
    </AuthLayout>
  );
} 