'use client';

import { useState, useMemo } from 'react';
import { Calendar, TrendingUp, AlertCircle, Clock } from 'lucide-react';

interface EconomicEvent {
  time: string;
  currency: string;
  event: string;
  importance: 'high' | 'medium' | 'low';
  forecast?: string;
  previous?: string;
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

  // Mock data - in production, this would come from an API
  const mockEvents: EconomicEvent[] = [
    {
      time: '08:30',
      currency: 'USD',
      event: isZh ? '非农就业人数' : 'Non-Farm Payrolls',
      importance: 'high',
      forecast: '180K',
      previous: '175K'
    },
    {
      time: '10:00',
      currency: 'EUR',
      event: isZh ? '欧元区GDP' : 'Eurozone GDP',
      importance: 'high',
      forecast: '0.3%',
      previous: '0.2%'
    },
    {
      time: '14:00',
      currency: 'GBP',
      event: isZh ? '英国央行利率决议' : 'BOE Interest Rate Decision',
      importance: 'high',
      forecast: '5.25%',
      previous: '5.25%'
    }
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'];

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      const importanceMatch = selectedImportance === 'all' || event.importance === selectedImportance;
      const currencyMatch = selectedCurrency === 'all' || event.currency === selectedCurrency;
      return importanceMatch && currencyMatch;
    });
  }, [mockEvents, selectedImportance, selectedCurrency]);

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
    <div className=\"bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800\">\n      <div className=\"max-w-7xl mx-auto px-6 py-12\">\n        {/* Section Header */}\n        <div className=\"mb-8\">\n          <div className=\"flex items-center gap-3 mb-4\">\n            <Calendar className=\"w-8 h-8 text-gray-900 dark:text-white\" />\n            <h2 className=\"text-3xl font-bold text-gray-900 dark:text-white\">\n              {isZh ? '经济日历' : 'Economic Calendar'}\n            </h2>\n          </div>\n          <p className=\"text-gray-600 dark:text-gray-400\">\n            {isZh\n              ? '实时追踪全球重要经济事件，把握市场动向'\n              : 'Track important global economic events in real-time'}\n          </p>\n        </div>\n\n        {/* Filters */}\n        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-8\">\n          {/* Date Selector */}\n          <div>\n            <label className=\"block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2\">\n              {isZh ? '日期' : 'Date'}\n            </label>\n            <input\n              type=\"date\"\n              value={selectedDate}\n              onChange={(e) => setSelectedDate(e.target.value)}\n              className=\"w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-black dark:focus:border-white\"\n            />\n          </div>\n\n          {/* Importance Filter */}\n          <div>\n            <label className=\"block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2\">\n              {isZh ? '重要性' : 'Importance'}\n            </label>\n            <select\n              value={selectedImportance}\n              onChange={(e) => setSelectedImportance(e.target.value)}\n              className=\"w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-black dark:focus:border-white\"\n            >\n              <option value=\"all\">{isZh ? '全部' : 'All'}</option>\n              <option value=\"high\">{isZh ? '高' : 'High'}</option>\n              <option value=\"medium\">{isZh ? '中' : 'Medium'}</option>\n              <option value=\"low\">{isZh ? '低' : 'Low'}</option>\n            </select>\n          </div>\n\n          {/* Currency Filter */}\n          <div>\n            <label className=\"block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2\">\n              {isZh ? '货币' : 'Currency'}\n            </label>\n            <select\n              value={selectedCurrency}\n              onChange={(e) => setSelectedCurrency(e.target.value)}\n              className=\"w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold focus:outline-none focus:border-black dark:focus:border-white\"\n            >\n              <option value=\"all\">{isZh ? '全部货币' : 'All Currencies'}</option>\n              {currencies.map(currency => (\n                <option key={currency} value={currency}>{currency}</option>\n              ))}\n            </select>\n          </div>\n        </div>\n\n        {/* Events List */}\n        <div className=\"space-y-4\">\n          {filteredEvents.length === 0 ? (\n            <div className=\"text-center py-12 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700\">\n              <AlertCircle className=\"w-12 h-12 mx-auto mb-3 text-gray-400\" />\n              <p className=\"text-gray-600 dark:text-gray-400\">\n                {isZh ? '当前筛选条件下没有事件' : 'No events match the current filters'}\n              </p>\n            </div>\n          ) : (\n            filteredEvents.map((event, index) => (\n              <div\n                key={index}\n                className=\"bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-4 hover:border-black dark:hover:border-white transition-colors\"\n              >\n                <div className=\"flex flex-col md:flex-row md:items-center gap-4\">\n                  {/* Time */}\n                  <div className=\"flex items-center gap-2 md:w-24 shrink-0\">\n                    <Clock className=\"w-4 h-4 text-gray-600 dark:text-gray-400\" />\n                    <span className=\"font-bold text-gray-900 dark:text-white\">\n                      {event.time}\n                    </span>\n                  </div>\n\n                  {/* Currency */}\n                  <div className=\"md:w-16 shrink-0\">\n                    <span className=\"px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold\">\n                      {event.currency}\n                    </span>\n                  </div>\n\n                  {/* Importance */}\n                  <div className=\"md:w-20 shrink-0\">\n                    <div className=\"flex items-center gap-2\">\n                      <div className={`w-3 h-3 rounded-full ${getImportanceColor(event.importance)}`}></div>\n                      <span className=\"text-sm font-semibold text-gray-700 dark:text-gray-300\">\n                        {getImportanceText(event.importance)}\n                      </span>\n                    </div>\n                  </div>\n\n                  {/* Event Name */}\n                  <div className=\"flex-1 min-w-0\">\n                    <h3 className=\"font-bold text-gray-900 dark:text-white\">\n                      {event.event}\n                    </h3>\n                  </div>\n\n                  {/* Forecast & Previous */}\n                  <div className=\"flex gap-6 md:w-48 shrink-0\">\n                    {event.forecast && (\n                      <div>\n                        <div className=\"text-xs text-gray-500 dark:text-gray-400 mb-1\">\n                          {isZh ? '预测' : 'Forecast'}\n                        </div>\n                        <div className=\"font-bold text-gray-900 dark:text-white\">\n                          {event.forecast}\n                        </div>\n                      </div>\n                    )}\n                    {event.previous && (\n                      <div>\n                        <div className=\"text-xs text-gray-500 dark:text-gray-400 mb-1\">\n                          {isZh ? '前值' : 'Previous'}\n                        </div>\n                        <div className=\"font-bold text-gray-600 dark:text-gray-400\">\n                          {event.previous}\n                        </div>\n                      </div>\n                    )}\n                  </div>\n                </div>\n              </div>\n            ))\n          )}\n        </div>\n\n        {/* Info Note */}\n        <div className=\"mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800\">\n          <p className=\"text-sm text-blue-900 dark:text-blue-300\">\n            <strong>{isZh ? '提示：' : 'Note: '}</strong>\n            {isZh\n              ? '所有时间均为北京时间（UTC+8）。高重要性事件可能对市场产生重大影响。'\n              : 'All times are in Beijing Time (UTC+8). High importance events may have significant market impact.'}\n          </p>\n        </div>\n      </div>\n    </div>\n  );
}
