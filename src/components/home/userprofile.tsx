
import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarToggle } from "flowbite-react";
import { useGetLoggedInUserQuery } from "../../pages/auth/auth.api";
import logOut from "../../pages/auth/logout/logout";

export function UserProfile() {
    const { data } = useGetLoggedInUserQuery();
    let auth = data?.result
    let iurl = import.meta.env.VITE_IMAGE_URL + '/users/' + auth.image
    if (!auth.image) {
        iurl = 'https://placehold.co/400x400?text=User'
    }
    return (
        <Navbar fluid rounded>
            <div className="flex md:order-2">
                <Dropdown arrowIcon={false} inline label={<Avatar alt="User settings" img={iurl} rounded />} >
                    <DropdownHeader>
                        <span className="block text-sm">{auth.name}</span>
                        <span className="block truncate text-sm font-medium">{auth.email}</span>
                    </DropdownHeader>
                    {
                        (auth.role === 'customer') ? <>
                            <DropdownItem href="/orders">My Orders</DropdownItem>
                        </> : <>
                            <DropdownItem href="/dashboard">Dashboard</DropdownItem>
                        </>
                    }
                    <DropdownItem href="/me">Settings</DropdownItem>
                    <DropdownDivider />
                    <DropdownItem onClick={logOut}>Sign out</DropdownItem>
                </Dropdown>
                <NavbarToggle />
            </div>
        </Navbar>
    );
}
