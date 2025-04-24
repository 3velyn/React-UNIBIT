import { Link } from "react-router-dom";

export default function BlogCard({ post }) {
  if (!post) return null;

  return (
    <div className="max-w-md rounded-lg overflow-hidden shadow-lg border-2 border-amber-700 bg-gradient-to-b from-amber-900/80 to-slate-900/90 text-amber-100 flex flex-col h-[500px]">
      <div className="relative h-48 overflow-hidden">
        <img
          className="w-full object-cover h-full"
          src={post.image}
          alt={post.title}
        />
        <div className="absolute top-0 right-0 bg-amber-800 text-amber-200 px-3 py-1 m-2 rounded-sm border border-amber-600 text-xs uppercase tracking-wide">
          {post.category}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-xl font-bold mb-2 text-amber-300 font-serif tracking-wide">
          {post.title}
        </h2>

        <p className="text-amber-200/80 mb-4 text-sm line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-600 mr-3">
            <img
              className="w-full h-full object-cover"
              src={post.authorAvatar}
              alt={post.author}
              onError={(e) => {
                e.target.src =
                  "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
              }}
            />
          </div>
          <div>
            <p className="text-amber-400 font-medium text-sm">{post.author}</p>
            <p className="text-amber-400/60 text-xs">
              {post.date} • {post.readTime} read
            </p>
          </div>
        </div>

        <div className="flex-grow"></div>

        <Link
          to={`/blog/${post.id}`}
          className="w-full py-2 px-4 bg-gradient-to-b from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-200 text-sm uppercase tracking-wide font-medium rounded border border-amber-600 transition-all duration-300 text-center block"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}