const User = require('../models/User');
const Post = require('../models/Blog');
const mongoose = require('mongoose');

exports.getUserStats = async (req, res) => {
    try {
        const userId = req.params.userId || req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const userPosts = await Post.find({ author: userId })
            .select('_id title category image createdAt')
            .sort({ createdAt: -1 });

        const postsWithUserComments = await Post.aggregate([
            { $unwind: "$comments" },
            { $match: { "comment.author": new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "title" },
                    category: { $first: "$category" },
                    image: { $first: "$image" },
                    createdAt: { $first: "$createdAt" },
                    commentCount: { $sum: 1 },
                    comments: {
                        $push: {
                            content: "$comments.content",
                            createdAt: "$comments.createdAt"
                        }
                    }
                }
            },
            { $sort: { "comments.createdAt": -1 } }
        ]);

        let totalCommentCount = 0;
        postsWithUserComments.forEach(post => {
            totalCommentCount += post.commentCount;
        });


        const recentPosts = userPosts.slice(0, 5).map(post => ({
            type: 'post',
            description: `You created post "${post.title}"`,
            postId: post._id,
            date: post.createdAt
        }));

        const recentComments = [];
        postsWithUserComments.forEach(post => {
            post.comments.forEach(comment => {
                recentComments.push({
                    type: 'comment',
                    description: `You commented on "${post.title}"`,
                    postId: post._id,
                    date: comment.createdAt
                });
            });
        });

        const recentActivity = [...recentPosts, ...recentComments]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(activity => ({
                ...activity,
                date: new Date(activity.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
            }));

        return res.json({
            success: true,
            stats: {
                postCount: userPosts.length,
                commentCount: totalCommentCount,
                likedPosts: postsWithUserLikes,
                recentActivity: recentActivity
            },
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        console.error('Error fetching user stats:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user statistics',
            error: err.message
        });
    }
}

exports.changeAvatar = async (req, res) => {
    try {
        const userId = req.user._id;
        const { avatar } = req.body;

        if (!avatar) {
            return res.status(400).json({
                success: false,
                message: 'Avatar URL is required'
            });
        }

        const user = await User.findByIdAndUpdate(userId, { avatar }, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.json({
            success: true,
            message: 'Avatar updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Error updating avatar:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update avatar',
            error: error.message
        });
    }
}