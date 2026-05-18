import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomeProductsAPI, getTopSellingProductsAPI, getMostViewedProductsAPI } from '../services/productService';
import ProductCard from '../components/common/ProductCard';
import { Gamepad2, Zap, Trophy, ShieldCheck, ArrowRight, Flame, Eye } from 'lucide-react';

// ===== Horizontal Scroll Section (dùng cho Top 10) =====
const HorizontalProductList = ({ products, loading }) => {
    if (loading) {
        return (
            <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar snap-x snap-mandatory scroll-smooth">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-none w-44 md:w-52 snap-start bg-white rounded-xl overflow-hidden border border-gray-100"
                    >
                        <div className="h-40 skeleton"></div>
                        <div className="p-3 space-y-2">
                            <div className="h-3 w-12 skeleton rounded"></div>
                            <div className="h-4 w-full skeleton rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) return null;

    return (
        <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar snap-x snap-mandatory scroll-smooth">
            {products.map((product, i) => (
                <div key={product._id} className="flex-none w-44 md:w-52 snap-start">
                    {/* Badge xếp hạng */}
                    <div className="relative">
                        <span
                            className={`absolute top-2 left-2 z-10 text-[11px] font-bold px-2 py-0.5 rounded-full text-white shadow
                                ${i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-700' : 'bg-indigo-500'}`}
                        >
                            #{i + 1}
                        </span>
                        <ProductCard product={product} index={i} />
                    </div>
                </div>
            ))}
        </div>
    );
};

// ===== Section Header =====
const SectionHeader = ({ title, subtitle, icon: Icon, gradientClass, linkTo }) => (
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
            <div className={`w-1.5 h-8 ${gradientClass} rounded-full mr-4`}></div>
            <div>
                <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-gray-700" />
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            </div>
        </div>
        <Link to={linkTo} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center group">
            Xem tất cả <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
    </div>
);

// ===== Main Component =====
const Home = () => {
    const [homeData, setHomeData] = useState({
        newProducts: [],
        featuredProducts: [],
        saleProducts: []
    });
    const [topSelling, setTopSelling] = useState([]);
    const [mostViewed, setMostViewed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [topSellingLoading, setTopSellingLoading] = useState(true);
    const [mostViewedLoading, setMostViewedLoading] = useState(true);

    // Fetch dữ liệu Home (newProducts, featuredProducts, saleProducts)
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const res = await getHomeProductsAPI();
                if (res && res.data) {
                    setHomeData(res.data);
                }
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    // Fetch Top 10 Bán Chạy
    useEffect(() => {
        const fetchTopSelling = async () => {
            try {
                const res = await getTopSellingProductsAPI();
                if (res && res.data) {
                    setTopSelling(res.data.data || []);
                }
            } catch (error) {
                console.error('Error fetching top selling:', error);
            } finally {
                setTopSellingLoading(false);
            }
        };
        fetchTopSelling();
    }, []);

    // Fetch Top 10 Xem Nhiều
    useEffect(() => {
        const fetchMostViewed = async () => {
            try {
                const res = await getMostViewedProductsAPI();
                if (res && res.data) {
                    setMostViewed(res.data.data || []);
                }
            } catch (error) {
                console.error('Error fetching most viewed:', error);
            } finally {
                setMostViewedLoading(false);
            }
        };
        fetchMostViewed();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 text-sm animate-pulse">Đang tải...</p>
            </div>
        );
    }

    const features = [
        { icon: Gamepad2, title: 'Chính hãng 100%', desc: 'Đảm bảo chất lượng' },
        { icon: Zap, title: 'Giao hàng hỏa tốc', desc: 'Nhận hàng trong 2h' },
        { icon: ShieldCheck, title: 'Bảo hành 12 tháng', desc: 'Lỗi là đổi mới' },
        { icon: Trophy, title: 'Đại lý ủy quyền', desc: 'Uy tín hàng đầu' },
    ];

    return (
        <div className="bg-gray-50 pb-16">
            {/* Hero Banner */}
            <div className="relative min-h-[480px] md:min-h-[520px] overflow-hidden bg-gray-900 text-white flex items-center">
                <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
                    alt="Hero Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-transparent"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-xl animate-fade-in-up">
                        <span className="inline-block bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-indigo-400/20 uppercase tracking-widest">
                            Bộ sưu tập 2026
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                            Nâng Tầm<br />
                            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Trải Nghiệm Gaming</span>
                        </h1>
                        <p className="text-base md:text-lg mb-8 text-gray-300/90 leading-relaxed max-w-md">
                            Khám phá bộ sưu tập tay cầm chơi game cao cấp từ các thương hiệu hàng đầu thế giới.
                        </p>
                        <div className="flex space-x-4">
                            <Link to="/search" className="group bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 flex items-center shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
                                Khám phá ngay
                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="bg-white py-8 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="flex flex-col items-center p-5 rounded-xl hover:bg-indigo-50/50 transition-colors duration-300 group opacity-0 animate-fade-in-up" style={{ animationDelay: `${i * 100 + 200}ms` }}>
                                <div className="bg-indigo-50 p-3 rounded-xl mb-3 group-hover:bg-indigo-100 transition-colors group-hover:scale-110 transform duration-300">
                                    <f.icon className="h-7 w-7 text-indigo-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-14 space-y-20">

                {/* ===== TOP 10 BÁN CHẠY (Horizontal Scroll) ===== */}
                <section className="opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <SectionHeader
                        title="Top 10 Bán Chạy"
                        subtitle="Được game thủ lựa chọn nhiều nhất"
                        icon={Flame}
                        gradientClass="bg-gradient-to-b from-red-500 to-orange-500"
                        linkTo="/search?sort=price_desc"
                    />
                    <HorizontalProductList products={topSelling} loading={topSellingLoading} />
                </section>

                {/* ===== TOP 10 XEM NHIỀU (Horizontal Scroll) ===== */}
                <section className="opacity-0 animate-fade-in" style={{ animationDelay: '300ms' }}>
                    <SectionHeader
                        title="Top 10 Xem Nhiều"
                        subtitle="Sản phẩm đang được quan tâm nhất"
                        icon={Eye}
                        gradientClass="bg-gradient-to-b from-violet-500 to-indigo-600"
                        linkTo="/search"
                    />
                    <HorizontalProductList products={mostViewed} loading={mostViewedLoading} />
                </section>

                {/* Khuyến Mãi */}
                {homeData.saleProducts?.length > 0 && (
                    <section className="opacity-0 animate-fade-in" style={{ animationDelay: '400ms' }}>
                        <SectionHeader
                            title="Khuyến Mãi Cực Hot"
                            subtitle="Ưu đãi giới hạn — săn ngay kẻo lỡ"
                            icon={Zap}
                            gradientClass="bg-gradient-to-b from-red-500 to-rose-500"
                            linkTo="/search"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                            {homeData.saleProducts.map((product, i) => (
                                <ProductCard key={product._id} product={product} index={i} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Sản Phẩm Mới */}
                {homeData.newProducts?.length > 0 && (
                    <section className="opacity-0 animate-fade-in" style={{ animationDelay: '500ms' }}>
                        <SectionHeader
                            title="Sản Phẩm Mới"
                            subtitle="Cập nhật mới nhất từ các thương hiệu lớn"
                            icon={Gamepad2}
                            gradientClass="bg-gradient-to-b from-indigo-600 to-violet-600"
                            linkTo="/search"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                            {homeData.newProducts.map((product, i) => (
                                <ProductCard key={product._id} product={product} index={i} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Bán Chạy (Featured) */}
                {homeData.featuredProducts?.length > 0 && (
                    <section className="opacity-0 animate-fade-in" style={{ animationDelay: '600ms' }}>
                        <SectionHeader
                            title="Nổi Bật"
                            subtitle="Được chọn lọc kỹ lưỡng từ đội ngũ chuyên gia"
                            icon={Trophy}
                            gradientClass="bg-gradient-to-b from-amber-400 to-orange-500"
                            linkTo="/search"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
                            {homeData.featuredProducts.map((product, i) => (
                                <ProductCard key={product._id} product={product} index={i} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Home;
