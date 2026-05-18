import axios from '../util/axios-customize';

/**
 * Lấy danh sách sản phẩm có phân trang (Lazy Loading)
 * @param {Object} params - URLSearchParams hoặc object query
 * @returns {Promise} { data, total, currentPage, totalPages }
 */
export const getProductsAPI = (params) => {
    return axios.get(`/v1/api/products?${params.toString()}`);
};

/**
 * Lấy dữ liệu sản phẩm trang Home (new, featured, sale)
 * @returns {Promise} { newProducts, featuredProducts, saleProducts }
 */
export const getHomeProductsAPI = () => {
    return axios.get('/v1/api/products/home');
};

/**
 * Lấy chi tiết một sản phẩm
 * @param {string} id - Product ID
 */
export const getProductDetailAPI = (id) => {
    return axios.get(`/v1/api/products/${id}`);
};

/**
 * Lấy sản phẩm liên quan
 * @param {string} id - Product ID
 */
export const getRelatedProductsAPI = (id) => {
    return axios.get(`/v1/api/products/${id}/related`);
};

/**
 * Top 10 sản phẩm bán chạy nhất (theo field `sold`)
 * @returns {Promise} { data: Product[] }
 */
export const getTopSellingProductsAPI = () => {
    return axios.get('/v1/api/products/top-selling');
};

/**
 * Top 10 sản phẩm được xem nhiều nhất (theo field `views`)
 * @returns {Promise} { data: Product[] }
 */
export const getMostViewedProductsAPI = () => {
    return axios.get('/v1/api/products/most-viewed');
};
