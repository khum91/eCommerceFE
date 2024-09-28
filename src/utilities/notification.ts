import Swal from 'sweetalert2'

const successNotice = (text: string, timer: number = 1500) => {
    Swal.fire({
        icon: "success",
        title: `${text}`,
        showConfirmButton: false,
        timer: timer
    });
}
const errorNotice = (text: string, timer: number = 1500) => {
    Swal.fire({
        position: 'top',
        icon: "error",
        title: `${text}`,
        showConfirmButton: false,
        timer: timer
    });
}

export { successNotice, errorNotice }