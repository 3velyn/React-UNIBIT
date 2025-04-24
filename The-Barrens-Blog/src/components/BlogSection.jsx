import { useState, useEffect } from "react";
import { FaAngleLeft, FaAngleRight, FaSpinner } from "react-icons/fa";
import { getAllPosts } from "../api/post";
import BlogCard from "./BlogCard";

export default function BlogSection() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 6;
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await getAllPosts(
          currentPage,
          postsPerPage,
          activeCategory
        );

        setPosts(response.posts);
        setTotalPages(response.totalPages);

        if (categories.length <= 1) {
          const uniqueCategories = ["All"];
          response.posts.forEach((post) => {
            if (!uniqueCategories.includes(post.category)) {
              uniqueCategories.push(post.category);
            }
          });
          setCategories(uniqueCategories);
        }
        setError(null);
      } catch (error) {
        console.error("Failed to fetch posts: ", error);
        setError("Failed to load posts. Please try again later.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, [currentPage, activeCategory]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/70 min-h-[calc(100vh-16rem)]">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 h-full">
        <h2 className="text-3xl font-bold text-amber-300 mb-8 font-serif tracking-wide">
          Latest Posts
        </h2>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded text-sm font-medium transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                  activeCategory === category
                    ? "bg-amber-700 text-amber-100 border border-amber-500"
                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-amber-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="animate-spin text-amber-500 text-4xl" />
            <span className="ml-3 text-amber-300 text-xl">
              Loading posts...
            </span>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 text-center">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-amber-300 text-lg">
              No posts found in this category.
            </p>
            <p className="text-amber-200/70 mt-4">
              Try selecting a different category or check back later for new
              content.
            </p>
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2 bg-slate-800/50 border border-amber-700/30 rounded-lg p-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded ${
                  currentPage === 1
                    ? "text-slate-500 cursor-not-allowed"
                    : "text-amber-300 hover:bg-amber-700/30"
                }`}
              >
                <FaAngleLeft />
              </button>

              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`w-10 h-10 rounded flex items-center justify-center text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? "bg-amber-700 text-amber-100"
                        : "text-amber-300 hover:bg-amber-700/30"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 flex items-center justify-center rounded ${
                  currentPage === totalPages
                    ? "text-slate-500 cursor-not-allowed"
                    : "text-amber-300 hover:bg-amber-700/30"
                }`}
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}