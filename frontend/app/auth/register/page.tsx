'use client';

import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="アカウント登録"
      description="新しいアカウントを作成して、日本の魅力を世界と共有しましょう"
    >
      <RegisterForm />
    </AuthLayout>
  );
} 