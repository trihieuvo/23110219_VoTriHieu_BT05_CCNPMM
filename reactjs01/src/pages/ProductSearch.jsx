import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../util/axios-customize';
import ProductCard from '../components/common/ProductCard';
import FilterSidebar from '../components/common/FilterSidebar';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, Package } from 'lucide-react';

const ProductSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const keyword = searchParams.get('keyword') || '';
    const sort = searchParams.get('sort') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams(searchParams);
                const res = await axios.get(`/v1/api/products?${params.toString()}`);
                
                if (res && res.data) {
                    setProducts(res.data.products);
                    setPagination({
                        page: res.data.page,
                        totalPages: res.data.totalPages,
                        total: res.data.total
                    });
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        window.scrollTo(0, 0);
    }, [searchParams]);

    const handleSortChange = (e) => {
        const newParams = new URLSearchParams(searchParams);
        if (e.target.value) {
            newParams.set('sort', e.target.value);
        } else {
            newParams.delete('sort');
        }
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('page', newPage.toString());
            setSearchParams(newParams);
        }
    };

    return (
        <div className="bg-gray-50 py-8 min-h-screen">
            <div className="container mx-auto px-4">
                {/* Search Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between animate-fade-in">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            {keyword ? <>Kết quả cho "<span className="text-indigo-600">{keyword}</span>"</> : 'Tất cả sản phẩm'}
                        </h1>
                        <p className="text-sm text-gray-400">{pagination.total} sản phẩm được tìm thấy</p>
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
                        {loading ? (
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
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                                    {products.map((product, i) => (
                                        <ProductCard key={product._id} product={product} index={i} />
                                    ))}
                                </div>
                                
                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex justify-center mt-14 mb-8">
                                        <nav className="flex items-center space-x-1.5">
                                            <button 
                                                onClick={() => handlePageChange(pagination.page - 1)}
                                                disabled={pagination.page === 1}
                                                className="p-2.5 border border-gray-200 rounded-xl text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 transition-all"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                            
                                            {[...Array(pagination.totalPages)].map((_, i) => (
                                                <button
                                                    key={i + 1}
                                                    onClick={() => handlePageChange(i + 1)}
                                                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                                        pagination.page === i + 1 
                                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25' 
                                                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                                                    }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                            
                                            <button 
                                                onClick={() => handlePageChange(pagination.page + 1)}
                                                disabled={pagination.page === pagination.totalPages}
                                                className="p-2.5 border border-gray-200 rounded-xl text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 transition-all"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </>
                        ) : (
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
