import Swal from "sweetalert2";
import { FaPen, FaTrash } from "react-icons/fa"
import { NavLink } from "react-router-dom";



const TableActionButton = ({ deleteAction, id, editUrl }: { deleteAction: any, id: string, editUrl:string }) => {



    const handleDelete = async (e: any) => {
        e.preventDefault();
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            })
            if (result.isConfirmed) {
                deleteAction(id)
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        } catch (error) {

        }
    }

    return (<>
        <NavLink to={editUrl} className="font-medium rounded-full h-8 w-8 bg-teal-600 text-white text-center p-2">
            <FaPen />
        </NavLink>
        <a onClick={handleDelete} className="font-medium rounded-full h-8 w-8 bg-red-600 text-white text-center p-2">
            <FaTrash />
        </a>
    </>)
}

export default TableActionButton