'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  
  // フォームの状態
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    is_japanese: false,
    native_language: 'japanese', // デフォルト値
    japanese_level: 'none', // デフォルト値
    english_level: 'none', // デフォルト値
  });
  
  // UI状態
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 入力変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // チェックボックスの場合
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!formData.username || !formData.email || !formData.password) {
      setError('すべての必須項目を入力してください');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // リクエストボディを作成
      const requestBody = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        is_japanese: formData.is_japanese,
        native_language: formData.native_language,
        japanese_level: formData.japanese_level,
        english_level: formData.english_level,
      };
      
      // デバッグ用にリクエストボディを出力
      console.log('送信データ:', requestBody);
      console.log('password_confirm の値:', formData.confirmPassword);
      console.log('password_confirm の型:', typeof formData.confirmPassword);
      
      // 登録APIを呼び出す
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      
      // デバッグ用にレスポンスを出力
      console.log('レスポンス:', data);
      
      if (!response.ok) {
        throw new Error(data.error || '登録に失敗しました');
      }
      
      // 成功時の処理
      if (onSuccess) {
        onSuccess();
      } else {
        // ログインページにリダイレクト
        router.push('/auth/login?registered=true');
      }
    } catch (err) {
      console.error('登録エラー:', err);
      setError(err instanceof Error ? err.message : '登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center">アカウント登録</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* ユーザー名 */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            ユーザー名 <span className="text-red-500">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="ユーザー名"
            required
          />
        </div>
        
        {/* メールアドレス */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="example@mail.com"
            required
          />
        </div>
        
        {/* パスワード */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            パスワード <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="パスワード（8文字以上）"
            minLength={8}
            required
          />
        </div>
        
        {/* パスワード確認 */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            パスワード（確認用） <span className="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="パスワード（確認用）"
            minLength={8}
            required
          />
        </div>
        
        {/* 日本人かどうか */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_japanese"
              checked={formData.is_japanese}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-gray-700 text-sm">日本人です</span>
          </label>
        </div>
        
        {/* 母国語 */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="native_language">
            母国語
          </label>
          <select
            id="native_language"
            name="native_language"
            value={formData.native_language}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="japanese">日本語</option>
            <option value="english">英語</option>
            <option value="chinese">中国語</option>
            <option value="korean">韓国語</option>
            <option value="french">フランス語</option>
            <option value="german">ドイツ語</option>
            <option value="spanish">スペイン語</option>
            <option value="other">その他</option>
          </select>
        </div>
        
        {/* 日本語レベル */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="japanese_level">
            日本語レベル
          </label>
          <select
            id="japanese_level"
            name="japanese_level"
            value={formData.japanese_level}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="none">学習経験なし</option>
            <option value="beginner">少しわかる（初心者レベル）</option>
            <option value="daily">日常会話レベル</option>
            <option value="business">ビジネスレベル</option>
            <option value="native">ネイティブレベル</option>
          </select>
        </div>
        
        {/* 英語レベル */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="english_level">
            英語レベル
          </label>
          <select
            id="english_level"
            name="english_level"
            value={formData.english_level}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="none">学習経験なし</option>
            <option value="beginner">少しわかる（初心者レベル）</option>
            <option value="daily">日常会話レベル</option>
            <option value="business">ビジネスレベル</option>
            <option value="native">ネイティブレベル</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <button
            type="submit"
            disabled={isLoading}
            className="jp-button-primary w-full"
          >
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </div>
        
        <div className="text-center text-sm">
          <p className="text-gray-600">
            すでにアカウントをお持ちの場合は
            <Link href="/auth/login" className="text-blue-500 hover:text-blue-700 ml-1">
              ログイン
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm; 