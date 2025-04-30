import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost } from "../api/post";
import { useAuth } from "../hooks/useAuth";
import {
  FaHeading,
  FaFileAlt,
  FaImage,
  FaTag,
  FaClock,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import barrensBackground from "../assets/Barrens_CGI.webp";
import MessageModal from "./common/MessageModal";

export default function EditPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    image: "",
    readTime: "5 min",
  });

  const [originalPost, setOriginalPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [messageModal, setMessageModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const categories = [
    "Locations",
    "Cities",
    "Dungeons",
    "Characters",
    "Classes",
    "Professions",
    "Events",
    "Guides",
    "Lore",
    "Races",
  ];

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const response = await getPostById(id);
        setOriginalPost(response.post);

        setFormData({
          title: response.post.title || "",
          content: response.post.content || "",
          excerpt: response.post.excerpt || "",
          category: response.post.category || "",
          image: response.post.image || "",
          readTime: response.post.readTime || "5 min",
        });
      } catch (err) {
        console.error("Failed to fetch post:", err);
        showErrorModal(
          "Failed to lead post. It may not exist or you may not have permission to edit it."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showSuccessModal = (message) => {
    setMessageModal({
      isOpen: true,
      type: "success",
      title: "Success",
      message,
    });
  };

  const showErrorModal = (message) => {
    setMessageModal({ isOpen: true, type: "error", title: "Error", message });
  };

  const closeMessageModal = () => {
    setMessageModal((prev) => ({ ...prev, isOpen: false }));

    if (messageModal.type === "success") {
      navigate(`/blog/${id}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.content ||
      !formData.category ||
      !formData.excerpt
    ) {
      showErrorModal(
        "Title, content, excerpt and category are required fields."
      );
      return;
    }

    try {
      setSubmitting(true);
      await updatePost(id, { ...formData });

      showSuccessModal(
        "Post updated successfully! You will be redirected to view the post."
      );
    } catch (err) {
      console.error("Update post error:", err);
      showErrorModal(err.message || "Failed to update post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="h-[calc(100vh-6em)] flex items-center justify-center">
        <div className="bg-red-900/30 border border-red-800 rounded p-5 text-center">
          <FaExclamationTriangle className="mx-auto text-red-500 text-4xl mb-4" />
          <h2 className="text-2xl font-serif text-amber-300 mb-2">
            Unauthorized Access
          </h2>
          <p className="text-amber-100">You must be an admin to edit posts.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-amber-700 text-amber-100 rounded hover:bg-amber-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-6em)] py-8 px-4 relative flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 z-0"
          style={{ backgroundImage: `url(${barrensBackground})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/90 to-slate-900/90 z-0"></div>
        <div className="relative z-10 text-center">
          <FaSpinner className="animate-spin text-amber-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-300">Loading post...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-6em)] py-8 px-4 relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-90 z-0"
        style={{ backgroundImage: `url(${barrensBackground})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/90 to-slate-900/90 z-0"></div>

      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={closeMessageModal}
        title={messageModal.title}
        message={messageModal.message}
        type={messageModal.type}
        autoClose={messageModal.type === "success"}
        autoCloseTime={5000}
      />

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="border-2 border-amber-700 rounded-lg overflow-hidden bg-gradient-to-b from-slate-800/95 to-slate-900/95 shadow-xl">
          <div className="p-6 border-b border-amber-700/30">
            <h1 className="text-2xl font-bold text-center text-amber-300 font-serif tracking-wide uppercase">
              Edit Blog Post
            </h1>
            <p className="text-center text-amber-200/70 mt-2">
              Make changes to "{originalPost?.title}"
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-amber-300 text-sm font-medium uppercase tracking-wide mb-1">
                  Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaHeading className="text-amber-600" />
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter your post title"
                    required
                    maxLength={100}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-300 text-sm font-medium uppercase tracking-wide mb-1">
                  Content
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FaFileAlt className="text-amber-600" />
                  </div>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    onBlur={() => !formData.excerpt}
                    className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Write your post content here..."
                    required
                    rows={12}
                    disabled={submitting}
                  ></textarea>
                </div>
                <p className="mt-1 text-xs text-amber-400/60">
                  You can use basic HTML tags for formatting.
                </p>
              </div>

              <div>
                <label className="block text-amber-300 text-sm font-medium uppercase tracking-wide mb-1">
                  Excerpt
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FaFileAlt className="text-amber-600" />
                  </div>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Brief summary of your post"
                    rows={3}
                    maxLength={200}
                    disabled={submitting}
                  ></textarea>
                </div>
                <p className="mt-1 text-xs text-amber-400/60">
                  A short summary shown on blog cards.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-amber-300 text-sm font-medium uppercase tracking-wide mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTag className="text-amber-600" />
                    </div>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                      required
                      disabled={submitting}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-amber-400"
                        fill="none"
                        viewBox="0 0 20 20"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-amber-300 text-sm font-medium uppercase tracking-wide mb-1">
                    Read Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaClock className="text-amber-600" />
                    </div>
                    <select
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleChange}
                      className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none"
                      disabled={submitting}
                    >
                      <option value="2 min">2 min</option>
                      <option value="3 min">3 min</option>
                      <option value="4 min">4 min</option>
                      <option value="5 min">5 min</option>
                      <option value="6 min">6 min</option>
                      <option value="7 min">7 min</option>
                      <option value="8 min">8 min</option>
                      <option value="10 min">10 min</option>
                      <option value="15 min">15 min</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-amber-400"
                        fill="none"
                        viewBox="0 0 20 20"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-amber-300 text-sm font-medium uppercase tracking-wide mb-1">
                  Image URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaImage className="text-amber-600" />
                  </div>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full py-2 pl-10 px-4 bg-slate-800/70 border border-amber-700/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Enter image URL"
                    disabled={submitting}
                  />
                </div>
                <p className="mt-1 text-xs text-amber-400/60">
                  Use high-quality landscape images for best results.
                </p>
              </div>

              {formData.image && (
                <div className="border border-amber-700/30 rounded-md p-2">
                  <p className="text-amber-300 text-sm font-medium mb-2">
                    Image Preview
                  </p>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded"
                    onError={(e) => {
                      e.target.src =
                        "https://bnetcmsus-a.akamaihd.net/cms/blog_header/jt/JTBWM43Z2GU91533928724920.jpg";
                      e.target.onerror = null;
                    }}
                  />
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-gradient-to-b from-amber-700 to-amber-900 text-amber-200 rounded border border-amber-600 hover:from-amber-600 hover:to-amber-800 hover:text-white transition-all duration-300 font-medium uppercase cursor-pointer tracking-wide text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-amber-200" />
                      Updating Post...
                    </span>
                  ) : (
                    "Update Post"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin/manage-posts")}
                  className="flex-1 py-3 bg-gradient-to-b from-slate-700 to-slate-900 text-amber-200 rounded border border-slate-600 hover:from-slate-600 hover:to-slate-800 transition-all duration-300 font-medium uppercase tracking-wide text-sm cursor-pointer"
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
