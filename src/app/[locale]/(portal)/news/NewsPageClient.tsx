'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LocaleLink from '@/components/navigation/LocaleLink';
import EconomicCalendarSection from '@/components/custom/EconomicCalendarSection';

interface NewsItem {
  slug: string;
  title: string;
  date: string;
  description: string;
  source: string;
  category: string;
  keywords: string[];
}

interface NewsPageClientProps {
  initialNews: NewsItem[];
}

export default function NewsPageClient({ initialNews }: NewsPageClientProps) {
  const { language } = useLanguage();
  const isZh = language === 'zh';

  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // 获取所有月份
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    initialNews.forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    return Array.from(months).sort().reverse();
  }, [initialNews]);

  // 获取所有tags
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    initialNews.forEach(item => {
      item.keywords?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [initialNews]);

  // 设置默认月份为当前月份
  useEffect(() => {
    if (availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth]);

  // 筛选新闻
  const filteredNews = useMemo(() => {
    return initialNews.filter(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      const monthMatch = !selectedMonth || selectedMonth === 'all' || monthKey === selectedMonth;
      const tagMatch = selectedTag === 'all' || item.keywords?.includes(selectedTag);

      return monthMatch && tagMatch;
    });
  }, [initialNews, selectedMonth, selectedTag]);

  // 最近10条新闻用于侧边栏
  const recentNews = useMemo(() => {
    return initialNews.slice(0, 10);
  }, [initialNews]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white border-b-2 border-gray-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-block px-6 py-2 bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
            <span className="text-sm font-semibold tracking-wider">
              {isZh ? '实时财经资讯' : 'Real-Time Financial News'}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="font-black">
              {isZh ? '财经日历 & 外汇新闻' : 'Economic Calendar & Forex News'}
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {isZh
              ? '实时经济事件追踪 · 每日更新全球外汇市场最新动态'
              : 'Real-Time Economic Events · Daily Global Forex Market Updates'}
          </p>
        </div>
      </div>

      {/* Economic Calendar Section */}
      <EconomicCalendarSection language={language} />

      {/* News Section Header */}
      <div className="bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800 pt-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {isZh ? '外汇新闻' : 'Forex News'}
          </h2>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Month Filter */}
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {isZh ? '按月份筛选' : 'Filter by Month'}
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-black dark:focus:border-white"
              >
                <option value="all">{isZh ? '所有月份' : 'All Months'}</option>
                {availableMonths.map(month => {
                  const [year, monthNum] = month.split('-');
                  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                  const monthName = date.toLocaleDateString(isZh ? 'zh-CN' : 'en-US', {
                    year: 'numeric',
                    month: 'long'
                  });
                  return (
                    <option key={month} value={month}>
                      {monthName}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Tag Filter */}
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {isZh ? '按标签筛选' : 'Filter by Tag'}
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-black dark:focus:border-white"
              >
                <option value="all">{isZh ? '所有标签' : 'All Tags'}</option>
                {availableTags.map(tag => (
                  <option key={tag} value={tag}>
                    #{tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {isZh ? '找到' : 'Found'} <span className="font-bold text-gray-900 dark:text-white">{filteredNews.length}</span> {isZh ? '篇文章' : 'articles'}
          </div>
        </div>
      </div>

      {/* News List with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredNews.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {isZh ? '没有找到符合条件的新闻' : 'No news found matching the filters'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main News List */}
            <div className="flex-1 min-w-0">
              <div className="grid gap-6">
                {filteredNews.map((item) => (
                  <div
                    key={item.slug}
                    className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 p-6 hover:border-black dark:hover:border-white transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-3 flex-wrap">
                      <span className="px-3 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold">
                        {item.source}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.date).toLocaleString(isZh ? 'zh-CN' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <LocaleLink href={`/news/${item.slug}`}>
                      <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white hover:underline">
                        {item.title}
                      </h2>
                    </LocaleLink>

                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {item.description}
                    </p>

                    {/* Tags */}
                    {item.keywords && item.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.keywords.slice(0, 4).map(tag => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <LocaleLink
                        href={`/news/${item.slug}`}
                        className="text-sm font-bold hover:underline text-gray-900 dark:text-white"
                      >
                        {isZh ? '阅读原文' : 'Read More'} →
                      </LocaleLink>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar - Recent News (10 items) */}
            <aside className="lg:w-80 shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Archive Links */}
                <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-800">
                    {isZh ? '归档' : 'Archives'}
                  </h3>
                  <div className="space-y-3">
                    <LocaleLink
                      href="/news/archive"
                      className="block px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      📅 {isZh ? '按月份归档' : 'By Month'}
                    </LocaleLink>
                    <LocaleLink
                      href="/news/tags"
                      className="block px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      🏷️ {isZh ? '按标签归档' : 'By Tags'}
                    </LocaleLink>
                  </div>
                </div>

                {/* Recent News */}
                <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-800">
                    {isZh ? '最新新闻' : 'Recent News'}
                  </h3>
                  <ul className="space-y-3">
                    {recentNews.map((item) => (
                      <li key={item.slug}>
                        <LocaleLink
                          href={`/news/${item.slug}`}
                          className="block group"
                        >
                          <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 mb-1">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(item.date).toLocaleDateString(isZh ? 'zh-CN' : 'en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </LocaleLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
