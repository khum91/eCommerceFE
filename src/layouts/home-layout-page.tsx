import { Outlet } from "react-router-dom"
import HomeNav from "../components/home/nav"
import HomeFooter from "../components/home/footer"

const HomePagelayout = () => {
    return (<>
        <header>
            <HomeNav />
        </header>
        <main >
            <Outlet />
        </main>
        <footer>
            <HomeFooter />
        </footer>
    </>)
}
export default HomePagelayout