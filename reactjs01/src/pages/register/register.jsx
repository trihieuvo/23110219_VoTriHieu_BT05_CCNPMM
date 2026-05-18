import React from 'react';
import { Button, Form, Input, notification, Row, Col, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from '../../util/axios-customize';

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { name, email, password } = values;
        const res = await axios.post('/v1/api/register', { name, email, password });

        if (res && res.data) {
            notification.success({
                message: "Đăng ký người dùng",
                description: "Thành công"
            });
            navigate("/login");
        } else {
            notification.error({
                message: "Đăng ký người dùng",
                description: "Có lỗi xảy ra"
            });
        }
    };

    return (
        <div style={{ margin: "50px" }}>
            <Row justify="center">
                <Col xs={24} md={12}>
                    <Divider>Đăng ký tài khoản</Divider>
                    <Form name="basic" onFinish={onFinish} layout="vertical">
                        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Register</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default RegisterPage;