"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { blogPosts } from '@/data/blogPosts';
import { motion } from 'motion/react';

export default function CommunityContent() {
  const router = useRouter();
  const { language } = useLanguage();
  const isZh = language === 'zh';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category)))];
  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);
  const sortedBlogPosts = [...filteredPosts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getCategoryName = (cat: string) => {
    const names: Record<string, {zh: string, en: string}> = {
      all: {zh: '全部', en: 'All'},
      about: {zh: '关于我们', en: 'About'},
      forex: {zh: '外汇交易', en: 'Forex'},
      gold: {zh: '黄金交易', en: 'Gold'},
      crypto: {zh: '数字货币', en: 'Crypto'},
      psychology: {zh: '交易心理', en: 'Psychology'},
      professional: {zh: '职业交易员', en: 'Professional'},
      wisdom: {zh: '交易智慧', en: 'Wisdom'}
    };
    return names[cat]?.[language] || cat;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {isZh ? '社区' : 'Community'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isZh ? '阅读专业文章' : 'Professional articles'}
          </p>
        </motion.div>

        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-semibold border-2 whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white'
                }`}
              >
                {getCategoryName(category)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBlogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => router.push(`/${language}/splan/blog/${post.slug}`)}
              className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-all cursor-pointer group"
            >
              {post.featured && (
                <div className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-xs font-bold inline-block">
                  {isZh ? '精选' : 'Featured'}
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    {getCategoryName(post.category)}
                  </span>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {post.readTime} {isZh ? '分钟' : 'min'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:underline">
                  {post.title[language]}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt[language]}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <span>{post.author}</span>
                  <span>{new Date(post.date).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {sortedBlogPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {isZh ? '没有找到文章' : 'No articles found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
