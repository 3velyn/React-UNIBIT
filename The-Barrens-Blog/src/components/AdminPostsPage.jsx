import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllPosts, deletePost } from "../api/post";
import { useAuth } from "../hooks/useAuth";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import barrensBackground from "../assets/Barrens_CGI.webp";
import ConfirmModal from "./common/ConfirmModal";
import MessageModal from "./common/MessageModal";

export default function AdminPostPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    postId: null,
    title: "",
  });
  const [successModal, setSuccessModal] = useState({ open: false, title: "" });

  const navigate = useNavigate();
  const { isAdmin, authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (!authLoading && !isAdmin) {
      navigate("/");
      return;
    }

    if (!authLoading && isAdmin) {
      fetchPosts();
    }
  }, [isAdmin, navigate, authLoading]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getAllPosts(1, 0, 'All', true);
      setPosts(response.posts);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Failed to lead posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (postId, postTitle) => {
    setDeleteModal({
      open: true,
      postId,
      title: postTitle,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      open: false,
      postId: null,
      title: "",
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);

      const deletedPostTitle = deleteModal.title;

      await deletePost(deleteModal.postId);
      setPosts(posts.filter((post) => post.id !== deleteModal.postId));
      closeDeleteModal();

      setSuccessModal({
        open: true,
        title: deletedPostTitle,
      });
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setSuccessModal({ open: false, title: "" });
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="relative min-h-screen bg-slate-900/90 flex items-center justify-center">
        <div
          className="inset-0 bg-cover bg-center opacity-30 z-0 fixed"
          style={{ backgroundImage: `url(${barrensBackground})` }}
        ></div>
        <div className="relative z-10 text-center">
          <FaSpinner className="animate-spin text-amber-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-300">
            Checking permissions...
          </h2>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="relative min-h-screen bg-slate-900/90">
      <div
        className="inset-0 bg-cover bg-center opacity-30 z-0 fixed"
        style={{ backgroundImage: `url(${barrensBackground})` }}
      ></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-amber-300 font-serif tracking-wide">
            Manage Blog Posts
          </h1>

          <Link
            to="/admin/create-post"
            className="flex items-center px-4 py-2 bg-gradient-to-b from-amber-700 to-amber-900 text-amber-200 rounded border border-amber-600 hover:from-amber-600 hover:to-amber-800 transition-all duration-300"
          >
            <FaPlus className="mr-2" />
            Create New Post
          </Link>
        </div>

        <div className="bg-gradient-to-b from-amber-900/30 to-slate-900/70 rounded-lg border-2 border-amber-700 shadow-lg p-6 mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-amber-600" />
            </div>
            <input
              type="text"
              placeholder="Search posts by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <FaSpinner className="animate-spin text-amber-500 text-4xl" />
              <span className="ml-3 text-amber-300 text-xl">
                Loading posts...
              </span>
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-center">
              <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
              <p className="text-red-200">{error}</p>
              <button
                onClick={fetchPosts}
                className="mt-4 px-4 py-2 bg-amber-700 text-amber-100 rounded hover:bg-amber-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-amber-700/30">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-amber-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-700/30">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-amber-900/20">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 flex-shrink-0 mr-3">
                              <img
                                className="w-full h-full rounded object-cover"
                                src={post.image}
                                alt={post.title}
                              />
                            </div>
                            <div className="truncate max-w-xs">
                              <Link
                                to={`/blog/${post.id}`}
                                className="text-amber-200 hover:text-amber-300 font-medium truncate"
                              >
                                {post.title}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-800/30 text-amber-300 border border-amber-700/50">
                            {post.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-amber-200">
                          {post.author}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-amber-400/70">
                          {post.date}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <Link
                              to={`/admin/edit-post/${post.id}`}
                              className="text-amber-400 hover:text-amber-300 cursor-pointer hover:scale-125 transition-transform"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() =>
                                openDeleteModal(post.id, post.title)
                              }
                              className="text-red-500 hover:text-red-400 cursor-pointer hover:scale-125 transition-transform"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-8 text-center text-amber-300"
                      >
                        No posts found matching your search
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        message={`Are you sure you want to delete "${deleteModal.title}"?`}
        confirmText="Delete Post"
        cancelText="Cancel"
        loading={deleteLoading}
        type="danger"
      />

      <MessageModal
        isOpen={successModal.open}
        onClose={closeSuccessModal}
        title="Post Deleted"
        message={`"${successModal.title}" has been successfully deleted.`}
        type="success"
        autoClose={true}
        autoCloseTime={5000}
      />
    </div>
  );
}
