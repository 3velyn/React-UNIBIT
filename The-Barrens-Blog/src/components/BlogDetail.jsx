import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaClock,
  FaTag,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getPostById } from "../api/post";
import barrensBackground from "../assets/Barrens_CGI.webp";
import CommentSection from "./CommentSection";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPostData() {
      setLoading(true);
      try {
        const response = await getPostById(id);
        setPost(response.post);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError(
          "Failed to lоаd post. This post may not exist or there was a server error."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchPostData();
  }, [id]);

  const handleCommentAdded = (newComment, action = "add") => {
    if (action === "add") {
      setPost((prevPost) => ({
        ...prevPost,
        comments: [newComment, ...prevPost.comments],
      }));
    } else if (action === "like") {
      setPost((prevPost) => ({
        ...prevPost,
        comments: prevPost.comments.map((c) =>
          c.id === newComment.id ? { ...c, likes: newComment.likes } : c
        ),
      }));
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-900/90 flex items-center justify-center">
        <div
          className="inset-0 bg-cover bg-center opacity-30 z-0 fixed"
          style={{ backgroundImage: `url(${barrensBackground})` }}
        ></div>
        <div className="relative z-10 text-center">
          <FaSpinner className="animate-spin text-amber-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-300">Loading post...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-slate-900/90 flex items-center justify-center">
        <div
          className="inset-0 bg-cover bg-center opacity-30 z-0 fixed"
          style={{ backgroundImage: `url(${barrensBackground})` }}
        ></div>
        <div className="relative z-10 text-center max-w-md bg-red-900/30 border-2 border-red-800 rounded-lg p-6">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-300 mb-4">
            Error Loading Post
          </h2>
          <p className="text-amber-100 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-gradient-to-b from-amber-700 to-amber-900 text-amber-200 rounded border border-amber-600 hover:from-amber-600 hover:to-amber-800 transition-all duration-300"
            >
              Return to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-to-b from-slate-700 to-slate-900 text-amber-200 rounded border border-slate-600 hover:from-slate-600 hover:to-slate-800 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="relative min-h-screen bg-slate-900/90">
      <div
        className="inset-0 bg-cover bg-center opacity-30 z-0 fixed"
        style={{
          backgroundImage: `url(${barrensBackground})`,
        }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="h-64 sm:h-96 rounded-lg overflow-hidden mb-8 border-2 border-amber-700 shadow-lg">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-gradient-to-b from-amber-900/30 to-slate-900/70 rounded-lg border-2 border-amber-700 shadow-lg p-6 mb-8">
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 bg-amber-800 text-amber-200 text-xs uppercase tracking-wide rounded-sm border border-amber-600">
              <FaTag className="mr-1" />
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-amber-300 font-serif tracking-wide mb-4">
            {post.title}
          </h1>

          <div className="flex items-center mb-6 pb-6 border-b border-amber-700/30">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-600 mr-4">
              <img
                className="w-full h-full object-cover"
                src={post.authorAvatar}
                alt={post.author}
              />
            </div>
            <div>
              <p className="text-amber-400 font-medium">{post.author}</p>
              <p className="text-amber-400/60 text-sm flex items-center">
                {post.date} •
                <FaClock className="mx-1" />
                {post.readTime} read
              </p>
            </div>
          </div>

          <div
            className="prose prose-invert prose-amber prose-headings:text-amber-300 prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>

          <div className="border-t border-amber-700/30 pt-6 mt-8">
            <h3 className="text-lg font-bold text-amber-300 mb-2">
              About the Author
            </h3>
            <div className="flex items-start">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-600 mr-4 flex-shrink-0">
                <img
                  className="w-full h-full object-cover"
                  src={post.authorAvatar}
                  alt={post.author}
                />
              </div>
              <div>
                <p className="text-amber-400 font-medium mb-1">{post.author}</p>
                <p className="text-amber-100/70 text-sm">{post.authorBio}</p>
              </div>
            </div>
          </div>
        </div>

        <CommentSection
          postId={id}
          comments={post.comments || []}
          onCommentAdded={handleCommentAdded}
        />
      </div>
    </div>
  );
}
