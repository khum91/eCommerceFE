import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "../pages/landing"
import { RegisterUser, LoginPageComponent, ActivationPage } from "../pages/auth"
import { ErrorPage } from "../pages/error/not-found-page"
import CatagoryDetailPage from "../pages/catagory/catagory-details"
import HomePagelayout from "../pages/layouts/home-layout-page"
import AdminPagelayout from "../pages/layouts/admin-layout-page"
import AdminDashboard from "../pages/dashboard/admin-dashboard-component"
import { ToastContainer } from "react-toastify"
import 'react-toastify/ReactToastify.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "../context/auth.context"
import AllowUser from "./permission.config"
import { AdminBannerList, AdminBannerCreate, AdminBannerEdit } from "../pages/banner"
import { AdminBrandList, AdminBrandCreate, AdminBrandEdit } from "../pages/brand"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { getLoggedInUserFromReducer } from "../reducer/auth.reducer"
import LoadingComponent from "../components/common/loading/loading.component"
import ChatListView from "../pages/chat/chat.page"

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
                                        <Route path="/catagory/:slug" element={<CatagoryDetailPage />} />
                                        <Route path="/chat" element={<ChatListView />} />
                                        <Route path="*" element={<ErrorPage url='/' redirectedText='Go Back to Home Page.' />} />
                                    </Route>

                                    <Route path="/admin" element={<AllowUser allowuser="admin"> <AdminPagelayout /></AllowUser>}>
                                        <Route index element={<AdminDashboard />} />
                                        <Route path="banner" element={<AdminBannerList />} />
                                        <Route path="banner/create" element={<AdminBannerCreate />} />
                                        <Route path="banner/:id/edit" element={<AdminBannerEdit />} />

                                        <Route path="brand" element={<AdminBrandList />} />
                                        <Route path="brand/create" element={<AdminBrandCreate />} />
                                        <Route path="brand/:id/edit" element={<AdminBrandEdit />} />

                                        <Route path="*" element={<ErrorPage url='/admin' redirectedText="Go Back to Dashboard." />} />
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