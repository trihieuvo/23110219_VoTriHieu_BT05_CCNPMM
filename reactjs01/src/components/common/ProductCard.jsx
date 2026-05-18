import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product, index = 0 }) => {
    const discount = product.originalPrice > product.price 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
        : 0;

    return (
        <div 
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group border border-gray-100/80 opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <Link to={`/product/${product._id}`} className="block relative overflow-hidden">
                <div className="w-full overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
                    <img 
                        src={product.images[0] || 'https://via.placeholder.com/300'} 
                        alt={product.name} 
                        className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-4 py-2 rounded-full flex items-center shadow-lg">
                            <Eye className="h-3.5 w-3.5 mr-1.5" /> Xem chi tiết
                        </span>
                    </div>
                </div>
                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col space-y-1.5">
                    {product.isNewProduct && (
                        <span className="bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">Mới</span>
                    )}
                    {discount > 0 && (
                        <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">-{discount}%</span>
                    )}
                </div>
            </Link>
            
            <div className="p-4">
                <div className="mb-1.5 text-[11px] text-indigo-500 font-medium uppercase tracking-wider">{product.category?.name}</div>
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-indigo-600 transition-colors duration-200 h-10 leading-5">
                        {product.name}
                    </h3>
                </Link>
                
                <div className="mt-3 flex items-end justify-between">
                    <div>
                        <div className="text-lg font-bold text-gray-900">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </div>
                        {discount > 0 && (
                            <div className="text-xs text-gray-400 line-through">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
                            </div>
                        )}
                    </div>
                    
                    <button className="bg-gray-100 hover:bg-indigo-600 hover:text-white text-gray-500 p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-md">
                        <ShoppingCart className="h-4 w-4" />
                    </button>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-50 text-[11px] text-gray-400 flex justify-between">
                    <span>Đã bán: {product.sold}</span>
                    <span className={product.stock > 0 ? 'text-emerald-500' : 'text-red-400'}>{product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
