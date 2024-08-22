import { Card } from "flowbite-react";
import { FaMoneyBill, FaShoppingBag, FaThumbtack, FaUsers } from "react-icons/fa";


const AdminDashboard = () => {
    return (<>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div
                className="border-gray-300 rounded-lg dark:border-gray-600"
            >
                <Card className="max-w-sm bg-teal-300">
                    <h5 className="flex  justify-between text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Customers<FaUsers></FaUsers>
                    </h5>
                    <strong className="text-2xl text-gray-700 dark:text-gray-400">
                        1000
                    </strong>
                </Card>

            </div>
            <div
                className="rounded-lg border-gray-300 dark:border-gray-600"
            >  <Card className="max-w-sm bg-sky-400">
                    <h5 className="flex  justify-between text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Products<FaShoppingBag></FaShoppingBag>
                    </h5>
                    <strong className="text-2xl text-gray-700 dark:text-gray-400">
                        25,000
                    </strong>
                </Card>
            </div>
            <div
                className="rounded-lg border-gray-300 dark:border-gray-600"
            ><Card className="max-w-sm bg-orange-400">
                    <h5 className="flex  justify-between text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Income<FaMoneyBill />
                    </h5>
                    <strong className="text-2xl text-gray-700 dark:text-gray-400">
                        {
                            new Intl.NumberFormat('np', { style: "currency", currency: "Npr" }).format(12457896)
                        }
                    </strong>
                </Card></div>
            <div
                className="rounded-lg border-gray-300 dark:border-gray-600"
            ><Card className="max-w-sm bg-slate-400">
                    <h5 className="flex  justify-between text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        New Orders<FaThumbtack /></h5>
                    <strong className="text-2xl text-gray-700 dark:text-gray-400">
                       12
                    </strong>
                </Card></div>
        </div>
        <div
            className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"
        ></div>
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div
                className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"
            ></div>
            <div
                className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"
            ></div>
            <div
                className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"
            ></div>
            <div
                className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"
            ></div>
        </div>
        <div
            className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"
        ></div>
        <div className="grid grid-cols-2 gap-4">
            <div
                className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"
            ></div>
            <div
                className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"
            ></div>
            <div
                className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"
            ></div>
            <div
                className="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"
            ></div>
        </div>
    </>)
}
export default AdminDashboard;