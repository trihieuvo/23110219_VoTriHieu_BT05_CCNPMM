import React, { useEffect, useState } from 'react';
import { Table, notification } from 'antd';
import axios from '../util/axios-customize';

const UserPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    // Định nghĩa các cột cho Table Ant Design
    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        }
    ];

    // Hàm gọi API lấy danh sách user
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/v1/api/user');
            if (res && res.data && Array.isArray(res.data)) {
                setDataSource(res.data);
            } else {
                notification.error({
                    message: "Lỗi dữ liệu",
                    description: "Dữ liệu trả về từ server không hợp lệ (không phải là danh sách)"
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi tải dữ liệu",
                description: error?.response?.data?.message || "Có lỗi xảy ra khi lấy danh sách user"
            });
        }
        setLoading(false);
    };

    // Chạy fetchUsers ngay khi component được mount
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Danh sách người dùng</h2>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey="_id" // Sử dụng _id của MongoDB làm key cho mỗi dòng
                bordered
                loading={loading}
            />
        </div>
    );
};

export default UserPage;