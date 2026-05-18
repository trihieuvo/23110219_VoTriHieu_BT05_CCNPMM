import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useContext } from "react";
import LoginPage from "./pages/login/login";
import RegisterPage from "./pages/register/register";
import UserPage from "./pages/user";
import Header from "./components/layout/header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import ProductSearch from "./pages/ProductSearch";
import axios from "./util/axios-customize";
import { AuthContext } from "./context/auth.context";

function App() {
  const { setAuth } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await axios.get('/v1/api/account');
        if (res && res.data) {
          setAuth({
            isAuthenticated: true,
            user: {
              email: res.data.email,
              name: res.data.name
            }
          })
        }
      } catch (error) {
        console.log("Chưa đăng nhập hoặc token hết hạn");
      }
    }
    if (localStorage.getItem('access_token')) {
      fetchAccount();
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/search" element={<ProductSearch />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;