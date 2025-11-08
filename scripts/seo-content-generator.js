const Parser = require('rss-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const crypto = require('crypto');

const RSS_SOURCES = [
  'https://www.fxstreet.com/rss/news/latest'
];

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const NEWS_DIR = path.join(__dirname, '../src/content/news');
const HISTORY_FILE = path.join(__dirname, '../.news-history.json');

// 黑名单关键词（推广相关）
const SPAM_KEYWORDS = [
  'sponsored', 'advertisement', 'promoted', 'affiliate',
  'partner content', 'paid promotion', 'sponsored by',
  'click here', 'sign up now', 'register today',
  'limited offer', 'exclusive deal',
  'open account', 'deposit bonus', 'trading bonus',
  'free $100', 'risk-free', 'guaranteed profit',
  '赞助', '广告', '推广', '合作推广', '商业推广',
  '开户', '入金', '赠金', '免费赠送', '保证盈利'
];

// 加载历史记录
function loadHistory() {
  if (fs.existsSync(HISTORY_FILE)) {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  }
  return { hashes: [] };
}

// 保存历史记录
function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
}

// 生成内容哈希
function generateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

// 检查是否重复
function isDuplicate(title, history) {
  const hash = generateHash(title.toLowerCase().trim());
  if (history.hashes.includes(hash)) {
    console.log(`❌ Duplicate detected: "${title}"`);
    return true;
  }
  history.hashes.push(hash);
  // 只保留最近1000条历史
  if (history.hashes.length > 1000) {
    history.hashes = history.hashes.slice(-1000);
  }
  return false;
}

// 检查是否是垃圾内容
function isSpamContent(title, description) {
  const text = (title + ' ' + description).toLowerCase();

  for (const keyword of SPAM_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      console.log(`❌ Filtered spam: "${title}" (含关键词: ${keyword})`);
      return true;
    }
  }

  const linkCount = (text.match(/http/g) || []).length;
  if (linkCount > 3) {
    console.log(`❌ Filtered spam: "${title}" (链接过多: ${linkCount})`);
    return true;
  }

  return false;
}

// 检查内容质量
function isQualityContent(title, description) {
  if (title.length < 20 || description.length < 50) {
    console.log(`❌ Filtered low quality: "${title}" (内容过短)`);
    return false;
  }

  const forexKeywords = [
    'eur', 'usd', 'gbp', 'jpy', 'forex', 'currency',
    'gold', 'silver', 'oil', 'bitcoin', 'crypto',
    '外汇', '货币', '汇率', '黄金', '比特币'
  ];

  const text = (title + ' ' + description).toLowerCase();
  const hasForexKeyword = forexKeywords.some(kw =>
    text.includes(kw.toLowerCase())
  );

  if (!hasForexKeyword) {
    console.log(`❌ Filtered non-forex: "${title}"`);
    return false;
  }

  return true;
}

// 清理内容
function cleanContent(content) {
  content = content.replace(/<[^>]*>/g, '');
  content = content.replace(/https?:\/\/[^\s]+/g, '');
  content = content.replace(/[\w.-]+@[\w.-]+\.\w+/g, '');
  content = content.replace(/\s+/g, ' ').trim();
  return content;
}

// 使用Groq AI改写（中文版本）
async function rewriteWithGroqZh(content) {
  if (!GROQ_API_KEY) {
    return simpleRewriteZh(content);
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'groq/compound',
        messages: [
          {
            role: 'user',
            content: `你是专业的财经记者，请将以下外汇新闻改写成中文文章。

原文：
${content}

要求：
1. 第一行写完整的中文标题（必须是完全中文，不能有任何英文单词）
2. 然后空一行
3. 正文2-3段，每段50-80字，总共200-250字
4. 保留原文的核心数据、价格、百分比等关键信息
5. 用自然流畅的中文表达，不要直接翻译
6. 包含外汇交易相关词汇：货币对、汇率、交易、美元、欧元等
7. 不要加任何标签、说明或额外内容
8. 货币对格式：欧元/美元、美元/日元、黄金/美元等

立即开始写（第一行就是中文标题）：`
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Groq API错误（中文）:', error.message);
    return simpleRewriteZh(content);
  }
}

// 使用Groq AI改写（英文版本）
async function rewriteWithGroqEn(content) {
  if (!GROQ_API_KEY) {
    return simpleRewriteEn(content);
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'groq/compound',
        messages: [
          {
            role: 'user',
            content: `You are a professional forex journalist. Rewrite the following forex news into a concise article.

Original:
${content}

Requirements:
1. Write 2-3 paragraphs, 50-70 words each, total 150-200 words
2. Keep all key data: prices, percentages, currency pairs, technical levels
3. Use natural, flowing language - don't just translate
4. Include forex keywords: currency pair, exchange rate, trading, USD, EUR, etc.
5. Focus on market movement, causes, and implications
6. No labels, no meta-commentary, no explanations
7. Start immediately with the content (no title needed)

Begin:`
          }
        ],
        temperature: 0.8,
        max_tokens: 400
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Groq API错误（英文）:', error.message);
    return simpleRewriteEn(content);
  }
}

// 简单改写（中文备用）
function simpleRewriteZh(content) {
  const parts = content.split('\n').filter(p => p.trim());
  const englishTitle = parts[0].trim();
  const bodyText = parts.slice(1).join(' ').substring(0, 200);

  // 翻译标题中的常见术语
  let chineseTitle = englishTitle
    .replace(/USD\/JPY/gi, '美元/日元')
    .replace(/EUR\/USD/gi, '欧元/美元')
    .replace(/GBP\/USD/gi, '英镑/美元')
    .replace(/AUD\/USD/gi, '澳元/美元')
    .replace(/USD\/CAD/gi, '美元/加元')
    .replace(/NZD\/USD/gi, '纽元/美元')
    .replace(/USD\/CHF/gi, '美元/瑞郎')
    .replace(/XAU\/USD|Gold/gi, '黄金')
    .replace(/XAG\/USD|Silver/gi, '白银')
    .replace(/Price Forecast/gi, '价格预测')
    .replace(/Technical Analysis/gi, '技术分析')
    .replace(/Market Update/gi, '市场更新')
    .replace(/rebounds?/gi, '反弹')
    .replace(/rises?/gi, '上涨')
    .replace(/falls?/gi, '下跌')
    .replace(/steady/gi, '稳定')
    .replace(/tops?/gi, '突破')
    .replace(/struggles?/gi, '承压')
    .replace(/advances?/gi, '走高')
    .replace(/extends?/gi, '延续')
    .replace(/nears?/gi, '接近')
    .replace(/drops?/gi, '下滑')
    .replace(/gains?/gi, '上涨')
    .replace(/weakens?/gi, '走弱')
    .replace(/strengthens?/gi, '走强');

  // 提取数字和百分比
  const numbers = bodyText.match(/\d+\.?\d*%?/g) || [];
  const numberInfo = numbers.length > 0 ? `，目前报价${numbers[0]}附近` : '';

  return `${chineseTitle}

周五外汇市场显示，该货币对持续波动${numberInfo}。市场交易员密切关注美联储政策动向以及主要经济数据发布，这些因素继续影响市场走势和投资者情绪。

技术分析显示，该货币对当前处于关键位置，上方阻力和下方支撑均需重点关注。交易者建议结合基本面因素，制定合理的交易策略，严格控制风险。

分析师指出，短期内市场波动可能加剧，投资者应保持谨慎态度。建议密切关注重要经济数据和央行官员讲话，这些都可能对汇率走势产生重要影响。`;
}

// 简单改写（英文备用）
function simpleRewriteEn(content) {
  const parts = content.split('\n').filter(p => p.trim());
  const bodyText = parts.slice(1).join(' ').substring(0, 200);

  // 提取数字和百分比
  const numbers = bodyText.match(/\d+\.?\d*%?/g) || [];
  const priceInfo = numbers.length > 0 ? ` trading near ${numbers[0]}` : '';

  return `The currency pair shows continued volatility on Friday${priceInfo}. Market participants are closely monitoring Federal Reserve policy signals and key economic data releases, which continue to influence market sentiment and trading dynamics.

Technical analysis indicates the pair is positioned at a crucial level, with both upside resistance and downside support warranting close attention. Traders recommend combining fundamental factors with technical setups to develop sound trading strategies while maintaining strict risk management.

Analysts note that near-term volatility could intensify, urging investors to exercise caution. Key economic data releases and central bank commentary should be monitored closely, as these factors may significantly impact exchange rate movements in the coming sessions.`;
}

// 生成slug
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

// 主函数
async function generateContent() {
  if (!fs.existsSync(NEWS_DIR)) {
    fs.mkdirSync(NEWS_DIR, { recursive: true });
  }

  const history = loadHistory();
  const parser = new Parser();
  const today = dayjs().format('YYYY-MM-DD');

  let totalGenerated = 0;
  let totalFiltered = 0;

  for (const feedUrl of RSS_SOURCES) {
    try {
      console.log(`\n📡 抓取RSS: ${feedUrl}`);
      const feed = await parser.parseURL(feedUrl);
      const items = feed.items.slice(0, 10);

      for (const item of items) {
        const cleanTitle = cleanContent(item.title);
        const cleanDesc = cleanContent(item.contentSnippet || item.description || '');

        // 重复检测
        if (isDuplicate(cleanTitle, history)) {
          totalFiltered++;
          continue;
        }

        // 过滤垃圾内容
        if (isSpamContent(cleanTitle, cleanDesc)) {
          totalFiltered++;
          continue;
        }

        // 检查质量
        if (!isQualityContent(cleanTitle, cleanDesc)) {
          totalFiltered++;
          continue;
        }

        const slug = slugify(cleanTitle);
        const dirName = `${today}-${slug}`;
        const newsPath = path.join(NEWS_DIR, dirName);

        if (fs.existsSync(newsPath)) {
          console.log(`⏭️  已存在: ${cleanTitle}`);
          continue;
        }

        console.log(`\n🤖 处理: ${cleanTitle}`);

        // 创建目录
        fs.mkdirSync(newsPath, { recursive: true });

        // AI改写中英文版本
        const [contentZh, contentEn] = await Promise.all([
          rewriteWithGroqZh(`${cleanTitle}\n\n${cleanDesc}`),
          rewriteWithGroqEn(`${cleanTitle}\n\n${cleanDesc}`)
        ]);

        // 从中文内容中提取标题（第一行）和正文
        const zhLines = contentZh.split('\n');
        const zhTitle = zhLines[0].trim();
        const zhBody = zhLines.slice(1).filter(line => line.trim()).join('\n\n');

        // 从中文正文中提取前100字作为描述
        const zhDescription = zhBody.replace(/\n/g, ' ').substring(0, 150);

        // 生成中文Markdown
        const markdownZh = `---
title: "${zhTitle.replace(/"/g, '\\"')}"
date: "${dayjs().format('YYYY-MM-DD HH:mm:ss')}"
description: "${zhDescription.replace(/"/g, '\\"')}"
keywords: ["外汇", "交易", "市场分析", "外汇新闻"]
category: "外汇新闻"
source: "FX Killer 分析团队"
language: "zh"
---

${zhBody}

---

**数据来源**: FX Killer 分析团队
**更新时间**: ${dayjs().format('YYYY-MM-DD HH:mm')}

**免责声明**: 本文仅供参考，不构成投资建议。外汇交易存在风险，请谨慎决策。
`;

        // 生成英文Markdown
        const markdownEn = `---
title: "${cleanTitle.replace(/"/g, '\\"')}"
date: "${dayjs().format('YYYY-MM-DD HH:mm:ss')}"
description: "${cleanDesc.substring(0, 150).replace(/"/g, '\\"')}"
keywords: ["forex", "trading", "market analysis", "forex news"]
category: "Forex News"
source: "FX Killer Analysis Team"
language: "en"
---

${contentEn}

---

**Data Source**: FX Killer Analysis Team
**Updated**: ${dayjs().format('YYYY-MM-DD HH:mm')}

**Disclaimer**: This article is for reference only and does not constitute investment advice. Forex trading involves risks; please make decisions carefully.
`;

        // 写入文件
        fs.writeFileSync(path.join(newsPath, 'zh.md'), markdownZh, 'utf8');
        fs.writeFileSync(path.join(newsPath, 'en.md'), markdownEn, 'utf8');

        console.log(`✅ 生成: ${dirName} (中英双语)`);
        totalGenerated++;

        // 控制速度，避免触发限制
        // 每分钟限制：70K token, 30次请求
        // 每篇文章约2次请求（中文+英文），约2K tokens
        // 安全间隔：10秒，确保每分钟最多6次请求，约12K tokens
        await sleep(10000); // 10秒间隔

        // 每次运行最多生成3篇（6个请求，约6K tokens）
        if (totalGenerated >= 3) {
          break;
        }
      }
    } catch (error) {
      console.error(`❌ 处理失败 ${feedUrl}:`, error.message);
    }
  }

  // 保存历史记录
  saveHistory(history);

  console.log(`\n📊 统计:`);
  console.log(`  ✅ 成功生成: ${totalGenerated} 篇 (${totalGenerated * 2} 个文件)`);
  console.log(`  ❌ 过滤掉: ${totalFiltered} 篇`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

generateContent()
  .then(() => console.log('\n✨ 完成！'))
  .catch(error => {
    console.error('\n💥 致命错误:', error);
    process.exit(1);
  });
