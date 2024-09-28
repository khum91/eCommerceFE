import { Navbar, NavbarCollapse } from "flowbite-react";
import { FaShoppingCart } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { useGetLoggedInUserQuery } from "../../pages/auth/auth.api";
import { shoppingCart } from "../market/cartfunction";
import { UserProfile } from "./userprofile";
import AuthContext from '../../context/auth.context'
import { useContext, useEffect } from "react";

const LinkComponent = ({ text, icon = '', link, action }: { text: string, icon?: any, link: string, action?: any }) => {
    return (<>
        <NavLink onClick={action} to={link} className={({ isActive }) => isActive ? 'text-cyan-600' : '' + 'hover:text-cyan-700 inline-flex items-center gap-1'}>{text}{icon}</NavLink>
    </>)
}

export default function HomeNav() {

    const { data, isLoading } = useGetLoggedInUserQuery();
    if (isLoading) return <>Loading</>
    let auth = data?.result
    let cart = shoppingCart.totalCount()
    return (
        <Navbar fluid rounded>
            <Navbar.Brand href="/">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">My Superstore</span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <NavbarCollapse>
                    {
                        cart > 0 ? <>
                            <NavLink to='/cart' className={({ isActive }) => isActive ? 'text-cyan-600' : '' + 'hover:text-cyan-700 inline-flex items-center gap-1'}>
                                <div className=" flex flex-col items-center">
                                    <div className="font-semibold bg-orange-500 text-white  text-center w-5 rounded-full ">
                                        {cart}
                                    </div>
                                    <div className="">
                                        <FaShoppingCart />
                                    </div>
                                </div>
                            </NavLink>
                        </> : <>
                        </>
                    }
                    {
                        auth && auth ? <>
                            <LinkComponent text={'Chat'} icon={<FaMessage />} link={'/chat'} />
                            <UserProfile />
                        </> : <>
                            <LinkComponent text='Register' icon="&rarr;" link='/register' />
                            <LinkComponent text='Login' icon="&rarr;" link='/login' />
                        </>
                    }
                </NavbarCollapse>
            </div>
            <Navbar.Collapse>
                <LinkComponent text="Home" link="/" />
                <Navbar.Link href="#about">About</Navbar.Link>
                <Navbar.Link href="#contact">Contact</Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}


