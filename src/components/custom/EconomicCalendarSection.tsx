'use client';

import { useState, useMemo, useEffect } from 'react';
import { Calendar, AlertCircle, Clock } from 'lucide-react';

interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  event: string;
  importance: 'high' | 'medium' | 'low';
  forecast?: string | null;
  previous?: string | null;
  date: string;
  country: string;
}

interface EconomicCalendarSectionProps {
  language: 'zh' | 'en';
}

export default function EconomicCalendarSection({ language }: EconomicCalendarSectionProps) {
  const isZh = language === 'zh';
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedImportance, setSelectedImportance] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch economic calendar data
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/economic-calendar');

        if (!response.ok) {
          throw new Error('Failed to fetch calendar data');
        }

        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching economic calendar:', err);
        setError(isZh ? '加载经济日历数据失败' : 'Failed to load economic calendar data');
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [isZh]);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'];

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const dateMatch = event.date === selectedDate;
      const importanceMatch = selectedImportance === 'all' || event.importance === selectedImportance;
      const currencyMatch = selectedCurrency === 'all' || event.currency === selectedCurrency;
      return dateMatch && importanceMatch && currencyMatch;
    });
  }, [events, selectedDate, selectedImportance, selectedCurrency]);

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getImportanceText = (importance: string) => {
    if (!isZh) {
      return importance.charAt(0).toUpperCase() + importance.slice(1);
    }
    switch (importance) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-gray-900 dark:text-white" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isZh ? '经济日历' : 'Economic Calendar'}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {isZh
              ? '实时追踪全球重要经济事件，把握市场动向'
              : 'Track important global economic events in real-time'}
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Date Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              {isZh ? '日期' : 'Date'}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-black dark:focus:border-white"
            />
          </div>

          {/* Importance Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              {isZh ? '重要性' : 'Importance'}
            </label>
            <select
              value={selectedImportance}
              onChange={(e) => setSelectedImportance(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-black dark:focus:border-white"
            >
              <option value="all">{isZh ? '全部' : 'All'}</option>
              <option value="high">{isZh ? '高' : 'High'}</option>
              <option value="medium">{isZh ? '中' : 'Medium'}</option>
              <option value="low">{isZh ? '低' : 'Low'}</option>
            </select>
          </div>

          {/* Currency Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              {isZh ? '货币' : 'Currency'}
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-black dark:focus:border-white"
            >
              <option value="all">{isZh ? '全部货币' : 'All Currencies'}</option>
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-3"></div>
              <p className="text-gray-600 dark:text-gray-400">
                {isZh ? '加载中...' : 'Loading...'}
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                {isZh ? '当前筛选条件下没有事件' : 'No events match the current filters'}
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-4 hover:border-black dark:hover:border-white transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Time */}
                  <div className="flex items-center gap-2 md:w-24 shrink-0">
                    <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="font-bold text-gray-900 dark:text-white">
                      {event.time}
                    </span>
                  </div>

                  {/* Currency */}
                  <div className="md:w-16 shrink-0">
                    <span className="px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold">
                      {event.currency}
                    </span>
                  </div>

                  {/* Importance */}
                  <div className="md:w-20 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getImportanceColor(event.importance)}`}></div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {getImportanceText(event.importance)}
                      </span>
                    </div>
                  </div>

                  {/* Event Name */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {event.event}
                    </h3>
                  </div>

                  {/* Forecast & Previous */}
                  <div className="flex gap-6 md:w-48 shrink-0">
                    {event.forecast && (
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {isZh ? '预测' : 'Forecast'}
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {event.forecast}
                        </div>
                      </div>
                    )}
                    {event.previous && (
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {isZh ? '前值' : 'Previous'}
                        </div>
                        <div className="font-bold text-gray-600 dark:text-gray-400">
                          {event.previous}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <strong>{isZh ? '提示：' : 'Note: '}</strong>
            {isZh
              ? '所有时间均为北京时间（UTC+8）。高重要性事件可能对市场产生重大影响。'
              : 'All times are in Beijing Time (UTC+8). High importance events may have significant market impact.'}
          </p>
        </div>
      </div>
    </div>
  );
}
