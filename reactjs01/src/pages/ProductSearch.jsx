import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { getProductsAPI } from '../services/productService';
import ProductCard from '../components/common/ProductCard';
import FilterSidebar from '../components/common/FilterSidebar';
import { Search, SlidersHorizontal, Package, Loader2 } from 'lucide-react';

const ProductSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Ref để theo dõi searchParams hiện tại, tránh closure stale
    const searchParamsRef = useRef(searchParams);
    searchParamsRef.current = searchParams;

    // IntersectionObserver: theo dõi sentinel element ở cuối danh sách
    const { ref: sentinelRef, inView } = useInView({
        threshold: 0.1,
        rootMargin: '100px',
    });

    const keyword = searchParams.get('keyword') || '';
    const sort = searchParams.get('sort') || '';

    // Fetch trang đầu khi searchParams thay đổi — RESET state
    useEffect(() => {
        const fetchInitial = async () => {
            setInitialLoading(true);
            setProducts([]);
            setCurrentPage(1);
            try {
                const params = new URLSearchParams(searchParams);
                params.set('page', '1');
                const res = await getProductsAPI(params);
                if (res && res.data) {
                    setProducts(res.data.data || []);
                    setTotal(res.data.total || 0);
                    setCurrentPage(res.data.currentPage || 1);
                    setTotalPages(res.data.totalPages || 1);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchInitial();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.toString()]);

    // Fetch trang tiếp theo — APPEND vào state
    const fetchNextPage = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        try {
            const nextPage = currentPage + 1;
            const params = new URLSearchParams(searchParamsRef.current);
            params.set('page', nextPage.toString());
            const res = await getProductsAPI(params);
            if (res && res.data) {
                setProducts((prev) => [...prev, ...(res.data.data || [])]);
                setCurrentPage(res.data.currentPage || nextPage);
                setTotalPages(res.data.totalPages || totalPages);
            }
        } catch (error) {
            console.error('Error fetching next page:', error);
        } finally {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, totalPages, loading]);

    // Khi sentinel đi vào viewport và còn trang tiếp theo — load thêm
    useEffect(() => {
        if (inView && !initialLoading && !loading && currentPage < totalPages) {
            fetchNextPage();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    const handleSortChange = (e) => {
        const newParams = new URLSearchParams(searchParams);
        if (e.target.value) {
            newParams.set('sort', e.target.value);
        } else {
            newParams.delete('sort');
        }
        newParams.delete('page');
        setSearchParams(newParams);
    };

    const hasMore = currentPage < totalPages;

    return (
        <div className="bg-gray-50 py-8 min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between animate-fade-in">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            {keyword ? <>Kết quả cho "<span className="text-indigo-600">{keyword}</span>"</> : 'Tất cả sản phẩm'}
                        </h1>
                        <p className="text-sm text-gray-400">
                            {initialLoading ? 'Đang tải...' : `${total} sản phẩm được tìm thấy`}
                        </p>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                        <button
                            className="md:hidden flex items-center bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:border-indigo-300 transition-colors"
                            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                        >
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Bộ lọc
                        </button>

                        <select
                            value={sort}
                            onChange={handleSortChange}
                            className="border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all cursor-pointer"
                        >
                            <option value="">Mới nhất</option>
                            <option value="price_asc">Giá tăng dần</option>
                            <option value="price_desc">Giá giảm dần</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className={`md:w-1/4 transition-all duration-300 ${isMobileFilterOpen ? 'block' : 'hidden md:block'}`}>
                        <FilterSidebar searchParams={searchParams} setSearchParams={setSearchParams} />
                    </div>

                    {/* Product List */}
                    <div className="md:w-3/4">
                        {/* Initial Loading Skeleton */}
                        {initialLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100">
                                        <div className="h-52 skeleton"></div>
                                        <div className="p-4 space-y-3">
                                            <div className="h-3 w-16 skeleton rounded"></div>
                                            <div className="h-4 w-full skeleton rounded"></div>
                                            <div className="h-4 w-2/3 skeleton rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                {/* Product Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                                    {products.map((product, i) => (
                                        <ProductCard key={`${product._id}-${i}`} product={product} index={i} />
                                    ))}
                                </div>

                                {/* Sentinel + Loading spinner (Lazy Load trigger) */}
                                <div ref={sentinelRef} className="flex flex-col items-center py-10">
                                    {loading && (
                                        <div className="flex flex-col items-center gap-3 animate-fade-in">
                                            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                                            <p className="text-sm text-gray-400">Đang tải thêm sản phẩm...</p>
                                        </div>
                                    )}
                                    {!hasMore && !loading && (
                                        <p className="text-sm text-gray-400 py-4">
                                            ✓ Đã hiển thị tất cả {total} sản phẩm
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Empty State */
                            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center animate-fade-in-up">
                                <div className="bg-gray-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                    <Package className="h-10 w-10 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                                <p className="text-sm text-gray-400 mb-6">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
                                <button
                                    onClick={() => setSearchParams(new URLSearchParams())}
                                    className="text-indigo-600 font-medium hover:text-indigo-700 text-sm bg-indigo-50 px-6 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors"
                                >
                                    Xóa tất cả bộ lọc
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductSearch;
