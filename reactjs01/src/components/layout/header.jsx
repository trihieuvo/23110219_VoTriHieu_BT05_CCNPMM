import React, { useContext, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/auth.context';
import { ShoppingCart, User, Search, LogOut, Menu, X, Gamepad2, ChevronDown } from 'lucide-react';

const Header = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setAuth({
            isAuthenticated: false,
            user: { email: "", name: "" },
        });
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
        }
    };

    return (
        <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 mr-6">
                        <Link to="/" className="flex items-center space-x-2.5 group">
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                                <Gamepad2 className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">THStore</span>
                        </Link>
                    </div>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:block flex-1 max-w-lg mx-6">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm tay cầm..."
                                className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:bg-white transition-all duration-300 ${isSearchFocused ? 'border-indigo-400 ring-2 ring-indigo-100 shadow-sm' : 'border-gray-200'}`}
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                            <Search className={`absolute left-3.5 top-3 h-4 w-4 transition-colors duration-200 ${isSearchFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
                        </form>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium text-sm px-3 py-2 rounded-lg hover:bg-indigo-50/50 transition-all duration-200">Trang chủ</Link>
                        <Link to="/search" className="text-gray-600 hover:text-indigo-600 font-medium text-sm px-3 py-2 rounded-lg hover:bg-indigo-50/50 transition-all duration-200">Sản phẩm</Link>
                        
                        <div className="flex items-center space-x-3 border-l border-gray-200 ml-2 pl-4">
                            <Link to="/cart" className="text-gray-500 hover:text-indigo-600 relative p-2 rounded-lg hover:bg-indigo-50/50 transition-all duration-200">
                                <ShoppingCart className="h-5 w-5" />
                                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-sm">0</span>
                            </Link>

                            {auth.isAuthenticated ? (
                                <div className="relative group">
                                    <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-medium text-sm px-3 py-2 rounded-lg hover:bg-indigo-50/50 transition-all duration-200">
                                        <div className="bg-indigo-100 p-1 rounded-full">
                                            <User className="h-4 w-4 text-indigo-600" />
                                        </div>
                                        <span className="max-w-[80px] truncate">{auth.user.name}</span>
                                        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                                    </button>
                                    <div className="absolute right-0 top-full pt-2 w-52 z-10 hidden group-hover:block animate-fade-in">
                                        <div className="bg-white rounded-xl shadow-xl py-2 border border-gray-100 overflow-hidden">
                                            <div className="px-4 py-2.5 border-b border-gray-50">
                                                <p className="text-xs text-gray-400">Đăng nhập với</p>
                                                <p className="text-sm text-gray-700 font-medium truncate">{auth.user.email}</p>
                                            </div>
                                            <Link to="/profile" className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Tài khoản</Link>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center">
                                                <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium text-sm px-3 py-2 rounded-lg hover:bg-indigo-50/50 transition-all duration-200">Đăng nhập</Link>
                                    <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">Đăng ký</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-indigo-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white border-t border-gray-100 px-4 py-4 space-y-3">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    </form>
                    <div className="space-y-1 pt-2">
                        <Link to="/" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors">Trang chủ</Link>
                        <Link to="/search" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors">Sản phẩm</Link>
                        <Link to="/cart" className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors flex items-center">
                            <ShoppingCart className="h-4 w-4 mr-2" /> Giỏ hàng (0)
                        </Link>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                        {auth.isAuthenticated ? (
                            <>
                                <div className="px-4 py-2">
                                    <p className="text-sm font-medium text-gray-800">{auth.user.name}</p>
                                    <p className="text-xs text-gray-500">{auth.user.email}</p>
                                </div>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center">
                                    <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                                </button>
                            </>
                        ) : (
                            <div className="flex space-x-3 px-4">
                                <Link to="/login" className="flex-1 text-center py-2.5 text-sm font-medium border border-gray-200 rounded-xl text-gray-700 hover:border-indigo-300 transition-colors">Đăng nhập</Link>
                                <Link to="/register" className="flex-1 text-center py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors">Đăng ký</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;