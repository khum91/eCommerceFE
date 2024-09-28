import "./index.css"
import { HomePageBanner } from "../../components/home/banner.component";
import { Category } from "../../components/market/category";

const LandingPage = () => {
    return (
        <main className=" flex flex-col gap-4 min-h-screen mx-4 my-2">
            <div>
                <HomePageBanner />
            </div>
            <div >
                <Category />
            </div>
        </main>
    )
}
export default LandingPage