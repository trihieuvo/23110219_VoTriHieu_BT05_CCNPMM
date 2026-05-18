import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Gamepad2 } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-950 text-gray-400 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <div className="flex items-center space-x-2.5 mb-5">
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl">
                                <Gamepad2 className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-extrabold text-white tracking-tight">THStore</span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-sm text-gray-500">
                            Chuyên cung cấp các loại tay cầm chơi game chính hãng cho PlayStation, Xbox, Nintendo và PC. Trải nghiệm đỉnh cao, bảo hành uy tín.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white mb-5 uppercase tracking-wider">Liên hệ</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start group">
                                <MapPin className="h-4 w-4 mr-3 text-indigo-400 shrink-0 mt-0.5" />
                                <span className="group-hover:text-gray-300 transition-colors">1 Võ Văn Ngân, Thủ Đức, TP. HCM</span>
                            </li>
                            <li className="flex items-center group">
                                <Phone className="h-4 w-4 mr-3 text-indigo-400 shrink-0" />
                                <span className="group-hover:text-gray-300 transition-colors">0372008321</span>
                            </li>
                            <li className="flex items-center group">
                                <Mail className="h-4 w-4 mr-3 text-indigo-400 shrink-0" />
                                <span className="group-hover:text-gray-300 transition-colors">hieu981.vn@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800/50 py-5">
                <div className="container mx-auto px-4 text-center text-xs text-gray-600">
                    &copy; {new Date().getFullYear()} THStore.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
