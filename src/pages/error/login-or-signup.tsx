import { NavLink } from 'react-router-dom'
import symBol from '../../assets/images/login-first.jpeg'

export function LoginFirst() {
    return (
        <div className="grid h-screen place-content-center">
            <div className="inline-flex items-center justify-center gap-2">
                <h1 className=" text-2xl font-bold tracking-tight text-gray-900 ">Uh-oh!</h1>
                <p className=" text-gray-500 text-2xl">You have to Login first.</p>
                <p className=" text-blue-500 text-2xl"><NavLink to="/login">LOGIN</NavLink> OR <NavLink to="/register">SIGNUP</NavLink></p>
                <img className='w-12 h-12 text-black' src={symBol} alt='no permission image' />
            </div>
        </div>
    )
}

