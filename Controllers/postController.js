// const Post = require('../Models/post');

// // إنشاء منشور جديد
// exports.createPost = async (req, res) => {
//     console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

//     const { content, community } = req.body;
//     const { userId } = req.user;

//     try {
//         const newPost = new Post({
//             content,
//             community,
//             user: userId,
//         });

//         await newPost.save();

//         res.status(201).json({
//             message: 'Post created successfully',
//             post: newPost,
//         });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // الحصول على جميع المنشورات
// exports.getAllPosts = async (req, res) => {
//     console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

//     try {
//         const posts = await Post.find().populate({

//             populate: [
//                 { path: 'user', select: 'username avatar' },
//                 { path: 'song' },
//             ],
//         });;
//         res.status(200).json(posts);
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // الحصول على منشور حسب ID
// exports.getPostById = async (req, res) => {
//     const { postId } = req.params;

//     try {
//         const post = await Post.findById(postId).populate('user', 'name');
//         if (!post) {
//             return res.status(404).json({ message: 'Post not found' });
//         }

//         res.status(200).json(post);
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // // // تحديث منشور
// // // exports.updatePost = async (req, res) => {
// // //     console.log("bodyyyyyyyyy:", req.body);  // طباعة البيانات للتأكد من وصولها

// // //     const { postId } = req.params;
// // //     const { title, content } = req.body;

// // //     try {
// // //         const post = await Post.findById(postId);
// // //         if (!post) {
// // //             return res.status(404).json({ message: 'Post not found' });
// // //         }

// // //         post.title = title || post.title;
// // //         post.content = content || post.content;

// // //         await post.save();

// // //         res.status(200).json({
// // //             message: 'Post updated successfully',
// // //             post,
// // //         });
// // //     } catch (err) {
// // //         res.status(500).json({ message: 'Server error' });
// // //     }
// // };

const Post = require('../Models/post');
const User = require('../Models/user');

// 1. إضافة بوست جديد
const createPost = async (req, res) => {
  const { community, content, songId, episodeId } = req.body;
  const user = req.userId; // هذا يفترض أنك ستقوم بالتحقق من هوية اليوزر باستخدام middleware مثل JWT

  try {
    const newPost = new Post({
      community,
      user,
      content,
      song: songId || null,  // إذا كانت الأغنية موجودة
      episode: episodeIdId || null,  // إذا كان البودكاست موجود
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post' });
  }
};

// 2. عرض بوستات كوميونيتي بناءً على اسم الكوميونيتي
const getPostsByCommunity = async (req, res) => {
  const { communityName } = req.params; // هنا بنستخدم اسم الكوميونيتي في الـ route

  try {
    const posts = await Post.find({ community: communityName })
      .populate('user', 'username')  // استرجاع اسم اليوزر
      .populate('song', 'title artist')  // استرجاع تفاصيل الأغنية
      .sort({ createdAt: -1 });  // ترتيب البوستات بناءً على التاريخ (الأحدث أولاً)

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

const getPostsByUserId = async (req, res) => {
    const { userId } = req.params;  // الحصول على الـ userId من URL
  
    try {
      const posts = await Post.find({ user: userId })  // العثور على البوستات المرتبطة بالـ userId
        .populate('community', 'name')  // استرجاع اسم الكوميونيتي
        .populate('song', 'title artist')  // استرجاع تفاصيل الأغنية
        .populate('podcast', 'title host img')  // استرجاع تفاصيل البودكاست
        .sort({ createdAt: -1 });  // ترتيب البوستات بناءً على التاريخ (الأحدث أولاً)
  
      if (posts.length === 0) {
        return res.status(404).json({ message: 'No posts found for this user' });
      }
  
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching posts by user', error: err.message });
    }
  };
  

// 3. إضافة لايك للبوست
const likePost = async (req, res) => {
  const { postId } = req.params;
  const user = req.userId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // إذا كان اليوزر قد أضاف لايك مسبقاً، قم بإزالته
    if (post.likes.includes(user)) {
      return res.status(400).json({ message: 'You already liked this post' });
    }

    // إضافة لايك للبوست
    post.likes.push(user);
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error liking post' });
  }
};

// 4. إزالة لايك من البوست
const unlikePost = async (req, res) => {
  const { postId } = req.params;
  const user = req.userId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // إذا لم يكن اليوزر قد أضاف لايك مسبقاً
    if (!post.likes.includes(user)) {
      return res.status(400).json({ message: 'You haven\'t liked this post yet' });
    }

    // إزالة لايك من البوست
    post.likes = post.likes.filter(like => like.toString() !== user.toString());
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error unliking post' });
  }
};

module.exports = {
  createPost,
  getPostsByCommunity,
  likePost,
  unlikePost,
  
};
