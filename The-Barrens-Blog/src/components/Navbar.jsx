import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import barrensBackground from '../assets/Barrens_CGI.webp';
import { FaUser, FaSignOutAlt, FaPlus, FaList, FaCog } from 'react-icons/fa';

export default function Navbar() {
    const { user, isAuthenticated, isAdmin, logoutUser } = useAuth();

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Logout failed: ', error);
        }
    }

    return (
        <nav className="relative border-b-2 border-amber-700 shadow-lg p-4 overflow-visible z-[100]">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-90"
                style={{
                    backgroundImage: `url(${barrensBackground})`,
                }}
            ></div>

            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-600/90 to-slate-900/90"></div>

            <div className="container mx-auto flex justify-between items-center relative z-10">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                        <div className="h-12 flex items-center hover:rotate-6 transition-transform duration-1000 cursor-pointer">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/WoW_icon.svg/800px-WoW_icon.svg.png"
                                alt="The Barrens Blog"
                                className="h-16 mr-3 rounded shadow-lg"
                            />
                        </div>
                        <span className="text-amber-300 text-xl font-bold">Barrens Blog</span>
                    </Link>
                </div>

                <ul className="flex space-x-2">
                    {!isAuthenticated ? (
                        <>
                            <li>
                                <Link
                                    to="/login"
                                    className="inline-block px-4 py-2 bg-gradient-to-b from-slate-700 to-slate-900 text-amber-200 rounded border border-slate-600 hover:from-slate-600 hover:to-slate-800 hover:text-white transition-all duration-300 font-medium uppercase text-sm tracking-wide"
                                >
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/signup"
                                    className="inline-block px-4 py-2 bg-gradient-to-b from-amber-700 to-amber-900 text-amber-200 rounded border border-amber-600 hover:from-amber-600 hover:to-amber-800 hover:text-white transition-all duration-300 font-medium uppercase text-sm tracking-wide hover:translate-x-1"
                                >
                                    Sign up
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="relative group">
                                <button className="inline-flex items-center h-9 px-4 bg-gradient-to-b from-slate-700 to-slate-900 text-slate-300 rounded border border-slate-600 hover:from-slate-600 hover:to-slate-800 hover:text-amber-200 transition-all duration-300 font-medium uppercase text-sm tracking-wide">
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 rounded-full overflow-hidden mr-2 border border-amber-600 flex-shrink-0">
                                            <img
                                                src={user?.avatar || "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg"}
                                                alt={user?.username}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <span>{user?.username || "Profile"}</span>
                                    </div>
                                </button>

                                <div className="absolute right-0 mt-1 w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 z-50">
                                    <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-700 rounded shadow-lg overflow-hidden">
                                        <ul>
                                            <li>
                                                <Link to="/profile" className="flex items-center px-4 py-2 text-amber-200 hover:bg-amber-800/30 transition-colors duration-200 text-sm">
                                                    <FaUser className="mr-2" />
                                                    Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/settings" className="flex items-center px-4 py-2 text-amber-200 hover:bg-amber-800/30 transition-colors duration-200 text-sm">
                                                    <FaCog className="mr-2" />
                                                    Settings
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left flex items-center px-4 py-2 text-amber-200 hover:bg-amber-800/30 transition-colors duration-200 text-sm"
                                                >
                                                    <FaSignOutAlt className="mr-2" />
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>

                            {isAdmin && (
                                <li className="relative group">
                                    <button className="inline-flex items-center h-9 px-4 bg-gradient-to-b from-amber-700 to-amber-900 text-amber-200 rounded border border-amber-600 hover:from-amber-600 hover:to-amber-800 hover:text-white transition-all duration-300 font-medium uppercase text-sm tracking-wide">
                                        <div className="flex items-center">
                                            <span>Admin</span>
                                        </div>
                                    </button>

                                    <div className="absolute right-0 mt-1 w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 z-50">
                                        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-700 rounded shadow-lg overflow-hidden">
                                            <ul>
                                                <li>
                                                    <Link to="/admin/create-post" className="flex items-center px-4 py-2 text-amber-200 hover:bg-amber-800/30 transition-colors duration-200 text-sm">
                                                        <FaPlus className="mr-2" />
                                                        Create New Post
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/admin/manage-posts" className="flex items-center px-4 py-2 text-amber-200 hover:bg-amber-800/30 transition-colors duration-200 text-sm">
                                                        <FaList className="mr-2" />
                                                        Manage Posts
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                            )}
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}