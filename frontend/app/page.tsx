import React from 'react';
import Hero from '@/components/shared/Hero';
import SectionTitle from '@/components/shared/SectionTitle';
import PhotoGrid from '@/components/photos/PhotoGrid';
import WordGrid from '@/components/words/WordGrid';
import ExperienceGrid from '@/components/experiences/ExperienceGrid';

// モックデータ（実際にはAPIから取得する）
const mockPhotos = [
  {
    id: 1,
    title: '富士山の夜明け',
    imageUrl: '/images/placeholder-image.svg',
    author: '山田太郎',
    location: '山梨県',
    likes: 120
  },
  {
    id: 2,
    title: '京都の紅葉',
    imageUrl: '/images/placeholder-image.svg',
    author: '佐藤花子',
    location: '京都府',
    likes: 98
  },
  {
    id: 3,
    title: '東京の夜景',
    imageUrl: '/images/placeholder-image.svg',
    author: '鈴木一郎',
    location: '東京都',
    likes: 145
  }
];

const mockWords = [
  {
    id: 1,
    original: '侘び寂び',
    furigana: 'わびさび',
    translation: 'Wabi-Sabi',
    description: '質素で簡素な美しさと、年月を経て生まれる風情を重んじる日本の美的概念。',
    author: '田中教授',
    likes: 78
  },
  {
    id: 2,
    original: '木漏れ日',
    furigana: 'こもれび',
    translation: 'Sunlight filtering through trees',
    description: '樹木の葉の間から漏れる太陽の光。自然の美しさを表す言葉。',
    author: '山本翻訳家',
    likes: 65
  },
  {
    id: 3,
    original: '一期一会',
    furigana: 'いちごいちえ',
    translation: 'Once-in-a-lifetime encounter',
    description: '人との出会いを大切にし、それが二度とないものとして接するという茶道の精神。',
    author: '小林茶道家',
    likes: 92
  }
];

const mockExperiences = [
  {
    id: 1,
    title: '茶道体験',
    imageUrl: '/images/placeholder-image.svg',
    location: '京都市',
    description: '伝統的な茶室で本格的な茶道を体験できます。お茶の立て方から和菓子の楽しみ方まで。',
    price: '¥5,000〜',
    author: '茶道家 高橋',
    likes: 56
  },
  {
    id: 2,
    title: '寿司作り教室',
    imageUrl: '/images/placeholder-image.svg',
    location: '東京都築地',
    description: 'プロの寿司職人から寿司の握り方を学べる体験。自分で作った寿司をその場で味わえます。',
    price: '¥8,000〜',
    author: '寿司職人 大山',
    likes: 89
  },
  {
    id: 3,
    title: '着物レンタル・散策',
    imageUrl: '/images/placeholder-image.svg',
    location: '浅草',
    description: '着物を着て浅草の街を散策できます。記念撮影スポットもご案内します。',
    price: '¥4,500〜',
    author: '和装専門家 中村',
    likes: 112
  }
];

export default function Home() {
  return (
    <>
      <Hero />
      
      <div className="container mx-auto px-4 md:px-8 py-12">
        <SectionTitle
          title="日本の魅力を写真で"
          subtitle="全国から集まった美しい風景や文化を写真でお楽しみください"
        />
        <PhotoGrid photos={mockPhotos} className="mb-16" />
        
        <SectionTitle
          title="日本の言葉"
          subtitle="他の言語では表現しきれない日本独自の言葉をご紹介します"
        />
        <WordGrid words={mockWords} className="mb-16" />
        
        <SectionTitle
          title="文化体験"
          subtitle="日本の伝統文化や日常を体験できるアクティビティ"
        />
        <ExperienceGrid experiences={mockExperiences} className="mb-16" />
        
        <div className="bg-indigo-50 p-6 rounded-md text-center mb-12">
          <h3 className="font-serif text-xl font-bold mb-3">This is Japan コミュニティに参加しませんか？</h3>
          <p className="text-gray-700 mb-4">写真の投稿、言葉の共有、体験の紹介、他のユーザーとの交流ができます。</p>
          <div className="flex justify-center">
            <a href="/auth" className="jp-button jp-button-primary">ログイン・新規登録</a>
          </div>
        </div>
      </div>
    </>
  );
}
