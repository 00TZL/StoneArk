"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FloatingContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const { language } = useLanguage();
  const isZh = language === 'zh';

  const emailAddress = "bigbossa.tzl@gmail.com";
  const siteUrl = "https://fxkiller.com";

  const handleSubmit = (e: React.FormEvent) => {
    // Form will be submitted by FormSubmit.co
    // No need to prevent default
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-6 bottom-20 z-40 bg-black dark:bg-white text-white dark:text-black p-3 border-2 border-black dark:border-white shadow-2xl hover:scale-110 transition-transform rounded-full"
          aria-label={isZh ? '联系我们' : 'Contact Us'}
          title={isZh ? '快速联系我们' : 'Quick Contact'}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </button>
      )}

      {/* Floating Form */}
      {isOpen && (
        <div className="fixed right-6 bottom-20 z-40 w-80 max-w-[calc(100vw-3rem)]">
          <div className="bg-white dark:bg-slate-900 border-2 border-blue-900 dark:border-blue-700 shadow-2xl rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="bg-blue-900 dark:bg-blue-800 text-white px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-lg font-bold">
                {isZh ? '快速联系' : 'Quick Contact'}
              </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:scale-110 transition-transform text-white hover:text-blue-200"
                  aria-label={isZh ? '关闭' : 'Close'}
                >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form
              action={`https://formsubmit.co/${emailAddress}`}
              method="POST"
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >
              {/* Hidden Fields */}
              <input
                type="hidden"
                name="_next"
                value={`${siteUrl}/${language}/thank-you`}
              />
              <input
                type="hidden"
                name="_subject"
                value="职业交易员沟通"
              />
              <input type="hidden" name="_captcha" value="false" />

              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold mb-2 text-black dark:text-white"
                >
                  {isZh ? '姓名 *' : 'Name *'}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:border-black dark:focus:border-white outline-none transition-colors rounded-lg"
                  placeholder={isZh ? '请输入您的姓名' : 'Enter your name'}
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold mb-2 text-black dark:text-white"
                >
                  {isZh ? '邮箱 *' : 'Email *'}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:border-black dark:focus:border-white outline-none transition-colors rounded-lg"
                  placeholder={isZh ? '请输入您的邮箱' : 'Enter your email'}
                />
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-bold mb-2 text-black dark:text-white"
                >
                  {isZh ? '电话' : 'Phone'}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:border-black dark:focus:border-white outline-none transition-colors rounded-lg"
                  placeholder={isZh ? '请输入您的电话（可选）' : 'Enter your phone (optional)'}
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-bold mb-2 text-black dark:text-white"
                >
                  {isZh ? '留言' : 'Message'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white focus:border-black dark:focus:border-white outline-none transition-colors resize-none rounded-lg"
                  placeholder={isZh ? '请告诉我们您的需求...' : 'Tell us your needs...'}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-900 dark:bg-blue-800 text-white font-bold border-2 border-blue-900 dark:border-blue-800 hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors rounded-lg"
              >
                {isZh ? '快联系我' : 'Contact Me'}
              </button>

              {/* Privacy Note */}
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                {isZh
                  ? '我们重视您的隐私，不会分享您的信息。'
                  : 'We value your privacy and will not share your information.'}
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
