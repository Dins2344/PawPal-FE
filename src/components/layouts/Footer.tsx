import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-green-700">
                            🐾 PawPal
                        </Link>
                        <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                            Connecting loving families with pets in need. Every paw deserves a home.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-4">Quick Links</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                    Browse Pets
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-4">Support</h4>
                        <ul className="space-y-2.5">
                            <li>
                                <span className="text-sm text-gray-500">📧 support@pawpal.com</span>
                            </li>
                            <li>
                                <span className="text-sm text-gray-500">📞 +1 (555) 123-4567</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-4">Follow Us</h4>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                𝕏
                            </a>
                            <a href="#" className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                📘
                            </a>
                            <a href="#" className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                                📸
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} PawPal. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-400">
                        Made with ❤️ for pets everywhere
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
