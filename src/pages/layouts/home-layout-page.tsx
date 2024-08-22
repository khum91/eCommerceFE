import { Outlet } from "react-router-dom"
import { HomePageHeader } from "../../components/header/herader.components"

const HomePagelayout = () => {
    return (<>
        <div className="flex-col mx-5">
            <header>
                <HomePageHeader />
            </header>
            <main>
                <Outlet />
            </main>
            <footer className="bg-slate-100 mt-10 py-5 static">
                <p className="text-center">
                    &copy; All rights reserved. Design and Developed by
                    <a href="https://broadwayinfosys.com">Broadway Infosys Learner Team</a>
                </p>

            </footer>
        </div>




    </>)

}
export default HomePagelayout