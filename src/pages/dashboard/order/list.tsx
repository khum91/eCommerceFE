import { NavLink } from "react-router-dom"
import { useEffect, useState } from "react"
import { FaPenSquare, FaSearch } from "react-icons/fa"
import { Pagination, Table, TextInput } from "flowbite-react"
import dashboardService from "../../../services/service"
import { errorNotice } from "../../../utilities/notification"
import { TableRowSkeleton } from "../../../components/common/table/skeleton.component"

const OrderList = () => {
    const [paginationData, setPaginationData] = useState({
        currentPage: 1,
        totalpages: 1
    });

    const [order, setOrder] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>()

    const limit = 5
    const onPageChange = (page: number) => {
        setPaginationData({
            ...paginationData,
            currentPage: page
        })
        loadOrders({
            currentPage: page,
            lim: limit,
            search: null
        })
    }

    const loadOrders = async ({ currentPage = 1, lim = limit, search = '' }: { currentPage?: number, lim?: number, search?: string | null }) => {
        setLoading(true)
        try {
            const response: any = await dashboardService.getRequest('/order', { auth: true, params: { limit: lim, page: currentPage, search: search } })
            setOrder(response.result)
            setPaginationData({
                ...paginationData,
                currentPage: response.meta.currentPage,
                totalpages: response.meta.totalPages
            })
        } catch (exception) {
            errorNotice('Order can not be loaded. Please reload the page.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadOrders({
            currentPage: 1,
            lim: limit,
            search: keyword
        })
    }, [])

    // debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            loadOrders({
                search: keyword
            })
        }, 1000)
        return () => {
            clearTimeout(handler)
        }

    }, [keyword])

    return (<>
        <div className="flex justify-between border-b border-gray-700 m-3 py-3">
            <h1 className="font-semibold text-3xl">
                Order List Page
            </h1>
        </div>
        <div className="overflow-x-auto my-5">

            <div className="flex overflow-x-auto sm: justify-end my-3">
                <TextInput onChange={(e) => {
                    e.preventDefault();
                    setKeyword(e.target.value)
                }} id="email4" type="email" rightIcon={FaSearch} placeholder="search" required className="w-1/4" />
            </div>
            <Table hoverable>
                <Table.Head>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Ordered Number</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Customer Name</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Payment</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Status</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Manage</Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                    {
                        loading ? <>
                            <TableRowSkeleton row={4} col={5} />
                        </> : (order ? <>
                            {
                                order.map((row: any, indx: number) => (
                                    <Table.Row key={indx} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {row._id} </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {row.customer.name}
                                        </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {row.paymentStatus} </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {row.orderStatus} </Table.Cell>
                                        <Table.Cell className='inline-flex items-center gap-2'>
                                            <>
                                                <NavLink to={'/dashboard/order/' + row._id + '/edit'} className="font-medium rounded-full h-8 w-8 bg-teal-600 text-white text-center p-2">
                                                    <FaPenSquare />
                                                </NavLink>
                                            </>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </> : <>Add some Order</>)
                    }
                </Table.Body>
            </Table>
            <div className="flex overflow-x-auto sm:justify-end">
                <Pagination currentPage={paginationData.currentPage} totalPages={paginationData.totalpages} onPageChange={onPageChange} showIcons />
            </div>
        </div >
    </>)
}
export default OrderList