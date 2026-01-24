const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(process.cwd(), 'data', 'community-posts.json');
const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
const MIN_LIKES_TO_PRESERVE = 10; // 保留点赞数超过10的帖子

function cleanupOldPosts() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      console.log('No community posts file found. Nothing to clean up.');
      return;
    }

    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    let posts = JSON.parse(data);

    const now = Date.now();
    const initialCount = posts.length;

    // 过滤掉超过3个月的帖子，但保留精选帖子和高点赞帖子
    posts = posts.filter((post) => {
      const postDate = new Date(post.timestamp).getTime();
      const age = now - postDate;

      // 保留精选帖子
      if (post.featured) {
        return true;
      }

      // 保留高点赞帖子
      if ((post.likes || 0) >= MIN_LIKES_TO_PRESERVE) {
        return true;
      }

      // 删除超过3个月的普通帖子
      return age < THREE_MONTHS_MS;
    });

    const deletedCount = initialCount - posts.length;

    if (deletedCount > 0) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
      console.log(`Cleanup completed: ${deletedCount} posts deleted, ${posts.length} posts remaining.`);
    } else {
      console.log('No posts to clean up.');
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupOldPosts();
