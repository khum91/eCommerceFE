import { HomePageBanner } from "../../components/banner/banner.component";
import { CardWithImage } from "../../components/common/card/single.card";
import HomePageTitle from "../../components/common/title/home-title.component";
import SingleProductComponent from '../../components/product/single-product.component'
import "./index.css"

const LandingPage = () => {

    return (
        <>
            <main>
                <div>
                    <HomePageBanner />
                </div>
                <HomePageTitle title="Catagories" url="/catagories" />
                <div className="grid grid-flow-row items-center  xs:grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 md:grid-cols-4 object-scale-down  py-3 gap-5 mt-2">
                    {
                        [...Array(6)].map((_, i: number) => (<CardWithImage title="Mobiles" image="https://static-01.daraz.com.np/p/6df819a31341258c21758ffefee46f2d.jpg" url="/catagory/samsung" key={i}/>))
                    }

                </div>

                <HomePageTitle title="Just For You" url="/all-products" />
                <div className="grid grid-flow-row items-center xs:grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 md:grid-cols-4 object-scale-down  py-3 gap-5 mt-2">
                    {
                        [...Array(15)].map((_, i: number) => (<SingleProductComponent key={i} />))
                    }

                </div>
            </main>
        </>
    )
}
export default LandingPage