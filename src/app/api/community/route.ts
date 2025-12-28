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
    console.log('POST /api/community - Starting');
    ensureDataDirectory();
    console.log('Data directory ensured');

    const newPost = await request.json();
    console.log('Received post data:', {
      id: newPost.id,
      author: newPost.author,
      hasImage: !!newPost.image,
      imageLength: newPost.image?.length
    });

    let posts = [];
    if (fs.existsSync(DATA_FILE)) {
      console.log('Reading existing posts file');
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      posts = JSON.parse(data);
      console.log('Existing posts count:', posts.length);
    } else {
      console.log('No existing posts file');
    }

    posts.unshift(newPost);
    console.log('Added new post, total posts:', posts.length);

    console.log('Writing to file:', DATA_FILE);
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
    console.log('File written successfully');

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error('Error creating post:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Failed to create post', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - 更新帖子（点赞等）
export async function PUT(request: Request) {
  try {
    ensureDataDirectory();

    const { id, likes, replies, comments } = await request.json();

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
        ? {
            ...post,
            likes: likes ?? post.likes,
            replies: replies ?? post.replies,
            comments: comments ?? post.comments
          }
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
