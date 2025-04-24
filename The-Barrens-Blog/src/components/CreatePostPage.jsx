import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/post";
import {
  FaHeading,
  FaFileAlt,
  FaImage,
  FaTag,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import barrensBackground from "../assets/Barrens_CGI.webp";
import { useAuth } from "../hooks/useAuth";

export default function CreatePostPage() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    image: "",
    readTime: "5 min",
  });

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Locations",
    "Cities",
    "Dungeons",
    "History",
    "Classes",
    "Professions",
    "Events",
    "Guides",
    "Lore",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (
      !formData.title ||
      !formData.content ||
      !formData.category ||
      !formData.excerpt
    ) {
      setFormError("Title, content, exerpt and category are required fields");
      return;
    }

    const postData = {
      ...formData,
      image:
        formData.image ||
        "https://static.wikia.nocookie.net/wowpedia/images/0/06/Exploring_Azeroth_Kalimdor_-_Barrens.jpg",
    };

    try {
      setLoading(true);
      const response = await createPost(postData);
      setSuccessMessage("Post created successfully!");

      setTimeout(() => {
        navigate(`/blog/${response.post.id}`);
      }, 1500);
    } catch (error) {
      console.error("Create post error: ", error);
      setFormError(error.message || "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
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
          <p className="text-amber-100">
            You must be an admin to create posts.
          </p>
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

  return (
    <div className="min-h-[calc(100vh-6em)] py-8 px-4 relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-90 z-0" 
        style={{ backgroundImage: `url(${barrensBackground})` }}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/90 to-slate-900/90 z-0"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="border-2 border-amber-700 rounded-lg overflow-hidden bg-gradient-to-b from-slate-800/95 to-slate-900/95 shadow-xl">
          <div className="p-6 border-b border-amber-700/30">
            <h1 className="text-2xl font-bold text-center text-amber-300 font-serif tracking-wide uppercase">
              Create New Blog Post
            </h1>
            <p className="text-center text-amber-200/70 mt-2">
              Share your knowledge of Azeroth with the world
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {formError && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2 flex-shrink-0" />
                <span className="text-red-200">{formError}</span>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-6 p-4 bg-green-900/30 border border-green-800 rounded flex items-center">
                <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                <span className="text-green-200">{successMessage}</span>
              </div>
            )}
          
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
                    disabled={loading}
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
                    rows={5}
                    disabled={loading}
                  ></textarea>
                </div>
                <p className="mt-1 text-xs text-amber-400/60">
                  Write your full blog post content here. You can use basic HTML tags for formatting.
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
                    rows={2}
                    maxLength={200}
                    disabled={loading}
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
                      disabled={loading}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
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
                      disabled={loading}
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
                      <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
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
                    placeholder="Enter image URL (optional)"
                    disabled={loading}
                  />
                </div>
                <p className="mt-1 text-xs text-amber-400/60">
                  Leave blank for default image. Use high-quality landscape images for best results.
                </p>
              </div>
              
              <div className="p-4 bg-slate-800/50 border border-amber-700/30 rounded-md">
                <h3 className="text-amber-300 text-sm font-medium uppercase tracking-wide mb-2">
                  Author Preview
                </h3>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-600 mr-3">
                    <img 
                      className="w-full h-full object-cover"
                      src={user?.avatar || "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg"}
                      alt={user?.username || "Author"}
                    />
                  </div>
                  <div>
                    <p className="text-amber-400 font-medium text-sm">{user?.username || "Anonymous"}</p>
                    <p className="text-amber-400/60 text-xs">
                      {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} • {formData.readTime} read
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-b from-amber-700 to-amber-900 text-amber-200 rounded border border-amber-600 hover:from-amber-600 hover:to-amber-800 hover:text-white transition-all duration-300 font-medium uppercase tracking-wide text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-amber-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Post...
                    </span>
                  ) : 'Create Post'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
