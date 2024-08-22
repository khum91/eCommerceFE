import { Navbar, NavbarCollapse } from "flowbite-react";
import { NavLink } from "react-router-dom";
import { useGetLoggedInUserQuery } from "../../pages/auth/auth.api";
import { FaMessage } from "react-icons/fa6";
import logOut from "../../pages/auth/logout/logout";

const LinkComponent = ({ text, icon = '', link, action }: { text: string, icon?: any, link: string, action?: any }) => {
    return (<>
        <NavLink onClick={action} to={link} className={({ isActive }) => isActive ? 'text-cyan-600' : '' + 'hover:text-cyan-700 inline-flex items-center gap-1'}>{text}{icon}</NavLink>
    </>)
}

export function HomePageHeader() {
    const { data, isLoading } = useGetLoggedInUserQuery();
    if (isLoading) return <>Loading</>
    let auth = data?.result;
    // const auth: any = useContext(AuthContext)
    // const auth:any = useSelector((root: any) => {
    //     return root.auth.loggedInUser || null
    // })



    return (
        <Navbar fluid rounded>
            <Navbar.Brand href="/">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <NavbarCollapse>
                    {
                        auth && auth ? <>
                            <LinkComponent text={'Chat'} icon={<FaMessage />} link={'/chat'} />
                            <LinkComponent text={auth.name} icon="&rarr;" link={'/' + auth.role} />
                            <div className=" hover:text-cyan-700 hover:cursor-pointer inline-flex items-center gap-1" onClick={logOut}>Log Out</div>
                            {/* <LinkComponent text='Log Out' action={logOut} icon="&rarr;" link='/' /> */}

                        </> : <>
                            <LinkComponent text='Register' icon="&rarr;" link='/register' />
                            <LinkComponent text='Login' icon="&rarr;" link='/login' />
                        </>
                    }

                </NavbarCollapse>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <LinkComponent text="Home" link="/" />
                <Navbar.Link href="/">About</Navbar.Link>
                <Navbar.Link href="#">Services</Navbar.Link>
                <Navbar.Link href="#">Pricing</Navbar.Link>
                <Navbar.Link href="#">Contact</Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}


