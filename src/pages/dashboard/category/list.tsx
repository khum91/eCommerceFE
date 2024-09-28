import { Badge, Pagination, Table, TextInput } from "flowbite-react"
import { useCallback, useEffect, useState } from "react"
import { FaPlus, FaSearch } from "react-icons/fa"
import { NavLink } from "react-router-dom"
import TableActionButton from "../../../components/common/table/action.button.component"
import { TableRowSkeleton } from "../../../components/common/table/skeleton.component"
import dashboardService from "../../../services/service"
import { errorNotice, successNotice } from "../../../utilities/notification"


const CategoryList = () => {
    const [paginationData, setPaginationData] = useState({
        currentPage: 1,
        totalpages: 1
    });
    const limit = 5
    const [category, setCategory] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>()


    const onPageChange = (page: number) => {
        setPaginationData({
            ...paginationData,
            currentPage: page
        })
        loadCategories({
            currentPage: page,
            lim: limit,
            search: null
        })
    }
    const loadCategories = async ({ currentPage = 1, lim = limit, search = '' }: { currentPage?: number, lim?: number, search?: string | null }) => {
        setLoading(true)
        try {
            const response: any = await dashboardService.getRequest('/category', { auth: true, params: { limit: lim, page: currentPage, search: search } })
            setCategory(response.result)
            setPaginationData({
                ...paginationData,
                currentPage: response.meta.currentPage,
                totalpages: response.meta.totalPages
            })
        } catch (exception) {
            errorNotice('Category can not be loaded. Please reload the page.')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        loadCategories({
            currentPage: 1,
            lim: limit,
            search: keyword
        })
    }, [])

    // debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            loadCategories({
                currentPage: 1,
                lim: limit,
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
            await dashboardService.deleteRequest('/category/' + id, { auth: true })
            successNotice('Category deleted successfully.')
        } catch (exception) {
            errorNotice('Category can not be deleted at this moment.')
        } finally {
            loadCategories({
                currentPage: 1,
                lim: limit
            })
            setLoading(false)
        }
    }, [])

    return (<>
        <div className="flex justify-between border-b border-gray-700 m-3 py-3">
            <h1 className="font-semibold text-3xl">
                Category List Page
            </h1>
            <NavLink to={'/dashboard/category/create'} className={'flex text-center text-white bg-teal-500 rounded-md p-2 items-center h-min'}>
                <FaPlus /> Add Category
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
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Parent</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">Status</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">image</Table.HeadCell>
                    <Table.HeadCell className="bg-slate-800 text-white py-4">
                        Actions
                    </Table.HeadCell>
                </Table.Head>

                <Table.Body className="divide-y">
                    {
                        loading ? <>
                            <TableRowSkeleton row={4} col={5} />
                        </> : (category ? <>
                            {
                                category.map((row: any, indx: number) => (

                                    <Table.Row key={indx} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {row.name}
                                        </Table.Cell>

                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {row.parent ? <> {row.parent.name}</> : <>--</>}
                                        </Table.Cell>

                                        <Table.Cell className="flex flex-wrap">
                                            <Badge size={'sm'} color={row.status === 'active' ? 'green' : 'red'} >
                                                {row.status === 'active' ? 'Publish' : 'Un Publish'}
                                            </Badge>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <img src={import.meta.env.VITE_IMAGE_URL + '/categories/' + row.image} className="max-w-24" />
                                        </Table.Cell>

                                        <Table.Cell className='inline-flex items-center gap-6'>
                                            <TableActionButton
                                                deleteAction={deleteData}
                                                id={row._id}
                                                editUrl={'/dashboard/category/' + row._id + '/edit'} />
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            }
                        </> : <>Add some Category</>)
                    }

                </Table.Body>
            </Table>

            <div className="flex overflow-x-auto sm:justify-end">
                <Pagination currentPage={paginationData.currentPage} totalPages={paginationData.totalpages} onPageChange={onPageChange} showIcons />
            </div>
        </div >
    </>)
}
export default CategoryList