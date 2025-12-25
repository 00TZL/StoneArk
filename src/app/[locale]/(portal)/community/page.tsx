"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'motion/react';

interface Post {
  id: number;
  author: string;
  avatar: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  replies: number;
}

export default function CommunityPage() {
  const { language } = useLanguage();
  const isZh = language === 'zh';

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [username, setUsername] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // 加载帖子
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/community');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !username.trim()) return;

    const post: Post = {
      id: Date.now(),
      author: username,
      avatar: '🆕',
      content: newPost,
      image: imagePreview || undefined,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: 0,
    };

    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        setPosts([post, ...posts]);
        setNewPost('');
        setUsername('');
        setImageFile(null);
        setImagePreview('');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const newLikes = post.likes + 1;

    try {
      await fetch('/api/community', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: postId,
          likes: newLikes,
        }),
      });

      setPosts(posts.map(p =>
        p.id === postId ? { ...p, likes: newLikes } : p
      ));
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);

    if (isZh) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    } else {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleString('en-US', options);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {isZh ? '交易社区' : 'Trading Community'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isZh ? '分享你的交易心得、提问、讨论' : 'Share your trading insights, ask questions, and discuss'}
          </p>
        </motion.div>

        {/* New Post Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {isZh ? '发表内容' : 'Create Post'}
          </h2>
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder={isZh ? '你的昵称' : 'Your username'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
                required
              />
            </div>
            <div>
              <textarea
                placeholder={isZh ? '分享你的想法、经验或问题...' : 'Share your thoughts, experiences, or questions...'}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isZh ? '上传图片（可选）' : 'Upload Image (Optional)'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors"
              />
              {imagePreview && (
                <div className="mt-3 relative">
                  <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {isZh ? '发布' : 'Post'}
            </button>
          </form>
        </motion.div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{post.avatar}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {post.author}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatTimestamp(post.timestamp)}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">
                {post.content}
              </p>

              {/* Post Image */}
              {post.image && (
                <div className="mb-4">
                  <img src={post.image} alt="Post image" className="max-w-full rounded-lg" />
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span className="font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-medium">{post.replies}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {isZh ? '还没有帖子，成为第一个发帖的人吧！' : 'No posts yet. Be the first to post!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
