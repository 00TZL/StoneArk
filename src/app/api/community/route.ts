import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'community-posts.json');

// 确保数据目录存在
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// GET - 获取所有帖子
export async function GET() {
  try {
    ensureDataDirectory();

    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ posts: [] });
    }

    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const posts = JSON.parse(data);

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error reading posts:', error);
    return NextResponse.json({ posts: [] });
  }
}

// POST - 创建新帖子
export async function POST(request: Request) {
  try {
    ensureDataDirectory();

    const newPost = await request.json();

    let posts = [];
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      posts = JSON.parse(data);
    }

    posts.unshift(newPost);

    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

// PUT - 更新帖子（点赞等）
export async function PUT(request: Request) {
  try {
    ensureDataDirectory();

    const { id, likes, replies } = await request.json();

    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json(
        { error: 'No posts found' },
        { status: 404 }
      );
    }

    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    let posts = JSON.parse(data);

    posts = posts.map((post: any) =>
      post.id === id
        ? { ...post, likes: likes ?? post.likes, replies: replies ?? post.replies }
        : post
    );

    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}
