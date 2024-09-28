import 'flowbite'
import AdminSidebarComponent from '../components/sidebar/admin-sidebar-component';
import { Outlet } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
const AdminPagelayout = () => {
    return (<>
        <div className="antialiased bg-gray-50 dark:bg-gray-900">
            <NavLink to="/" className="bg-white border-b border-gray-200 py-3 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50
            flex items-center gap-10 justify-center mr-4">
                <img
                    src="https://broadwayinfosys.com/uploads/logo/1705900306_15549.svg"
                    className="mr-3 h-10"
                    alt="Broadway Logo"
                />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Dashboard</span>
            </NavLink>
            <AdminSidebarComponent />
            <main className="p-4 md:ml-64 h-auto pt-20">
                <Outlet />
            </main>
        </div>
    </>)
}
export default AdminPagelayout;