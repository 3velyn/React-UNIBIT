import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaThumbsUp, FaSpinner } from "react-icons/fa";
import { addComment, likeComment, checkCommentLiked } from "../api/post";
import { useAuth } from "../hooks/useAuth";

export default function CommentSection({
  postId,
  comments = [],
  onCommentAdded,
}) {
  const { isAuthenticated } = useAuth();
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentLikes, setCommentLikes] = useState({});

  useEffect(() => {
    async function checkLikedComments() {
      if (isAuthenticated && comments.length > 0) {
        const likesStatus = {};

        for (const comment of comments) {
          try {
            const likeStatus = await checkCommentLiked(postId, comment.id);
            likesStatus[comment.id] = likeStatus.hasLiked;
          } catch (err) {
            console.error(
              `Error checking like status for comment ${comment.id}: `,
              err
            );
          }
        }
        setCommentLikes(likesStatus);
      }
    }
    checkLikedComments();
  }, [postId, comments, isAuthenticated]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setSubmittingComment(true);
    try {
      const response = await addComment(postId, { content: comment });

      if (onCommentAdded) {
        onCommentAdded(response.comment);
      }
      setComment("");
    } catch (err) {
      console.error("Failed to submit comment: ", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated) return;
    if (commentLikes[commentId]) return;

    try {
      const response = await likeComment(postId, commentId);

      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: true,
      }));

      if (onCommentAdded) {
        const updateComment = comments.find((c) => c.id === commentId);

        if (updateComment) {
          onCommentAdded(
            {
              ...updateComment,
              likes: response.likes,
            },
            "like"
          );
        }
      }
    } catch (err) {
      console.error("Failed to like comment: ", err);
      if (err?.message?.includes("already liked")) {
        setCommentLikes((prev) => ({
          ...prev,
          [commentId]: true,
        }));
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-amber-900/30 to-slate-900/70 rounded-lg border-2 border-amber-700 shadow-lg p-6">
      <h2 className="text-2xl font-bold text-amber-300 font-serif tracking-wide mb-6">
        Comments ({comments?.length || 0})
      </h2>

      <div className="space-y-6 mb-8">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-amber-700/30 pb-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-600 mr-3 flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={comment.authorAvatar}
                    alt={comment.author}
                    onError={(e) => {
                      e.target.src =
                        "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-amber-400 font-medium">
                      {comment.author}
                    </p>
                    <p className="text-amber-400/60 text-xs">{comment.date}</p>
                  </div>
                  <p className="text-amber-100/90 text-sm mb-3">
                    {comment.content}
                  </p>
                  <div className="flex items-center text-amber-400/60 text-xs">
                    <button
                      className={`flex items-center transition-colors mr-4 ${
                        commentLikes[comment.id]
                          ? "text-amber-500 cursor-default"
                          : "hover:text-amber-300 cursor-pointer"
                      }`}
                      onClick={() => handleLikeComment(comment.id)}
                      disabled={commentLikes[comment.id] || !isAuthenticated}
                    >
                      <FaThumbsUp
                        className={`mr-1 ${
                          commentLikes[comment.id] ? "text-amber-500" : ""
                        }`}
                      />
                      {comment.likes}{" "}
                      {commentLikes[comment.id] ? "liked" : "likes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-amber-200/70">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleCommentSubmit}>
          <h3 className="text-lg font-bold text-amber-300 mb-3">
            Add Your Comment
          </h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-3 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px] mb-4"
            required
            disabled={submittingComment}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-b from-amber-700 to-amber-900 text-amber-200 rounded border border-amber-600 hover:from-amber-600 hover:to-amber-800 hover:text-white cursor-pointer transition-all duration-300 font-medium uppercase text-sm tracking-wide flex items-center disabled:opacity-70"
            disabled={submittingComment}
          >
            {submittingComment ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </button>
        </form>
      ) : (
        <div className="bg-amber-900/20 border border-amber-700/50 rounded-md p-4 text-center">
          <FaUser className="mx-auto text-amber-400 mb-2 text-xl" />
          <h3 className="text-lg font-bold text-amber-300 mb-2">
            Join the conversation!
          </h3>
          <p className="text-amber-100/70 text-sm mb-4">
            Sign in or create an account to share your thoughts on this article.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-gradient-to-b from-slate-700 to-slate-900 text-amber-200 rounded border border-amber-600 hover:from-slate-600 hover:to-slate-800 transition-all duration-300 font-medium uppercase text-sm tracking-wide"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-gradient-to-b from-amber-700 to-amber-900 text-amber-200 rounded border border-amber-600 hover:from-amber-600 hover:to-amber-800 hover:text-white transition-all duration-300 font-medium uppercase text-sm tracking-wide"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
