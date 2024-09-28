import { Badge, Pagination, Table, TextInput } from "flowbite-react"
import { useCallback, useEffect, useState } from "react"
import { FaPlus, FaSearch } from "react-icons/fa"
import { NavLink } from "react-router-dom"
import TableActionButton from "../../../components/common/table/action.button.component"
import { TableRowSkeleton } from "../../../components/common/table/skeleton.component"
import dashboardService from "../../../services/service"
import formatToNepaliCurrency from "../../../utilities/currency"
import { errorNotice, successNotice } from "../../../utilities/notification"

const ProductList = () => {
    const [paginationData, setPaginationData] = useState({
        currentPage: 1,
        totalpages: 1
    });

    const [product, setProduct] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>()

    const limit = 5
    const onPageChange = (page: number) => {
        setPaginationData({
            ...paginationData,
            currentPage: page
        })
        loadProducts({
            currentPage: page,
            lim: limit,
            search: null
        })
    }

    const loadProducts = async ({ currentPage = 1, lim = limit, search = '' }: { currentPage?: number, lim?: number, search?: string | null }) => {
        setLoading(true)
        try {
            const response: any = await dashboardService.getRequest('/product', { auth: true, params: { limit: lim, page: currentPage, search: search } })
            setProduct(response.result)
            setPaginationData({
                ...paginationData,
                currentPage: response.meta.currentPage,
                totalpages: response.meta.totalPages
            })
        } catch (exception) {
            errorNotice('Product can not be loaded. Please reload the page.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProducts({
            currentPage: 1,
            lim: limit,
            search: keyword
        })
    }, [])

    // debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            loadProducts({
                search: keyword
            })
        }, 1000)
        return () => {
            clearTimeout(handler)
        }

    }, [keyword])

    const deleteData = useCallback(async (id: string) => {
        try {
            setLoading(true)
            await dashboardService.deleteRequest('/product/' + id, { auth: true })
            successNotice('Product deleted successfully.')
        } catch (exception) {
            errorNotice('Product can not be deleted at this moment.')
        } finally {
            loadProducts({
                currentPage: 1,
                lim: limit
            })
            setLoading(false)
        }
    }, [])

    return (<>
        <div className="flex justify-between border-b border-gray-700 m-3 py-3">
            <h1 className="font-semibold text-3xl">
                Product List Page
            </h1>
            <NavLink to={'/dashboard/product/create'} className={'flex text-center text-white bg-teal-500 rounded-md p-2 items-center h-min'}>
                <FaPlus /> Add Product
            </NavLink>
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
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Category</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Name</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Brand</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Seller</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Price</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Status</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">
                        Actions
                    </Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                    {
                        loading ? <>
                            <TableRowSkeleton row={4} col={7} />
                        </> : (product ? <>
                            {
                                product.map((row: any, indx: number) => (
                                    <Table.Row key={indx} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {row.category.name} </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {row.name} </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {row.brand ? <> {row.brand.name}</> : <>No Brand</>}
                                        </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {row.seller.name} </Table.Cell>
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {formatToNepaliCurrency(row.price)}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge size={'sm'} color={row.status === 'active' ? 'green' : 'red'} >
                                                {row.status === 'active' ? 'Publish' : 'Un Publish'}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell className='inline-flex items-center gap-2'>
                                            <TableActionButton
                                                deleteAction={deleteData}
                                                id={row._id}
                                                editUrl={'/dashboard/product/' + row._id + '/edit'} />
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </> : <>Add some Product</>)
                    }

                </Table.Body>
            </Table>

            <div className="flex overflow-x-auto sm:justify-end">
                <Pagination currentPage={paginationData.currentPage} totalPages={paginationData.totalpages} onPageChange={onPageChange} showIcons />
            </div>
        </div >
    </>)
}
export default ProductList