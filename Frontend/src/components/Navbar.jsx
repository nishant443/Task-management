import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout, isAdmin } = useContext(AuthContext);
    const nav = useNavigate();

    const handleLogout = () => {
        logout();
        nav("/login");
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 text-white shadow-2xl">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo/Brand */}
                    <Link 
                        to="/" 
                        className="flex items-center space-x-3 group"
                    >
                        <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-2 rounded-lg shadow-lg group-hover:from-gray-600 group-hover:to-gray-500 transition-all duration-200">
                            <svg className="h-6 w-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors duration-200">
                            Task Manager
                        </span>
                    </Link>

                    {/* Navigation Items */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {/* User Greeting */}
                                <div className="hidden sm:flex items-center space-x-2">
                                    <div className="h-8 w-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-200">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-300">
                                        Hi, <span className="text-gray-100 font-medium">{user.name}</span>
                                    </span>
                                </div>

                                {/* Dashboard Link */}
                                <Link 
                                    to="/" 
                                    className="px-4 py-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-gray-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                                >
                                    <span className="hidden sm:inline">Dashboard</span>
                                    <svg className="h-4 w-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                </Link>

                                {/* Admin Users Link */}
                                {isAdmin() && (
                                    <Link 
                                        to="/users" 
                                        className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white border border-gray-600 hover:border-gray-500 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                                    >
                                        <span className="hidden sm:inline">Users</span>
                                        <svg className="h-4 w-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </Link>
                                )}

                                {/* Logout Button */}
                                <button 
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-lg bg-gray-600 text-gray-200 hover:bg-gray-500 hover:text-white border border-gray-500 hover:border-gray-400 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg flex items-center space-x-2"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Login Button */}
                                <Link 
                                    to="/login" 
                                    className="px-4 py-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-gray-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
                                >
                                    Login
                                </Link>

                                {/* Register Button */}
                                <Link 
                                    to="/register" 
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500 border border-gray-600 hover:border-gray-500 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}