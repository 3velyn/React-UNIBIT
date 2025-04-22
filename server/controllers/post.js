const Post = require("../models/Blog");
const User = require("../models/User");

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const category = req.query.category !== "All" ? req.query.category : null;

    const query = {};
    if (category) {
      query.category = category;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatar");

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      posts: posts.map((post) => ({
        id: post._id,
        title: post.title,
        excerpt: post.excerpt,
        author: post.author.username,
        authorAvatar: post.author.avatar,
        date: post.formattedDate,
        category: post.category,
        image: post.image,
        readTime: post.readTime,
      })),
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching posts",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar bio")
      .populate({
        path: "comments.author",
        select: "username avatar",
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const formattedPost = {
      id: post._id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author.username,
      authorAvatar: post.author.avatar,
      authorBio: post.author.bio || "Author at Barrens Blog",
      date: post.formattedDate,
      category: post.category,
      image: post.image,
      readTime: post.readTime,
      comments: post.comments.map((comment) => ({
        id: comment._id,
        author: comment.author.username,
        authorAvatar: comment.author.avatar,
        date: comment.createdAt.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        content: comment.content,
        likes: comment.likes,
      })),
    };

    res.status(200).json({
      success: true,
      post: formattedPost,
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.createPost = async (req, res) => {
  try {
    req.body.author = req.user.id;

    const post = await Post.create(req.body);

    res.status(201).json({
      success: true,
      post: {
        id: post._id,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        image: post.image,
      },
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      post: {
        id: post._id,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        image: post.image,
      },
    });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = {
      author: req.user.id,
      content,
      likes: 0,
    };

    post.comments.unshift(comment);
    await post.save();

    const updatedPost = await Post.findById(req.params.id).populate({
      path: "comments.author",
      select: "username avatar",
    });

    const newComment = updatedPost.comments[0];

    res.status(201).json({
      success: true,
      comment: {
        id: newComment._id,
        author: newComment.author.username,
        authorAvatar: newComment.author.avatar,
        date: newComment.createdAt.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        content: newComment.content,
        likes: newComment.likes,
      },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding comment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const alreadyLiked = comment.likedBy.some(
      (userId) => userId.toString() === req.user.id
    );

    if (alreadyLiked) {
      return res.status(400).json({
        success: false,
        message: "You have already liked this comment",
        likes: comment.likes,
      });
    }

    comment.likedBy.push(req.user.id);
    comment.likes += 1;
    await post.save();

    res.status(200).json({
      success: true,
      likes: comment.likes,
      hasLiked: true,
    });
  } catch (error) {
    console.error("Like comment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while liking comment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.checkLiked = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const hasLiked = comment.likedBy.some(
      (userId) => userId.toString() === req.user.id.toString()
    );

    res.status(200).json({
      success: true,
      hasLiked,
    });
  } catch (error) {
    console.error("Check liked error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while checking like status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
