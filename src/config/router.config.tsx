import 'react-toastify/ReactToastify.css'
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import AllowUser from "./permission.config"
import LandingPage from "../pages/landing"
import { ToastContainer } from "react-toastify"
import MyProfile from '../pages/profile/profile'
import CartList from "../components/market/cart"
import Invoice from '../components/market/invoice'
import ChatListView from "../pages/chat/chat.page"
import { AuthProvider } from "../context/auth.context"
import CategoryListPage from "../components/market/slug"
import HomePagelayout from "../layouts/home-layout-page"
import { ErrorPage } from "../pages/error/not-found-page"
import { GoogleOAuthProvider } from '@react-oauth/google'
import AdminPagelayout from "../layouts/admin-layout-page"
import Order from '../components/market/customer/orderlist'
import OrderView from '../components/market/customer/view'
import { OrderEdit, OrderList } from "../pages/dashboard/order"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import SingleProduct from "../components/market/single-product"
import CategoryDetailPage from "../components/market/offerlist"
import { getLoggedInUserFromReducer } from "../reducer/auth.reducer"
import { UserCreate, UserEdit, UserList } from "../pages/dashboard/user"
import AdminDashboard from "../pages/dashboard/admin-dashboard-component"
import LoadingComponent from "../components/common/loading/loading.component"
import { ActivationPage, LoginPageComponent, RegisterUser } from "../pages/auth"
import { ProductCreate, ProductEdit, ProductList } from "../pages/dashboard/product"
import { CategoryCreate, CategoryEdit, CategoryList } from "../pages/dashboard/category"
import { AdminBrandCreate, AdminBrandEdit, AdminBrandList } from "../pages/dashboard/brand"
import { AdminBannerCreate, AdminBannerEdit, AdminBannerList } from "../pages/dashboard/banner"

const RouterConfig = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('at') || null
        if (token) {
            dispatch(getLoggedInUserFromReducer())
        }
        setLoading(false)

    }, [])


    return (<>
        {
            loading ? <LoadingComponent /> : <>
                <GoogleOAuthProvider clientId="86366447182-j5999gt98nf2i4mrb1qbats99rggpmt3.apps.googleusercontent.com">
                    <AuthProvider>
                        <>
                            <ToastContainer
                                theme="colored"
                            />
                            <BrowserRouter>
                                <Routes>
                                    <Route path="/" element={<HomePagelayout />}>
                                        <Route index element={<LandingPage />} />
                                        <Route path="/register" element={<RegisterUser />} />
                                        <Route path="/login" element={<LoginPageComponent />} />
                                        <Route path="/auth/activate/:token" element={<ActivationPage />} />
                                        <Route path="/category/:slug" element={<CategoryListPage />} />
                                        <Route path="/:slug/:id" element={<CategoryDetailPage />} />
                                        <Route path="/product/:id" element={<SingleProduct />} />
                                        <Route path="/cart" element={<CartList />} />
                                        <Route path="/invoice" element={<Invoice />} />
                                        <Route path="/buy/:id" element={<SingleProduct />} />
                                        <Route path="/chat" element={<ChatListView />} />
                                        <Route path="/me" element={<MyProfile />} />
                                        <Route path="/orders" element={<AllowUser allowuser={['customer']}> <Order /></AllowUser>} />
                                        <Route path="/order/:id/view" element={<AllowUser allowuser={['customer']}> <OrderView /></AllowUser>} />
                                    </Route>

                                    <Route>
                                        <Route path="*" element={<ErrorPage url='/' redirectedText='Go Back to Home Page.' />} />
                                        <Route path="*" element={<ErrorPage url='/dashboard' redirectedText="Go Back to Dashboard." />} />
                                    </Route>

                                    <Route path="/dashboard" element={<AllowUser allowuser={['admin', 'seller']}> <AdminPagelayout /></AllowUser>}>
                                        <Route index element={<AdminDashboard />} />

                                        <Route path='banner' element={<AllowUser allowuser={['admin']}> <AdminBannerList /></AllowUser>} />
                                        <Route path="banner/create" element={<AllowUser allowuser={['admin']}><AdminBannerCreate /></AllowUser>} />
                                        <Route path="banner/:id/edit" element={<AllowUser allowuser={['admin']}><AdminBannerEdit /></AllowUser>} />

                                        <Route path='user' element={<AllowUser allowuser={['admin']}> <UserList /></AllowUser>} />
                                        <Route path="user/create" element={<AllowUser allowuser={['admin']}><UserCreate /></AllowUser>} />
                                        <Route path="user/:id/edit" element={<AllowUser allowuser={['admin']}><UserEdit /></AllowUser>} />

                                        <Route path="brand" element={<AdminBrandList />} />
                                        <Route path="brand/create" element={<AdminBrandCreate />} />
                                        <Route path="brand/:id/edit" element={<AdminBrandEdit />} />

                                        <Route path="category" element={<CategoryList />} />
                                        <Route path="category/create" element={<CategoryCreate />} />
                                        <Route path="category/:id/edit" element={<CategoryEdit />} />

                                        <Route path="product" element={<ProductList />} />
                                        <Route path="product/create" element={<ProductCreate />} />
                                        <Route path="product/:id/edit" element={<ProductEdit />} />

                                        <Route path="order" element={<OrderList />} />
                                        <Route path="order/:id/edit" element={<OrderEdit />} />
                                    </Route>
                                </Routes>
                            </BrowserRouter>
                        </>
                    </AuthProvider>
                </GoogleOAuthProvider>
            </>
        }


    </>)
}
export default RouterConfig