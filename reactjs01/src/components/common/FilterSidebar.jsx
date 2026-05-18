import React, { useEffect, useState } from 'react';
import axios from '../../util/axios-customize';

const FilterSidebar = ({ searchParams, setSearchParams }) => {
    const [categories, setCategories] = useState([]);
    
    // State for controlled inputs and sliders
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '0');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '100000000');
    
    const currentCategory = searchParams.get('category') || '';
    const MAX_VAL = 100000000;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('/v1/api/categories');
                if (res && res.data) {
                    setCategories(res.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Update internal state when URL params change (e.g. on clear filters)
    useEffect(() => {
        setMinPrice(searchParams.get('minPrice') || '0');
        setMaxPrice(searchParams.get('maxPrice') || '100000000');
    }, [searchParams]);

    const handleFilterChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const handleApplyPrice = (e) => {
        if (e) e.preventDefault();
        const newParams = new URLSearchParams(searchParams);
        
        if (parseInt(minPrice) > 0) newParams.set('minPrice', minPrice);
        else newParams.delete('minPrice');
        
        if (parseInt(maxPrice) < MAX_VAL) newParams.set('maxPrice', maxPrice);
        else newParams.delete('maxPrice');
        
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        const newParams = new URLSearchParams();
        if (searchParams.get('keyword')) {
            newParams.set('keyword', searchParams.get('keyword'));
        }
        setSearchParams(newParams);
        setMinPrice('0');
        setMaxPrice('100000000');
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">Bộ Lọc</h2>
                <button 
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                    Xóa tất cả
                </button>
            </div>

            {/* Categories */}
            <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">Danh mục</h3>
                <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input 
                            type="radio" 
                            name="category"
                            checked={currentCategory === ''}
                            onChange={() => handleFilterChange('category', '')}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="text-gray-700">Tất cả</span>
                    </label>
                    {categories.map(cat => (
                        <label key={cat._id} className="flex items-center space-x-3 cursor-pointer">
                            <input 
                                type="radio" 
                                name="category"
                                checked={currentCategory === cat._id}
                                onChange={() => handleFilterChange('category', cat._id)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <span className="text-gray-700">{cat.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-semibold text-gray-800 mb-4">Khoảng giá (VNĐ)</h3>
                
                {/* Range Sliders */}
                <div className="space-y-6 mb-6 px-2">
                    <div className="relative h-2 bg-gray-200 rounded-full">
                        <div 
                            className="absolute h-full bg-indigo-500 rounded-full"
                            style={{ 
                                left: `${(parseInt(minPrice) / MAX_VAL) * 100}%`, 
                                right: `${100 - (parseInt(maxPrice) / MAX_VAL) * 100}%` 
                            }}
                        ></div>
                        <input 
                            type="range"
                            min="0"
                            max={MAX_VAL}
                            step="100000"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Math.min(parseInt(e.target.value), parseInt(maxPrice) - 100000).toString())}
                            className="absolute w-full -top-1.5 h-5 bg-transparent appearance-none pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-900 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md"
                        />
                        <input 
                            type="range"
                            min="0"
                            max={MAX_VAL}
                            step="100000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Math.max(parseInt(e.target.value), parseInt(minPrice) + 100000).toString())}
                            className="absolute w-full -top-1.5 h-5 bg-transparent appearance-none pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-900 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md"
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>0đ</span>
                        <span>100tr</span>
                    </div>
                </div>

                <form onSubmit={handleApplyPrice} className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="flex-1">
                            <label className="text-[10px] text-gray-400 uppercase font-bold">Từ</label>
                            <input 
                                type="number" 
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <span className="text-gray-500 mt-4">-</span>
                        <div className="flex-1">
                            <label className="text-[10px] text-gray-400 uppercase font-bold">Đến</label>
                            <input 
                                type="number" 
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    
                    <div className="text-[11px] text-gray-500 italic">
                        {formatCurrency(minPrice)}đ - {formatCurrency(maxPrice)}đ
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                    >
                        Áp dụng
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FilterSidebar;
