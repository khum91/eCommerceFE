import { NavLink } from 'react-router-dom'
import symBol from '../../assets/images/access-denied.jpg'

export function NoPermission() {
    return (
        <div className="grid h-screen place-content-center bg-white px-4">
            <div className="text-center">
                <img className='mx-auto h-40 w-fit text-black' src={symBol} alt='no permission image' />
                <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Uh-oh!</h1>
                <p className="mt-4 text-gray-500">You do not have permission to access this page.</p>
                <p className="mt-4 text-gray-500"><NavLink to="/">Go Back to Home Page</NavLink></p>
            </div>
        </div>
    )
}

