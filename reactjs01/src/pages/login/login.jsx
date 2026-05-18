import React, { useContext } from 'react';
import { Button, Form, Input, notification, Row, Col, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from '../../util/axios-customize';
import { AuthContext } from '../../context/auth.context';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        const res = await axios.post('/v1/api/login', values);
        if (res && res.data && res.data.EC === 0) {
            localStorage.setItem("access_token", res.data.access_token);
            setAuth({
                isAuthenticated: true,
                user: {
                    email: res.data.user.email,
                    name: res.data.user.name
                }
            });
            notification.success({
                message: "Đăng nhập",
                description: "Thành công"
            });
            navigate("/");
        } else {
            notification.error({
                message: "Đăng nhập",
                description: res.data.EM
            });
        }
    };

    return (
        <div style={{ margin: "50px" }}>
            <Row justify="center">
                <Col xs={24} md={12}>
                    <Divider>Đăng nhập</Divider>
                    <Form name="login" onFinish={onFinish} layout="vertical">
                        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Login</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default LoginPage;