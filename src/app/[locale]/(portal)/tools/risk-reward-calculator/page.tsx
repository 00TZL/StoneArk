"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function RiskRewardCalculatorPage() {
  const { language } = useLanguage();
  const isZh = language === 'zh';

  // Input states
  const [entryPrice, setEntryPrice] = useState<string>('1.0850');
  const [stopLoss, setStopLoss] = useState<string>('1.0800');
  const [takeProfit, setTakeProfit] = useState<string>('1.0950');
  const [accountBalance, setAccountBalance] = useState<string>('10000');
  const [riskPercentage, setRiskPercentage] = useState<string>('2');
  const [lotSize, setLotSize] = useState<string>('1.0');
  const [currencyPair, setCurrencyPair] = useState<string>('EURUSD');

  // Calculate results
  const calculateResults = () => {
    const entry = parseFloat(entryPrice) || 0;
    const sl = parseFloat(stopLoss) || 0;
    const tp = parseFloat(takeProfit) || 0;
    const balance = parseFloat(accountBalance) || 0;
    const risk = parseFloat(riskPercentage) || 0;
    const lots = parseFloat(lotSize) || 0;

    if (entry <= 0 || sl <= 0 || tp <= 0 || balance <= 0 || risk <= 0 || lots <= 0) {
      return {
        stopLossPips: 0,
        takeProfitPips: 0,
        riskRewardRatio: 0,
        riskAmount: 0,
        potentialProfit: 0,
        pipValue: 0,
        tradeValid: false,
      };
    }

    // Determine if long or short
    const isLong = tp > entry;
    const pipSize = currencyPair.includes('JPY') ? 0.01 : 0.0001;

    // Calculate pips
    const stopLossPips = Math.abs(entry - sl) / pipSize;
    const takeProfitPips = Math.abs(tp - entry) / pipSize;

    // Calculate risk/reward ratio
    const riskRewardRatio = takeProfitPips / stopLossPips;

    // Calculate monetary amounts
    const riskAmount = balance * (risk / 100);
    const pipValue = riskAmount / stopLossPips;
    const potentialProfit = pipValue * takeProfitPips;

    // Validate trade direction
    const tradeValid = isLong ? (sl < entry && tp > entry) : (sl > entry && tp < entry);

    return {
      stopLossPips: Math.round(stopLossPips * 10) / 10,
      takeProfitPips: Math.round(takeProfitPips * 10) / 10,
      riskRewardRatio: Math.round(riskRewardRatio * 100) / 100,
      riskAmount: Math.round(riskAmount * 100) / 100,
      potentialProfit: Math.round(potentialProfit * 100) / 100,
      pipValue: Math.round(pipValue * 100) / 100,
      tradeValid,
      isLong,
    };
  };

  const results = calculateResults();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
            {isZh ? '风险回报计算器' : 'Risk/Reward Calculator'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {isZh
              ? '精确计算交易的风险回报比、止损止盈点数，优化交易决策'
              : 'Calculate risk/reward ratio, stop loss and take profit pips to optimize trading decisions'}
          </p>
        </div>

        {/* Trade Direction Warning */}
        {!results.tradeValid && parseFloat(entryPrice) > 0 && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 p-4 text-center">
            <p className="text-red-600 dark:text-red-400 font-bold">
              {isZh
                ? '⚠️ 警告：止损/止盈位置设置错误！请检查交易方向。'
                : '⚠️ Warning: Invalid SL/TP placement! Please check trade direction.'}
            </p>
          </div>
        )}

        {/* Main Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 p-8 border-2 border-black dark:border-white">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6 pb-3 border-b-2 border-black dark:border-white">
              {isZh ? '交易参数' : 'Trade Parameters'}
            </h2>

            <div className="space-y-6">
              {/* Currency Pair */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  {isZh ? '货币对' : 'Currency Pair'}
                </label>
                <select
                  value={currencyPair}
                  onChange={(e) => setCurrencyPair(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-black dark:focus:border-white outline-none"
                >
                  <option value="EURUSD">EUR/USD</option>
                  <option value="GBPUSD">GBP/USD</option>
                  <option value="AUDUSD">AUD/USD</option>
                  <option value="NZDUSD">NZD/USD</option>
                  <option value="USDJPY">USD/JPY</option>
                  <option value="USDCHF">USD/CHF</option>
                  <option value="USDCAD">USD/CAD</option>
                </select>
              </div>

              {/* Entry Price */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  {isZh ? '入场价格' : 'Entry Price'}
                </label>
                <input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-black dark:focus:border-white outline-none"
                  placeholder="1.0850"
                  step="0.0001"
                />
              </div>

              {/* Stop Loss */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  {isZh ? '止损价格' : 'Stop Loss Price'}
                </label>
                <input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-red-300 dark:border-red-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-red-500 dark:focus:border-red-500 outline-none"
                  placeholder="1.0800"
                  step="0.0001"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {isZh ? '红色边框表示止损' : 'Red border indicates stop loss'}
                </p>
              </div>

              {/* Take Profit */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  {isZh ? '止盈价格' : 'Take Profit Price'}
                </label>
                <input
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-green-300 dark:border-green-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-green-500 dark:focus:border-green-500 outline-none"
                  placeholder="1.0950"
                  step="0.0001"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {isZh ? '绿色边框表示止盈' : 'Green border indicates take profit'}
                </p>
              </div>

              {/* Account Balance */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  {isZh ? '账户余额 ($)' : 'Account Balance ($)'}
                </label>
                <input
                  type="number"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-black dark:focus:border-white outline-none"
                  placeholder="10000"
                />
              </div>

              {/* Risk Percentage */}
              <div>
                <label className="block text-sm font-bold text-black dark:text-white mb-2">
                  {isZh ? '风险百分比 (%)' : 'Risk Percentage (%)'}
                </label>
                <input
                  type="number"
                  value={riskPercentage}
                  onChange={(e) => setRiskPercentage(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white focus:border-black dark:focus:border-white outline-none"
                  placeholder="2"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-black dark:bg-white p-8 border-2 border-black dark:border-white">
            <h2 className="text-2xl font-bold text-white dark:text-black mb-6 pb-3 border-b-2 border-white dark:border-black">
              {isZh ? '计算结果' : 'Results'}
            </h2>

            <div className="space-y-6">
              {/* Trade Direction */}
              {results.tradeValid && (
                <div className="bg-white dark:bg-gray-900 p-4 border-2 border-white dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {isZh ? '交易方向' : 'Trade Direction'}
                  </p>
                  <p className="text-3xl font-bold text-black dark:text-white">
                    {results.isLong ? (isZh ? '做多 ↑' : 'LONG ↑') : (isZh ? '做空 ↓' : 'SHORT ↓')}
                  </p>
                </div>
              )}

              {/* Risk/Reward Ratio */}
              <div className={`bg-white dark:bg-gray-900 p-4 border-2 ${
                results.riskRewardRatio >= 2
                  ? 'border-green-500 dark:border-green-500'
                  : results.riskRewardRatio >= 1.5
                  ? 'border-yellow-500 dark:border-yellow-500'
                  : 'border-red-500 dark:border-red-500'
              }`}>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isZh ? '盈亏比' : 'Risk/Reward Ratio'}
                </p>
                <p className={`text-4xl font-bold ${
                  results.riskRewardRatio >= 2
                    ? 'text-green-600 dark:text-green-500'
                    : results.riskRewardRatio >= 1.5
                    ? 'text-yellow-600 dark:text-yellow-500'
                    : 'text-red-600 dark:text-red-500'
                }`}>
                  1:{results.riskRewardRatio.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {results.riskRewardRatio >= 2
                    ? (isZh ? '✓ 优秀的风险回报比' : '✓ Excellent ratio')
                    : results.riskRewardRatio >= 1.5
                    ? (isZh ? '⚠ 可接受的风险回报比' : '⚠ Acceptable ratio')
                    : (isZh ? '✗ 风险回报比过低' : '✗ Poor ratio')
                  }
                </p>
              </div>

              {/* Stop Loss Pips */}
              <div className="bg-white dark:bg-gray-900 p-4 border-2 border-red-500 dark:border-red-500">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isZh ? '止损点数' : 'Stop Loss (Pips)'}
                </p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-500">
                  {results.stopLossPips.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {isZh ? '风险控制' : 'Risk control'}
                </p>
              </div>

              {/* Take Profit Pips */}
              <div className="bg-white dark:bg-gray-900 p-4 border-2 border-green-500 dark:border-green-500">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isZh ? '止盈点数' : 'Take Profit (Pips)'}
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-500">
                  {results.takeProfitPips.toFixed(1)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {isZh ? '盈利目标' : 'Profit target'}
                </p>
              </div>

              {/* Risk Amount */}
              <div className="bg-white dark:bg-gray-900 p-4 border-2 border-white dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isZh ? '风险金额' : 'Risk Amount'}
                </p>
                <p className="text-3xl font-bold text-black dark:text-white">
                  ${results.riskAmount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {riskPercentage}% {isZh ? '的账户余额' : 'of account balance'}
                </p>
              </div>

              {/* Potential Profit */}
              <div className="bg-white dark:bg-gray-900 p-4 border-2 border-white dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isZh ? '潜在盈利' : 'Potential Profit'}
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-500">
                  ${results.potentialProfit.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {isZh ? '达到止盈时' : 'If TP is hit'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-gray-50 dark:bg-gray-800 p-8 border-2 border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 pb-3 border-b-2 border-black dark:border-white">
            {isZh ? '风险回报比指南' : 'Risk/Reward Ratio Guidelines'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 border-2 border-green-500">
              <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-3">
                {isZh ? '✓ 优秀 (≥ 1:2)' : '✓ Excellent (≥ 1:2)'}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {isZh
                  ? '即使胜率只有40%，长期仍能盈利。这是专业交易员的标准。'
                  : 'Even with 40% win rate, you profit long-term. Professional trader standard.'}
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 border-2 border-yellow-500">
              <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-400 mb-3">
                {isZh ? '⚠ 可接受 (1:1.5 - 1:2)' : '⚠ Acceptable (1:1.5 - 1:2)'}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {isZh
                  ? '需要50%以上胜率才能盈利。适合高胜率策略。'
                  : 'Requires 50%+ win rate for profitability. Suitable for high-accuracy strategies.'}
              </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 border-2 border-red-500">
              <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-3">
                {isZh ? '✗ 不建议 (< 1:1.5)' : '✗ Not Recommended (< 1:1.5)'}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {isZh
                  ? '需要60%以上胜率，难以长期盈利。建议重新规划交易。'
                  : 'Requires 60%+ win rate. Difficult to profit long-term. Reconsider trade.'}
              </p>
            </div>
          </div>
        </div>

        {/* Other Tools */}
        <div className="bg-white dark:bg-gray-800 p-8 border-2 border-black dark:border-white">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6 pb-3 border-b-2 border-black dark:border-white">
            {isZh ? '其他工具' : 'Other Tools'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/tools/position-calculator"
              className="p-6 border-2 border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors"
            >
              <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                {isZh ? '仓位计算器' : 'Position Size Calculator'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isZh ? '计算推荐的交易手数和保证金需求' : 'Calculate recommended lot size and margin requirement'}
              </p>
            </Link>

            <Link
              href="/tools/pip-calculator"
              className="p-6 border-2 border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors"
            >
              <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                {isZh ? '点值计算器' : 'Pip Value Calculator'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isZh ? '计算每点价值和货币换算' : 'Calculate pip value and currency conversion'}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
