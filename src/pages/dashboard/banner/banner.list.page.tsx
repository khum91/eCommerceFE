import { Badge, Pagination, Table, TextInput } from "flowbite-react"
import { useCallback, useEffect, useState } from "react"
import { FaPlus, FaSearch } from "react-icons/fa"
import { NavLink } from "react-router-dom"
import { toast } from "react-toastify"
import TableActionButton from "../../../components/common/table/action.button.component"
import { TableRowSkeleton } from "../../../components/common/table/skeleton.component"
import bannerService from "./banner.service"


const AdminBannerList = () => {
    const [paginationData, setPaginationData] = useState({
        currentPage: 1,
        totalpages: 1

    });
    const limit = 5
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
            lim: limit,
            search: null
        })
    }
    const loadAllBanners =async ({ currentPage = 1, lim = limit, search = '' }: { currentPage?: number, lim?: number, search?: string | null }) => {
        setLoading(true)
        try {
            const response: any = await bannerService.getRequest('/banner', { auth: true, params: { limit: lim, page: currentPage, search: search } })
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
    }

    useEffect(() => {
        loadAllBanners({
            currentPage: 1,
            lim: limit,
            search: keyword
        })
    }, [])
    // debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            loadAllBanners({
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
            await bannerService.deleteRequest('/banner/' + id, { auth: true })
            toast.success('Banner deleted successfully.')

        } catch (exception) {
            console.log(exception)
            toast.error('Banner can not be deleted at this moment.')

        } finally {
            loadAllBanners({
                currentPage: 1,
                lim: limit
            })
            setLoading(false)
        }
    }, [])

    return (<>
        <div className="flex justify-between border-b border-gray-700 m-3 py-3">
            <h1 className="font-semibold text-3xl">
                Banner List Page
            </h1>
            <NavLink to={'/dashboard/banner/create'} className={'flex text-center text-white bg-teal-500 rounded-md p-2 items-center h-min'}>
                <FaPlus /> Add Banner
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
                                                editUrl={'/dashboard/banner/' + row._id + '/edit'} />
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