import { Badge, Pagination, Table, TextInput } from "flowbite-react"
import { useCallback, useEffect, useState } from "react"
import { FaPlus, FaSearch } from "react-icons/fa"
import { NavLink } from "react-router-dom"
import { toast } from "react-toastify"
import TableActionButton from "../../../components/common/table/action.button.component"
import { TableRowSkeleton } from "../../../components/common/table/skeleton.component"
import { errorNotice } from "../../../utilities/notification"
import brandService from "./brand.service"


const AdminBrandList = () => {
    const [paginationData, setPaginationData] = useState({
        currentPage: 1,
        totalpages: 1

    });
    const limit = 5
    const [brand, setBrand] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>()


    const onPageChange = (page: number) => {
        setPaginationData({
            ...paginationData,
            currentPage: page
        })
        loadAllBrands({
            currentPage: page,
            lim: limit,
            search: null
        })
    }
    const loadAllBrands = async ({ currentPage = 1, lim = limit, search = '' }: { currentPage?: number, lim?: number, search?: string | null }) => {
        setLoading(true)
        try {
            const response: any = await brandService.getRequest('/brand', { auth: true, params: { limit: lim, page: currentPage, search: search } })
            setBrand(response.result)
            setPaginationData({
                ...paginationData,
                currentPage: response.meta.currentPage,
                totalpages: response.meta.totalPages
            })
        } catch (exception) {
            console.error(exception)
            toast.error('Brand can not be loaded. Please reload the page.')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        loadAllBrands({
            currentPage: 1,
            lim: limit,
            search: keyword
        })
    }, [])

    // debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            loadAllBrands({
                currentPage: 1,
                lim: 5,
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
            const response: any = await brandService.deleteRequest('/brand/' + id, { auth: true })
            if (response.result == 'notallowed') {
                errorNotice('You cannot modify entities created by others', 3000)
                return
            }
            toast.success('Brand deleted successfully.')

        } catch (exception) {
            console.log(exception)
            toast.error('Brand can not be deleted at this moment.')

        } finally {
            loadAllBrands({
                currentPage: 1,
                lim: 10
            })
            setLoading(false)
        }
    }, [])

    return (<>
        <div className="flex justify-between border-b border-gray-700 m-3 py-3">
            <h1 className="font-semibold text-3xl">
                Brand List Page
            </h1>
            <NavLink to={'/dashboard/brand/create'} className={'flex text-center text-white bg-teal-500 rounded-md p-2 items-center h-min'}>
                <FaPlus /> Add Brand
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
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Name</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Featured</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">status</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">image</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">
                        actions
                    </Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                    {
                        loading ? <>
                            <TableRowSkeleton row={4} col={5} />
                        </> : (brand ? <>
                            {
                                brand.map((row: any, indx: number) => (
                                    <Table.Row key={indx} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {row.name} </Table.Cell>

                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {row.isFeatured ? 'Yes' : 'No'} </Table.Cell>

                                        <Table.Cell className="flex flex-wrap">
                                            <Badge size={'sm'} color={row.status === 'active' ? 'green' : 'red'} >
                                                {row.status === 'active' ? 'Publish' : 'Un Publish'}
                                            </Badge>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <img src={import.meta.env.VITE_IMAGE_URL + '/brands/' + row.image} className="max-w-24" />
                                        </Table.Cell>

                                        <Table.Cell className='inline-flex items-center gap-6'>
                                            <TableActionButton
                                                deleteAction={deleteData}
                                                id={row._id}
                                                editUrl={'/dashboard/brand/' + row._id + '/edit'} />
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            }


                        </> : <>Add some Brand</>)
                    }

                </Table.Body>
            </Table>

            <div className="flex overflow-x-auto sm:justify-end">
                <Pagination currentPage={paginationData.currentPage} totalPages={paginationData.totalpages} onPageChange={onPageChange} showIcons />
            </div>
        </div>
    </>)
}
export default AdminBrandList