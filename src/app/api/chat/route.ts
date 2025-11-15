import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages, language } = await request.json();

    const systemMessage = language === 'zh'
      ? '你是StoneArk的AI交易助手，专门帮助用户解答外汇交易相关的问题。请用简洁、专业的语言回答问题。如果用户问的问题不在你的知识范围内，请诚实地告诉他们。'
      : 'You are StoneArk\'s AI trading assistant, specialized in helping users with forex trading questions. Please answer in a concise and professional manner. If the question is outside your knowledge scope, please be honest about it.';

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('DeepSeek API request failed');
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || (language === 'zh' ? '抱歉，我现在无法回答。' : 'Sorry, I cannot answer right now.');

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
