import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEdit,
  FaCommentAlt,
  FaHeart,
  FaSpinner,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaPen,
} from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { getUserStats } from "../api/user";
import barrensBackground from "../assets/Barrens_CGI.webp";
import AvatarModal from "./common/AvatarModal";

export default function ProfilePage() {
  const { user, setUserData } = useAuth();
  const [stats, setStats] = useState({
    postCount: 0,
    commentCount: 0,
    likedPosts: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    setError(null);
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const response = await getUserStats(user?._id);
        if (response.success) {
          setStats(response.stats);
        }
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
        setError("Failed to lead user statistics");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchUserStats();
    }
  }, [user?._id]);

  const handleAvatarUpdate = (newAvatarUrl) => {
    if (setUserData) {
      setUserData((current) => ({
        ...current,
        avatar: newAvatarUrl,
      }));
    }
  };

  if (loading && !error) {
    return (
      <div className="min-h-[calc(100vh-6em)] py-8 px-4 relative flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-90 z-0"
          style={{ backgroundImage: `url(${barrensBackground})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/90 to-slate-900/90 z-0"></div>
        <div className="relative z-10 text-center">
          <FaSpinner className="animate-spin text-amber-500 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-300">
            Loading profile data...
          </h2>
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

      <div className="container mx-auto max-w-4xl relative z-10">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border-2 border-red-700 rounded-lg flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-3 flex-shrink-0 text-xl" />
            <span className="text-red-200">{error}</span>
          </div>
        )}

        <div className="border-2 border-amber-700 rounded-lg overflow-hidden bg-gradient-to-b from-slate-800/95 to-slate-900/95 shadow-xl">
          <div className="p-6 border-b border-amber-700/30 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-600 shadow-lg">
              <img
                src={
                  user?.avatar ||
                  "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg"
                }
                alt="Profile Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-300 font-serif tracking-wide">
                {user?.username}
              </h1>
              <p className="text-amber-200/70">
                Member since{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <div className="mt-2 inline-flex items-center px-3 py-1 bg-amber-800 text-amber-200 text-xs uppercase tracking-wide rounded-sm border border-amber-600">
                {user?.role}
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <div className="border border-amber-700/30 rounded-md p-4 bg-slate-800/30">
                <h2 className="text-amber-300 text-lg font-medium mb-3 flex items-center">
                  <FaUserCircle className="mr-2" /> Account Info
                </h2>
                <div className="space-y-3 text-amber-100">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400/70">Email:</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400/70">Username:</span>
                    <span>{user?.username}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400/70">Role:</span>
                    <span>{user?.role}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-amber-700/30">
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="w-full py-2 bg-gradient-to-b from-amber-700 to-amber-900 text-amber-200 rounded border border-amber-600 hover:from-amber-600 hover:to-amber-800 cursor-pointer transition-all duration-300 text-sm flex justify-center items-center"
                  >
                    <FaEdit className="mr-2" /> Change Avatar
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-amber-700/30 rounded-md p-3 bg-slate-800/30 text-center">
                  <div className="text-amber-300 text-2xl font-bold">
                    {stats.postCount || 0}
                  </div>
                  <div className="text-amber-400/70 flex items-center justify-center">
                    <FaPen className="mr-1" /> Posts
                  </div>
                </div>

                <div className="border border-amber-700/30 rounded-md p-3 bg-slate-800/30 text-center">
                  <div className="text-amber-300 text-2xl font-bold">
                    {stats.commentCount || 0}
                  </div>
                  <div className="text-amber-400/70 flex items-center justify-center">
                    <FaCommentAlt className="mr-1" /> Comments
                  </div>
                </div>

                <div className="border border-amber-700/30 rounded-md p-3 bg-slate-800/30 text-center">
                  <div className="text-amber-300 text-2xl font-bold">
                    {stats.likedPosts?.length || 0}
                  </div>
                  <div className="text-amber-400/70 flex items-center justify-center">
                    <FaHeart className="mr-1" /> Liked Posts
                  </div>
                </div>
              </div>

              <div className="border border-amber-700/30 rounded-md p-4 bg-slate-800/30">
                <h2 className="text-amber-300 text-lg font-medium mb-4">
                  Recent Activity
                </h2>

                {stats.recentActivity && stats.recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="border-b border-amber-700/20 pb-3 last:border-0"
                      >
                        <p className="text-amber-200">{activity.description}</p>
                        <p className="text-sm text-amber-400/70 flex items-center mt-1">
                          <FaCalendarAlt className="mr-2 text-amber-500/70" />{" "}
                          {activity.date}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-amber-400/70">
                    No recent activity to display.
                    <p className="mt-2 text-sm">
                      Explore the blog and leave some comments!
                    </p>
                  </div>
                )}
              </div>

              {stats.likedPosts && stats.likedPosts.length > 0 && (
                <div>
                  <h2 className="text-amber-300 text-lg font-medium mb-4">
                    Posts You've Liked
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.likedPosts.slice(0, 5).map((post, index) => (
                      <div
                        key={index}
                        className="border border-amber-700/70 rounded overflow-hidden bg-slate-900/30"
                      >
                        <img
                          src={
                            post.image ||
                            "https://bnetcmsus-a.akamaihd.net/cms/blog_header/2g/2G4VZH5TIWJB1509414272262.jpg"
                          }
                          alt={post.title}
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-3">
                          <h3 className="text-amber-200 font-medium truncate">
                            {post.title}
                          </h3>
                          <p className="text-xs text-amber-400/70 mt-1">
                            {post.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AvatarModal
        show={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatar={user?.avatar}
        onAvatarUpdate={handleAvatarUpdate}
      />
    </div>
  );
}
