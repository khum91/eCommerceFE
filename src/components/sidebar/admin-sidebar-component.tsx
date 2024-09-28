import { useContext, useEffect, useState } from "react";
import { FaCog, FaHome, FaImages, FaShoppingBag, FaShoppingCart, FaSitemap, FaUsers } from "react-icons/fa";
import { FaB } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import AuthContext from "../../context/auth.context";

const MenuList = [{
    name: 'Home',
    url: '/',
    icon: <FaHome className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
},
{
    name: 'Dashboard',
    url: '/dashboard',
    icon: <FaCog className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
},
{
    name: 'Banner Management',
    url: '/dashboard/banner',
    icon: <FaImages className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
},
{
    name: 'Brand Management',
    url: '/dashboard/brand',
    icon: <FaB className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
},
{
    name: 'Catagory Management',
    url: '/dashboard/category',
    icon: <FaSitemap className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
},
{
    name: 'Users Management',
    url: '/dashboard/user',
    icon: <FaUsers className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
},
{
    name: 'Product Management',
    url: '/dashboard/product',
    icon: <FaShoppingBag className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
},
{
    name: 'Order Management',
    url: '/dashboard/order',
    icon: <FaShoppingCart className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
}]


const AdminSidebarComponent = () => {
    const auth: any = useContext(AuthContext)
    const [List, setList] = useState<any>()
    useEffect(() => {
        if (auth.loggedInUser) {
            switch (auth.loggedInUser.role) {
                case 'seller':
                    setList(MenuList.filter(user => user.name !== 'Banner Management' && user.name !== 'Users Management'));
                    break;
                case 'admin':
                    setList(MenuList)
                    break;
                default:
                    setList('')
                    break;
            }
        }
    }, [auth])

    return (<>
        <aside
            className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
            aria-label="Sidenav"
            id="drawer-navigation"
        >
            <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
                <ul className="space-y-2">
                    <ul className="space-y-2">
                        {
                            List && List.map((item: any, ind: number) => (
                                <li key={ind}>
                                    <NavLink
                                        to={item.url}
                                        className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                    >
                                        {item.icon}
                                        <span className="ml-3">{item.name}</span>
                                    </NavLink>
                                </li>
                            ))
                        }
                    </ul>
                </ul>
            </div>
        </aside>
    </>)
}
export default AdminSidebarComponent;