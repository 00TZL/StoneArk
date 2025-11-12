import { EducationPageContent } from './forex-basics.content';

export const trendFollowingContent = {
  zh: {
    title: '趋势跟踪完整指南 - Trend Following策略与EMA均线系统 | StoneArk',
    description: '深入讲解趋势跟踪（Trend Following）：趋势识别方法、EMA均线系统、趋势强度判断、加仓策略。掌握专业趋势跟踪交易的完整系统。',
    keywords: '趋势跟踪, Trend Following, EMA均线, 趋势交易, 趋势识别, 加仓策略, 趋势强度, 移动平均线',

    heroTitle: '趋势跟踪完整指南',
    heroDescription: '掌握趋势跟踪策略，顺势而为持续盈利',
    readingTime: '25分钟',
    difficulty: '初级-中级',
    lastUpdated: '2024-01-15',

    tocTitle: '本文目录',
    tableOfContents: [
      { id: 'what-is-trend-following', title: '什么是趋势跟踪？' },
      { id: 'trend-identification', title: '趋势识别核心方法' },
      { id: 'ema-system', title: 'EMA均线系统应用' },
      { id: 'case-studies', title: '实战案例分析' },
      { id: 'common-mistakes', title: '常见错误与规避' },
      { id: 'pyramiding-strategy', title: '加仓策略要点' },
      { id: 'faq', title: '常见问题解答' },
    ],

    faqTitle: '常见问题解答',
    faqs: [
      {
        question: 'Q1: 趋势跟踪和波段交易有什么区别？',
        answer: '趋势跟踪是一种交易理念，波段交易是一种时间框架分类。趋势跟踪强调"顺势而为"，只做趋势方向的交易，可应用于任何时间框架（日内、波段、长线）。波段交易指持仓2-10天的交易方式，既可以顺势也可以逆势。趋势跟踪者通常使用波段或长线时间框架（H4/D1/W1），但核心是识别趋势、跟随趋势、让利润奔跑。'
      },
      {
        question: 'Q2: 如何判断趋势的强度？',
        answer: '可用多个指标综合判断：1) ADX指标：>25为趋势市，>40为强趋势；2) 移动平均线角度：角度陡峭且价格持续在MA上方/下方；3) 连续K线数量：连续5根以上同色K线；4) 新高新低频率：频繁刷新新高（上升）或新低（下降）；5) 回调幅度：回调不超过前一波段的38.2%（斐波那契）；6) 价格与EMA距离：距离越远趋势越强，但过度延伸需警惕反转。'
      },
      {
        question: 'Q3: 趋势跟踪的最佳入场时机是什么？',
        answer: '有三个经典入场点：1) 趋势初期突破（风险最大但收益最高）：价格突破关键阻力/支撑，趋势刚启动；2) 回调入场（最安全）：趋势确立后，等待价格回调至20/50EMA或前高/低支撑；3) 突破加速（追涨杀跌）：趋势中期，价格突破盘整区间加速运行。建议新手使用回调入场，风险回报比最优，心理压力小。'
      },
      {
        question: 'Q4: 趋势跟踪如何设置止损？',
        answer: '止损应设置在"趋势失效"的位置，而非固定点数。常用方法：1) EMA下方/上方：价格跌破20/50EMA表示短期趋势改变；2) 前低/高下方：价格跌破前一个摆动低点（上升趋势）；3) 趋势线下方：价格跌破上升趋势线；4) ATR动态止损：入场点 - 2倍ATR。随着价格朝盈利方向运行，逐步移动止损（追踪止损），锁定利润并保护趋势延续空间。'
      },
      {
        question: 'Q5: 趋势跟踪胜率低怎么办？',
        answer: '趋势跟踪的胜率通常只有35-45%，这是正常的！因为市场70%时间在震荡，只有30%时间在趋势。但趋势跟踪的优势在于"截断亏损，让利润奔跑"，单笔盈利远大于亏损（盈亏比可达3:1甚至5:1）。应对方法：1) 接受低胜率，关注总体盈亏比；2) 严格止损，控制单笔亏损在2%以内；3) 让利润奔跑，使用追踪止损而非固定止盈；4) 耐心等待大趋势，不要频繁交易。记住：一年只需抓住2-3次大趋势就能实现可观收益。'
      }
    ],

    relatedTitle: '相关学习资源',
    relatedResources: [
      {
        href: '/education/swing-trading',
        icon: '📈',
        title: '波段交易',
        description: '学习中期持仓交易方法'
      },
      {
        href: '/education/breakout-trading',
        icon: '⚡',
        title: '突破交易',
        description: '掌握趋势启动的入场时机'
      },
      {
        href: '/tools/position-calculator',
        icon: '🧮',
        title: '仓位计算器',
        description: '计算趋势交易的仓位大小'
      }
    ],

    ctaTitle: '想要系统学习趋势交易？',
    ctaDescription: '加入 StoneArk 培训计划，获取专业趋势跟踪策略和趋势分析工具',
    ctaPrimaryButton: '了解培训计划',
    ctaSecondaryButton: '免费心理测评',

    footerPrevText: '< 剥头皮交易',
    footerNextText: '突破交易 >',
    footerPrevHref: '/education/scalping',
    footerNextHref: '/education/breakout-trading',
  } as EducationPageContent,

  en: {
    title: 'Complete Trend Following Guide - Strategies and EMA Moving Average System | StoneArk',
    description: 'In-depth explanation of Trend Following: trend identification methods, EMA system, trend strength judgment, pyramiding strategies. Master professional trend following complete system.',
    keywords: 'trend following, EMA, trend trading, trend identification, pyramiding strategy, trend strength, moving averages',

    heroTitle: 'Complete Trend Following Guide',
    heroDescription: 'Master trend following strategies for consistent profits with the trend',
    readingTime: '25 min',
    difficulty: 'Beginner-Intermediate',
    lastUpdated: 'Jan 15, 2024',

    tocTitle: 'Table of Contents',
    tableOfContents: [
      { id: 'what-is-trend-following', title: 'What is Trend Following?' },
      { id: 'trend-identification', title: 'Core Trend Identification Methods' },
      { id: 'ema-system', title: 'EMA System Application' },
      { id: 'case-studies', title: 'Real-World Case Studies' },
      { id: 'common-mistakes', title: 'Common Mistakes and Solutions' },
      { id: 'pyramiding-strategy', title: 'Pyramiding Strategy Essentials' },
      { id: 'faq', title: 'Frequently Asked Questions' },
    ],

    faqTitle: 'Frequently Asked Questions',
    faqs: [
      {
        question: 'Q1: What are the differences between trend following and swing trading?',
        answer: 'Trend following is a trading philosophy, swing trading is a timeframe classification. Trend following emphasizes "trading with trend", only trades in trend direction, applicable to any timeframe (intraday, swing, long-term). Swing trading means holding 2-10 days, can be with or against trend. Trend followers typically use swing or long-term timeframes (H4/D1/W1), but core is identifying trend, following trend, letting profits run.'
      },
      {
        question: 'Q2: How to judge trend strength?',
        answer: 'Use multiple indicators comprehensively: 1) ADX indicator: >25 trending market, >40 strong trend; 2) Moving average angle: steep angle with price consistently above/below MA; 3) Consecutive candle count: 5+ same-color candles in row; 4) New high/low frequency: frequently making new highs (up) or lows (down); 5) Pullback magnitude: pullback not exceeding 38.2% of previous swing (Fibonacci); 6) Price distance from EMA: further distance = stronger trend, but excessive extension warns of reversal.'
      },
      {
        question: 'Q3: What are the best trend following entry timings?',
        answer: 'Three classic entry points: 1) Early trend breakout (highest risk but highest reward): price breaks key resistance/support, trend just starting; 2) Pullback entry (safest): after trend established, wait for price pullback to 20/50EMA or previous high/low support; 3) Breakout acceleration (momentum): mid-trend, price breaks consolidation range and accelerates. Recommend beginners use pullback entry, optimal risk-reward, less psychological pressure.'
      },
      {
        question: 'Q4: How to set stops in trend following?',
        answer: 'Stops should be set at "trend invalidation" position, not fixed pips. Common methods: 1) Below/above EMA: price breaking 20/50EMA indicates short-term trend change; 2) Below previous low/high: price breaking previous swing low (uptrend); 3) Below trendline: price breaking ascending trendline; 4) ATR dynamic stop: entry - 2x ATR. As price moves in profit direction, gradually move stop (trailing stop), lock profits while protecting trend continuation space.'
      },
      {
        question: 'Q5: What to do about low trend following win rate?',
        answer: 'Trend following win rate typically only 35-45%, this is normal! Because market ranges 70% of time, only trends 30%. But trend following advantage is "cut losses short, let profits run", single profit far exceeds loss (reward-risk can reach 3:1 or 5:1). Solutions: 1) Accept low win rate, focus on overall reward-risk; 2) Strict stops, control single loss within 2%; 3) Let profits run, use trailing stops not fixed targets; 4) Patiently wait for major trends, don\'t trade frequently. Remember: catching 2-3 major trends per year can achieve substantial returns.'
      }
    ],

    relatedTitle: 'Related Learning Resources',
    relatedResources: [
      {
        href: '/education/swing-trading',
        icon: '📈',
        title: 'Swing Trading',
        description: 'Learn medium-term position trading methods'
      },
      {
        href: '/education/breakout-trading',
        icon: '⚡',
        title: 'Breakout Trading',
        description: 'Master entry timing at trend initiation'
      },
      {
        href: '/tools/position-calculator',
        icon: '🧮',
        title: 'Position Calculator',
        description: 'Calculate position size for trend trading'
      }
    ],

    ctaTitle: 'Want to Systematically Learn Trend Trading?',
    ctaDescription: 'Join StoneArk training for professional trend following strategies and trend analysis tools',
    ctaPrimaryButton: 'Learn About Training',
    ctaSecondaryButton: 'Free Psychology Test',

    footerPrevText: '< Scalping',
    footerNextText: 'Breakout Trading >',
    footerPrevHref: '/education/scalping',
    footerNextHref: '/education/breakout-trading',
  } as EducationPageContent,
};
