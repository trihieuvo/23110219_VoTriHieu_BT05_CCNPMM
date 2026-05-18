import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../util/axios-customize';
import ProductCard from '../components/common/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { ShoppingCart, Heart, ShieldCheck, Truck, ChevronRight, Minus, Plus, ArrowRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const res = await axios.get(`/v1/api/products/${id}`);
                const relatedRes = await axios.get(`/v1/api/products/${id}/related`);
                
                if (res && res.data) setProduct(res.data);
                if (relatedRes && relatedRes.data) setRelatedProducts(relatedRes.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };

        setLoading(true);
        fetchProductDetail();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 text-sm animate-pulse">Đang tải...</p>
        </div>
    );
    if (!product) return <div className="flex justify-center items-center h-screen text-gray-500">Product not found</div>;

    const discount = product.originalPrice > product.price 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
        : 0;

    const handleQuantityChange = (type) => {
        if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        } else if (type === 'increase' && quantity < product.stock) {
            setQuantity(prev => prev + 1);
        }
    };

    return (
        <div className="bg-gray-50 py-8 min-h-screen">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-400 mb-6 animate-fade-in">
                    <Link to="/" className="hover:text-indigo-600 transition-colors">Trang chủ</Link>
                    <ChevronRight className="h-3.5 w-3.5 mx-2" />
                    <Link to={`/search?category=${product.category?._id}`} className="hover:text-indigo-600 transition-colors">
                        {product.category?.name}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 mx-2" />
                    <span className="text-gray-700 truncate max-w-[200px]">{product.name}</span>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-10 border border-gray-100 animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Images Section */}
                        <div className="w-full overflow-hidden p-6 md:p-8 bg-gradient-to-br from-gray-50 to-white">
                            <Swiper
                                style={{
                                    '--swiper-navigation-color': '#4f46e5',
                                    '--swiper-pagination-color': '#4f46e5',
                                }}
                                loop={true}
                                spaceBetween={10}
                                navigation={true}
                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="h-[380px] rounded-xl mb-4 bg-gray-50"
                            >
                                {product.images?.length > 0 ? (
                                    product.images.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
                                        </SwiperSlide>
                                    ))
                                ) : (
                                    <SwiperSlide>
                                        <img src="https://via.placeholder.com/500" alt="Placeholder" className="w-full h-full object-contain" />
                                    </SwiperSlide>
                                )}
                            </Swiper>
                            
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                loop={true}
                                spaceBetween={10}
                                slidesPerView={4}
                                freeMode={true}
                                watchSlidesProgress={true}
                                modules={[FreeMode, Navigation, Thumbs]}
                                className="h-20 product-thumbs"
                            >
                                {product.images?.map((img, index) => (
                                    <SwiperSlide key={index} className="cursor-pointer rounded-lg overflow-hidden border-2 border-transparent opacity-50 hover:opacity-100 transition-all duration-300 bg-gray-50">
                                        <img src={img} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Info Section */}
                        <div className="flex flex-col p-6 md:p-8">
                            <span className="inline-block text-[11px] text-indigo-500 font-semibold uppercase tracking-widest mb-2">{product.category?.name}</span>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
                            
                            <div className="flex items-center space-x-3 mb-6 text-sm">
                                <span className="text-gray-400">Đã bán: <span className="text-gray-700 font-semibold">{product.sold}</span></span>
                                <span className="text-gray-200">|</span>
                                <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {product.stock > 0 ? '● Còn hàng' : '● Hết hàng'}
                                </span>
                            </div>

                            <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30 p-5 rounded-xl mb-6">
                                <div className="flex items-end space-x-3">
                                    <div className="text-3xl font-extrabold text-gray-900">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                    </div>
                                    {discount > 0 && (
                                        <>
                                            <div className="text-base text-gray-400 line-through mb-0.5">
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
                                            </div>
                                            <span className="bg-red-50 text-red-500 text-xs font-bold px-2.5 py-1 rounded-full mb-0.5">
                                                -{discount}%
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-8">
                                <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Số lượng</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden">
                                        <button 
                                            onClick={() => handleQuantityChange('decrease')}
                                            disabled={quantity <= 1}
                                            className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <input 
                                            type="number" 
                                            value={quantity}
                                            readOnly
                                            className="w-14 text-center border-x border-gray-200 py-2.5 focus:outline-none text-sm font-semibold"
                                        />
                                        <button 
                                            onClick={() => handleQuantityChange('increase')}
                                            disabled={quantity >= product.stock}
                                            className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <span className="text-xs text-gray-400">{product.stock} sản phẩm có sẵn</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-3 mb-8 mt-auto">
                                <button 
                                    disabled={product.stock === 0}
                                    className="flex-1 bg-white text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md"
                                >
                                    <ShoppingCart className="h-5 w-5 mr-2" /> Thêm vào giỏ
                                </button>
                                <button 
                                    disabled={product.stock === 0}
                                    className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                                >
                                    Mua ngay
                                </button>
                                <button className="p-3 border-2 border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-300 rounded-xl transition-all duration-300 bg-white hover:bg-rose-50">
                                    <Heart className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Policy */}
                            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-6">
                                <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                                    <ShieldCheck className="h-4 w-4 text-indigo-400 mr-2 shrink-0" />
                                    Đổi trả trong 7 ngày
                                </div>
                                <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                                    <Truck className="h-4 w-4 text-indigo-400 mr-2 shrink-0" />
                                    Miễn phí giao hàng
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-10 border border-gray-100 animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <h2 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">Mô tả sản phẩm</h2>
                    <div className="prose max-w-none text-gray-600 text-sm leading-relaxed">
                        <p className="whitespace-pre-line">{product.description}</p>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center">
                                <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full mr-4"></div>
                                <h2 className="text-2xl font-bold text-gray-900">Sản Phẩm Tương Tự</h2>
                            </div>
                            <Link to={`/search?category=${product.category?._id}`} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center group">
                                Xem tất cả <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                            {relatedProducts.map((p, i) => (
                                <ProductCard key={p._id} product={p} index={i} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;
