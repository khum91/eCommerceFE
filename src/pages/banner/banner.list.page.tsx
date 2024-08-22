import { FaPlus, FaSearch } from "react-icons/fa"
import { NavLink } from "react-router-dom"
import { Table, Pagination, TextInput, Badge } from "flowbite-react"
import { useEffect, useState, useCallback } from "react"
import { TableRowSkeleton } from "../../components/common/table/skeleton.component"
import { toast } from "react-toastify"
import bannerService from "./banner.service"
import TableActionButton from "../../components/common/table/action.button.component"


const AdminBannerList = () => {
    const [paginationData, setPaginationData] = useState({
        currentPage: 1,
        totalpages: 1

    });

    const [banner, setBanner] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>()


    const onPageChange = (page: number) => {
        setPaginationData({
            ...paginationData,
            currentPage: page
        })
        loadAllBanners({
            currentPage: page,
            limit: 2,
            search: null
        })
    }
    const loadAllBanners = useCallback(async ({ currentPage = 1, limit = 10, search = '' }: { currentPage?: number, limit?: number, search?: string | null }) => {
        setLoading(true)
        try {
            const response: any = await bannerService.getRequest('/banner', { auth: true, params: { limit: limit, page: currentPage, search: search } })
            setBanner(response.result)
            setPaginationData({
                ...paginationData,
                currentPage: response.meta.currentPage,
                totalpages: response.meta.totalPages
            })
        } catch (exception) {
            console.error(exception)
            toast.error('Banner can not be loaded. Please reload the page.')
        } finally {
            setLoading(false)
        }
    }, [paginationData, keyword])

    useEffect(() => {
        loadAllBanners({
            currentPage: 1,
            limit: 5
        })
    }, [])

    // debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            loadAllBanners({
                currentPage: 1,
                limit: 5,
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
            await bannerService.deleteRequest('/banner/' + id, { auth: true })
            toast.success('Banner deleted successfully.')

        } catch (exception) {
            console.log(exception)
            toast.error('Banner can not be deleted at this moment.')

        } finally {
            loadAllBanners({
                currentPage: 1,
                limit: 10
            })
            setLoading(false)
        }
    }, [])

    return (<>
        <div className="flex justify-between border-b border-gray-700 my-3">
            <h1 className="font-semibold text-3xl py-5">
                Banner List Page
            </h1>
            <NavLink to={'/admin/banner/create'} className={'flex text-center text-white bg-teal-500 rounded-md p-2 mb-3'}>
                <FaPlus />Add Banner
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
                    <Table.HeadCell className="bg-slate-800 text-white py-4">link</Table.HeadCell>
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
                        </> : (banner ? <>
                            {
                                banner.map((row: any, indx: number) => (
                                    <Table.Row key={indx} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {row.name} </Table.Cell>
                                        <Table.Cell><a className="font-medium text-teal-600 hover:underline hover:text-teal-400" href={row.link} target="_blank">{row.link}</a></Table.Cell>

                                        <Table.Cell className="flex flex-wrap">
                                            <Badge size={'sm'} color={row.status === 'active' ? 'green' : 'red'} >
                                                {row.status === 'active' ? 'Publish' : 'Un Publish'}
                                            </Badge>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <img src={import.meta.env.VITE_IMAGE_URL + '/banners/' + row.image} className="max-w-24" />
                                        </Table.Cell>

                                        <Table.Cell className='inline-flex items-center gap-6'>
                                            <TableActionButton
                                                deleteAction={deleteData}
                                                id={row._id}
                                                editUrl={'/admin/banner/' + row._id + '/edit'} />
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            }


                        </> : <>Add some Banner</>)
                    }

                </Table.Body>
            </Table>

            <div className="flex overflow-x-auto sm:justify-end">
                <Pagination currentPage={paginationData.currentPage} totalPages={paginationData.totalpages} onPageChange={onPageChange} showIcons />
            </div>
        </div>
    </>)
}
export default AdminBannerList