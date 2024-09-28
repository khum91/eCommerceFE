export default function HomeFooter() {
    return (
        <div className="bg-gray-200 py-2 text-center">
            <div className="container mx-auto flex flex-col md:flex-row justify-between px-4">
                <div id="about" className="mb-6 md:mb-0 w-1/2">
                    <h3 className="text-lg font-semibold mb-2">About Us</h3>
                    <p className="text-justify">
                        Welcome to our Superstore, the ultimate destination for all things electronics! At our electronic superstore, we’re passionate about bringing you the latest and greatest in tech, from cutting-edge gadgets to everyday essentials.

                        Founded with a commitment to innovation and customer satisfaction, we offer an extensive range of products including smartphones, laptops, home appliances, gaming gear, and much more. Our dedicated team of experts is always on the lookout for the newest releases and hottest trends, ensuring you have access to the best technology on the market.
                    </p>
                </div>
                <div id="contact" className="mb-6 md:mb-0">
                    <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
                    <p>Address: 123 Supermarket, Gandaki Province, Kaski, 3800</p>
                    <p>Phone: (123) 456-7890</p>
                    <p>Email: info@market.com</p>
                </div>
                <div className="mb-6 md:mb-0">
                    <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
                    <a href="https://facebook.com/khbdch" target="_blank" className="block text-blue-600 hover:underline mb-1">Facebook</a>
                    <a href="https://x.com/farmname" target="_blank" className="block text-black hover:underline mb-1"> x.com!</a>
                    <a href="https://instagram.com/farmname" target="_blank" className="block text-pink-600 hover:underline">Instagram</a>
                </div>
            </div>
            <div className="bg-gray-300 py-3 mt-8">
                &copy; All rights reserved. Design and Developed by
                <a href="https://broadwayinfosys.com">Broadway Infosys Learner Team</a>
            </div>
        </div>
    );
}
