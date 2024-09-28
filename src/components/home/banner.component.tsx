import { Carousel } from "flowbite-react";
import { useEffect, useState } from "react";
import bannerService from "../../pages/dashboard/banner/banner.service";

export const HomePageBanner = () => {
    const [bannderData, setBannerData] = useState([])
    let [loading, setLoading] = useState(true)

    const getBanners = async () => {
        try {
            const response: any = await bannerService.getRequest('/banner/list-home');
            setBannerData(response.result);
            setLoading(false)
        } catch (exception) {

        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getBanners()
    }, [loading])

    return (
        <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
            {
                loading ? <>
                    <Carousel slideInterval={1000}>
                        <img src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="..." />
                        <img src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="..." />
                        <img src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
                        <img src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
                        <img src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
                    </Carousel>
                </> : <>
                    <Carousel slideInterval={2000}>
                        {
                            bannderData && bannderData.map((banner: any, ind: number) => (
                                <a href={banner.link} target="_banner" key={ind}>
                                    <img src={import.meta.env.VITE_IMAGE_URL + '/banners/' + banner.image} alt={banner.name} />
                                </a>
                            ))
                        }
                    </Carousel>
                </>
            }
        </div>
    )
}
